import { describe, expect, it, vi } from 'vitest';

import {
  EMPTY_DATABASE,
  emptyTrainerDoc,
  loadDatabase,
  normalizeDatabase,
  persistDatabase,
  PROGRESS_RECOVERY_KEY,
  releaseDamaged,
  PROGRESS_STORAGE_KEY
} from '@shared/progress-store/lib/progressDb.ts';
import { defaultExamDate } from '@shared/config/exam.ts';
import { DEFAULT_PLAYS_ALLOWED } from '@shared/config/examConditions.ts';
import { TRAINERS, TRAINER_ORDER } from '@shared/config/trainers.ts';

import { installMemoryStorage } from '../support/memoryStorage.ts';

/*
 * A fresh trainer document used to hardcode `writingMinutes: 30` and re-implement
 * `defaultExamDate()` inline. Both B1 and B2 run a 30-minute Schreiben, so the constant
 * looked right and would have gone on looking right — a fourth single-level trainer with a
 * different official time would silently have inherited B1's, and `emptyTrainerDoc` takes no
 * trainer to notice.
 */

describe('a fresh trainer document', () => {
  for (const trainer of TRAINER_ORDER) {
    it(`gives ${trainer} the writing time its own paper allows`, () => {
      expect(emptyTrainerDoc(trainer).settings.writingMinutes).toBe(
        TRAINERS[trainer].paper.minutes.schreiben
      );
    });
  }

  it('dates itself with the shared default, not a second copy of the maths', () => {
    expect(emptyTrainerDoc(TRAINER_ORDER[0] ?? 'a2b1').settings.examDate).toBe(defaultExamDate());
  });

  it("takes its play count from its own paper's default, not a constant", () => {
    for (const trainer of TRAINER_ORDER) {
      expect(emptyTrainerDoc(trainer).settings.playsAllowed).toBe(
        DEFAULT_PLAYS_ALLOWED[TRAINERS[trainer].format]
      );
    }
    /* The single-level paper plays each clip once; the DTZ states no count, so its default is
       this trainer's own training value. The two must differ, or this sweep proves nothing. */
    expect(DEFAULT_PLAYS_ALLOWED['single-level']).toBe(1);
    expect(DEFAULT_PLAYS_ALLOWED['dtz-paper']).toBe(2);
  });

  it('gives the DTZ document 30 minutes of writing and two plays per text', () => {
    const dtz = TRAINER_ORDER.find(trainer => TRAINERS[trainer].format === 'dtz-paper');
    if (dtz === undefined) throw new Error('the registry has no DTZ trainer');
    expect(emptyTrainerDoc(dtz).settings).toMatchObject({ writingMinutes: 30, playsAllowed: 2 });
    expect(normalizeDatabase({}).dtz?.settings).toMatchObject({ writingMinutes: 30, playsAllowed: 2 });
  });

  it('is empty of study state', () => {
    const doc = emptyTrainerDoc('b1');
    expect(doc.attempts).toEqual([]);
    expect(doc.learnDone).toEqual({});
    expect(doc.srs).toEqual({});
    expect(doc.activity).toEqual({});
  });
});

/* Each trainer's slice of the empty and normalised documents has to be that trainer's own,
   not a shared object — the writing time is the visible difference. */
describe('the documents built from it', () => {
  const docKeys = TRAINER_ORDER.map(trainer => TRAINERS[trainer].docKey).filter(
    (key): key is NonNullable<typeof key> => key !== null
  );

  it('seeds every trainer slice of EMPTY_DATABASE from that trainer', () => {
    for (const key of docKeys) {
      expect(EMPTY_DATABASE[key]?.settings.writingMinutes).toBe(TRAINERS[key].paper.minutes.schreiben);
    }
  });

  it('defaults a missing trainer slice from that trainer too', () => {
    const normalized = normalizeDatabase({});
    for (const key of docKeys) {
      expect(normalized[key]?.settings.writingMinutes).toBe(TRAINERS[key].paper.minutes.schreiben);
    }
  });
});

/*
 * Regression: stored text that was not a document (truncated JSON, an array, a hand edit)
 * loaded as an empty document, and the first write saved that over the original — every
 * attempt gone without a word. It is now set aside under its own key first.
 */
describe('loading a damaged stored document', () => {
  const seeded = (raw: string): void => {
    installMemoryStorage();
    localStorage.setItem(PROGRESS_STORAGE_KEY, raw);
  };

  it.each(['{"attempts":[{"id":1', '[1,2,3]', 'null', '42', 'not json at all'])(
    'sets %j aside byte for byte and starts fresh',
    raw => {
      seeded(raw);
      const { db, damaged } = loadDatabase();
      expect(damaged).toBe(raw);
      expect(localStorage.getItem(PROGRESS_RECOVERY_KEY)).toBe(raw);
      expect(db.attempts).toEqual([]);
      /* Replaced with the fresh document, so the next load is clean and says nothing. */
      expect(loadDatabase().damaged).toBeNull();

      /* Later writes replace the main key; the copy survives them. */
      persistDatabase({ ...db, learnDone: { d1t0: true } });
      expect(localStorage.getItem(PROGRESS_RECOVERY_KEY)).toBe(raw);
    }
  );

  /* Regression (persistence-guardian S1): with no room for the copy, the original was left in
     place — until the first action, when persistDatabase saved the fresh document over it. */
  it('holds every write over the damaged original until the learner releases it', () => {
    seeded('{"attempts":');
    const realSetItem = localStorage.setItem.bind(localStorage);
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      if (key === PROGRESS_RECOVERY_KEY)
        throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
      realSetItem(key, value);
    });

    const { db, damaged, setAside } = loadDatabase();
    expect(damaged).toBe('{"attempts":');
    expect(setAside).toBe(false);

    const held = persistDatabase({ ...db, learnDone: { d1t0: true } });
    expect(held.ok).toBe(false);
    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe('{"attempts":');

    releaseDamaged();
    expect(persistDatabase({ ...db, learnDone: { d1t0: true } }).ok).toBe(true);
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? 'null')).toMatchObject({
      learnDone: { d1t0: true }
    });
    spy.mockRestore();
  });

  it('does not hold writes when the copy was set aside', () => {
    seeded('[1]');
    const { db, setAside } = loadDatabase();
    expect(setAside).toBe(true);
    expect(persistDatabase(db).ok).toBe(true);
  });

  it('loads a good document and touches no recovery key', () => {
    seeded(JSON.stringify({ attempts: [], learnDone: { d1t0: true } }));
    const { db, damaged } = loadDatabase();
    expect(damaged).toBeNull();
    expect(db.learnDone).toEqual({ d1t0: true });
    expect(localStorage.getItem(PROGRESS_RECOVERY_KEY)).toBeNull();
  });

  it('starts an empty browser fresh without calling it damage', () => {
    installMemoryStorage();
    expect(loadDatabase().damaged).toBeNull();
  });
});

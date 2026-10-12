import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS } from '@shared/config/exam.ts';
import { TRAINERS, TRAINER_ORDER } from '@shared/config/trainers.ts';
import { type DualLevelAttempt, type ProgressDatabase } from '@shared/types/progress.ts';
import { type LevelTrainerDoc } from '@shared/types/trainer.ts';
import { getLogEntries, logger } from '@shared/lib/logger.ts';
import { describeImport, planImport, readBackup } from '@shared/progress-store/lib/importProgress.ts';
import { normalizeDatabase } from '@shared/progress-store/lib/progressDb.ts';

/*
 * Importing a backup exported by the pre-B1/B2 app used to empty both trainer documents —
 * attempts `[]`, learnDone `{}`, srs `{}` — with no confirmation, and the fresh `_updatedAt`
 * then pushed that emptiness to the cloud row and every other device. The file says nothing
 * about those trainers, which is not the same as asking for them to be deleted.
 *
 * Every trainer here comes from the registry rather than a hardcoded list, so a fourth one
 * inherits this suite unedited.
 */

const attempt = (id: number): DualLevelAttempt => ({
  id,
  examId: 1,
  mode: 'full',
  date: new Date(id).toISOString(),
  times: {},
  scores: {},
  sb: null,
  answers: {},
  ratings: {}
});

const levelDoc = (over: Partial<LevelTrainerDoc> = {}): LevelTrainerDoc => ({
  attempts: [],
  learnDone: {},
  srs: {},
  activity: {},
  settings: { examDate: '2026-10-01', writingMinutes: 30, playsAllowed: 1 },
  ...over
});

/** The document keys of the trainers that keep their own slice. */
const docKeys = TRAINER_ORDER.map(trainer => TRAINERS[trainer].docKey).filter(
  (key): key is NonNullable<typeof key> => key !== null
);

/** A stored document where every trainer has work in it. */
const stored = (): ProgressDatabase =>
  normalizeDatabase({
    attempts: [attempt(1)],
    learnDone: { d1t0: true },
    settings: DEFAULT_SETTINGS,
    srs: { 'a2b1.v.001': { box: 3, due: '2026-05-01', seen: 6, correct: 5, wrong: 1 } },
    activity: { '2026-05-01': 4 },
    ...Object.fromEntries(
      docKeys.map(key => [
        key,
        levelDoc({
          attempts: [{ ...attempt(2), level: key } as never],
          learnDone: { d2t1: true },
          srs: { [`${key}.v.001`]: { box: 5, due: '2026-06-01', seen: 20, correct: 18, wrong: 2 } }
        })
      ])
    )
  });

/** A backup as the app exported it before the level trainers existed. */
const preBranchFile = (): unknown => ({
  attempts: [attempt(9)],
  learnDone: { d3t0: true },
  settings: DEFAULT_SETTINGS
});

const rootTrainer = TRAINER_ORDER.find(trainer => TRAINERS[trainer].docKey === null);
if (rootTrainer === undefined) throw new Error('a trainer has to own the root of the document');

describe('planImport', () => {
  it('keeps the progress of every trainer a pre-branch backup does not mention', () => {
    const before = stored();

    const plan = planImport(before, preBranchFile());

    expect(plan).not.toBeNull();
    expect(plan?.replaces).toEqual([rootTrainer]);
    expect(plan?.keeps).toEqual(TRAINER_ORDER.filter(trainer => trainer !== rootTrainer));
    for (const key of docKeys) {
      expect(plan?.database[key]?.attempts).toHaveLength(1);
      expect(plan?.database[key]?.learnDone).toEqual({ d2t1: true });
      expect(plan?.database[key]?.srs[`${key}.v.001`]?.box).toBe(5);
    }
  });

  it('still replaces the slice the file does carry', () => {
    const plan = planImport(stored(), preBranchFile());

    expect(plan?.database.attempts.map(entry => entry.id)).toEqual([9]);
    expect(plan?.database.learnDone).toEqual({ d3t0: true });
  });

  it('replaces a trainer the file mentions, even with an empty document', () => {
    const [key] = docKeys;
    if (key === undefined) throw new Error('this suite needs a trainer with its own document');

    const plan = planImport(stored(), { ...(preBranchFile() as object), [key]: levelDoc() });

    /* Present-but-empty is an instruction; absent is not. */
    expect(plan?.database[key]?.attempts).toEqual([]);
    expect(plan?.database[key]?.learnDone).toEqual({});
  });

  it('imports a file that carries only one trainer without touching the others', () => {
    const [key] = docKeys;
    if (key === undefined) throw new Error('this suite needs a trainer with its own document');
    const before = stored();

    const plan = planImport(before, { [key]: levelDoc({ learnDone: { d5t0: true } }) });

    expect(plan?.database[key]?.learnDone).toEqual({ d5t0: true });
    /* The root trainer is not in the file, so its attempts and exam conditions stay. */
    expect(plan?.database.attempts.map(entry => entry.id)).toEqual([1]);
    expect(plan?.database.learnDone).toEqual({ d1t0: true });
    expect(plan?.database.settings).toEqual(before.settings);
  });

  it('keeps the DTZ document when restoring a backup written before the DTZ trainer existed', () => {
    const before = stored();
    const dtzKey =
      TRAINERS[TRAINER_ORDER.find(trainer => TRAINERS[trainer].format === 'dtz-paper') ?? 'a2b1'].docKey;
    if (dtzKey === null) throw new Error('the DTZ trainer keeps its own document');
    expect(before[dtzKey]?.learnDone).toEqual({ d2t1: true });

    /* Every other trainer's slice is in the file — only the DTZ one is not. */
    const file: Partial<Record<string, unknown>> = { ...(preBranchFile() as object) };
    for (const key of docKeys) if (key !== dtzKey) file[key] = levelDoc({ learnDone: { d7t0: true } });
    const plan = planImport(before, file);

    expect(plan?.keeps).toEqual([TRAINER_ORDER.find(trainer => TRAINERS[trainer].docKey === dtzKey)]);
    expect(plan?.database[dtzKey]?.learnDone).toEqual({ d2t1: true });
    expect(plan?.database[dtzKey]?.attempts).toHaveLength(1);
  });

  it('refuses a file that speaks for no trainer at all', () => {
    for (const parsed of [{}, [], null, 7, 'progress', { unrelated: true }]) {
      expect(planImport(stored(), parsed)).toBeNull();
    }
  });
});

describe('describeImport', () => {
  it('names what is replaced and what is kept', () => {
    const plan = planImport(stored(), preBranchFile());
    if (!plan) throw new Error('the pre-branch file is a valid export');

    const description = describeImport(plan);

    expect(description).toContain(TRAINERS[rootTrainer].short);
    for (const trainer of plan.keeps) expect(description).toContain(TRAINERS[trainer].short);
    expect(description).toMatch(/stays exactly as it is|stays exactly as they are|their progress stays/);
    /* The import trips the debounced push, so the dialog has to say the cloud is involved. */
    expect(description).toMatch(/syncs to the cloud/);
  });

  it('says nothing about kept trainers when the file carries them all', () => {
    const whole = stored();
    const plan = planImport(whole, JSON.parse(JSON.stringify(whole)));
    if (!plan) throw new Error('a full export is a valid export');

    expect(plan.keeps).toEqual([]);
    expect(describeImport(plan)).not.toMatch(/not in the file/);
  });
});

describe('readBackup', () => {
  const firstDocKey = docKeys[0];
  if (firstDocKey === undefined) throw new Error('a trainer keeps its own document');

  const failure = (text: string): { code: string; message: string } | null => {
    const result = readBackup(text, stored());
    return result.ok ? null : { code: result.error.code, message: result.error.message };
  };

  it('plans a real export', () => {
    const whole = stored();
    const result = readBackup(JSON.stringify(whole), whole);
    expect(result.ok ? result.value.replaces : null).toEqual(TRAINER_ORDER);
  });

  it('says the file is not JSON', () => {
    expect(failure('{"attempts": [')?.code).toBe('import-not-json');
    expect(failure('')?.code).toBe('import-not-json');
  });

  it('says the JSON is not a trainer backup', () => {
    for (const text of ['[]', '7', 'null', '"progress"', '{}', '{"unrelated":true}']) {
      expect(failure(text)?.code).toBe('import-not-export');
    }
  });

  it('names the damaged root field and what it is', () => {
    const bad = failure(JSON.stringify({ ...(preBranchFile() as object), attempts: 'none' }));
    expect(bad?.code).toBe('import-bad-field');
    expect(bad?.message).toContain('"attempts" should be a list, but it is text');
    expect(bad?.message).toContain('Nothing was changed');
  });

  it('names a damaged field inside a trainer slice', () => {
    const bad = failure(JSON.stringify({ [firstDocKey]: { ...levelDoc(), learnDone: 'done' } }));
    expect(bad?.message).toContain(`"${firstDocKey}.learnDone" should be a group of entries, but it is text`);
  });

  it('names a trainer slice that is not an object at all', () => {
    const bad = failure(JSON.stringify({ [firstDocKey]: [1, 2] }));
    expect(bad?.message).toContain(`"${firstDocKey}" should be a group of entries, but it is a list`);
  });

  it('leaves a slice the file does not mention alone, even if malformed elsewhere', () => {
    /* `weakness` is not a slice field; normalizeDatabase repairs it. */
    expect(readBackup(JSON.stringify({ ...(preBranchFile() as object), weakness: 3 }), stored()).ok).toBe(
      true
    );
  });

  it('accepts null for a map field — an old hand-edited export — and reads it as empty', () => {
    const result = readBackup(
      JSON.stringify({ [firstDocKey]: { ...levelDoc(), learnDone: null, srs: null } }),
      stored()
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.database[firstDocKey]?.learnDone).toEqual({});
    expect(readBackup(JSON.stringify({ ...(preBranchFile() as object), learnDone: null }), stored()).ok).toBe(
      true
    );
  });

  it('keeps the file text out of the failure (the log must never quote a backup)', () => {
    const result = readBackup('{"answers": {"w.text": "Liebe Anna, ich', stored());
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect('cause' in result.error).toBe(false);
      logger.warn('import', 'Backup refused', result.error);
    }
    expect(getLogEntries().at(-1)?.message).toBe('Backup refused — [import-not-json]');
  });
});

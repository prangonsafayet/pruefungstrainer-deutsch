import { describe, expect, it } from 'vitest';

import { A2B1_EXAMS } from '@content/a2b1/exams/allExams.ts';
import { B1_EXAMS } from '@content/b1/exams/allExams.ts';
import { B2_EXAMS } from '@content/b2/exams/allExams.ts';
import { DTZ_EXAMS } from '@content/dtz/exams/allExams.ts';
import { type ReviewSection } from '@shared/exam-run/types/examFormat.ts';
import { type AttemptMode, type DualLevelExam } from '@shared/types/exam.ts';
import { type DtzAttempt } from '@shared/types/dtzExam.ts';
import { type AnswerMap, type AnswerValue, type DualLevelAttempt } from '@shared/types/progress.ts';
import { type SingleLevelAttempt, type SingleLevelExam } from '@shared/types/singleLevelExam.ts';

import { dtzItems } from '@features/mock-exam/lib/formats/dtz-paper/items.ts';
import {
  buildReviewSections as dtzReview,
  NO_MATCH_TEXT
} from '@features/mock-exam/lib/formats/dtz-paper/review.ts';
import { scoreModule } from '@features/mock-exam/lib/formats/dtz-paper/scoring.ts';
import { buildReviewSections as dualReview } from '@features/mock-exam/lib/formats/dual-level/review.ts';
import {
  scoreHoeren as dualHoeren,
  scoreLesen as dualLesen,
  scoreSprachbausteine as dualSprachbausteine
} from '@features/mock-exam/lib/formats/dual-level/scoring.ts';
import { buildReviewSections as singleReview } from '@features/mock-exam/lib/formats/single-level/review.ts';
import {
  scoreHoeren as singleHoeren,
  scoreLesen as singleLesen,
  scoreSprachbausteine as singleSprachbausteine
} from '@features/mock-exam/lib/formats/single-level/scoring.ts';

import { dtzKey, dualKey, singleKey } from '../support/answerKeys.ts';

/*
 * The review screen re-marks every item to show ticks and crosses. Nothing checked that it
 * agrees with the scoring that produced the number at the top of the same screen. Swept over
 * every authored Modelltest of every paper:
 *
 *   - the answer key gives a row per item, every row correct, and `given` reads like `expected`;
 *   - a blank sitting gives the same rows, none correct and none with a `given`;
 *   - a mixed sitting (right, wrong, blank, an index no option has) marks exactly as many rows
 *     correct as the scoring counted, module by module;
 *   - a module-only attempt shows only that module's section.
 */

/**
 * The key, bent item by item: every third answer blank, every third wrong (a boolean flipped, an
 * index moved on, a gap misspelt), and the first numeric one an index no option has.
 */
const mixed = (key: AnswerMap): AnswerMap => {
  const out: Record<string, AnswerValue> = {};
  let outOfRangeDone = false;
  Object.entries(key).forEach(([id, value], index) => {
    if (value === undefined || index % 3 === 0) return;
    if (index % 3 === 1) {
      out[id] = value;
      return;
    }
    if (typeof value === 'boolean') out[id] = !value;
    else if (typeof value === 'string') out[id] = `${value}x`;
    else if (!outOfRangeDone) {
      out[id] = 99;
      outOfRangeDone = true;
    } else out[id] = value === 0 ? 1 : 0;
  });
  return out;
};

const allRows = (sections: readonly ReviewSection[]) => sections.flatMap(section => section.rows);

const correctIn = (sections: readonly ReviewSection[], module: string): number =>
  sections.find(section => section.module === module)?.rows.filter(row => row.correct).length ?? -1;

const BASE = { id: 1, date: '2026-01-01T00:00:00.000Z', times: {}, ratings: {} } as const;

const singleAttempt = (
  exam: SingleLevelExam,
  answers: AnswerMap,
  mode: AttemptMode = 'full'
): SingleLevelAttempt => ({
  ...BASE,
  examId: exam.id,
  mode,
  scores: { lesen: 50 },
  answers
});

const dualAttempt = (
  exam: DualLevelExam,
  answers: AnswerMap,
  mode: AttemptMode = 'full',
  sb: DualLevelAttempt['sb'] = { correct: 3, of: 17, percent: 18 }
): DualLevelAttempt => ({ ...BASE, examId: exam.id, mode, scores: { hoeren: 21 }, sb, answers });

const dtzAttempt = (examId: number, answers: AnswerMap, mode: AttemptMode = 'full'): DtzAttempt => ({
  ...BASE,
  examId,
  mode,
  scores: { lesen: 7 },
  answers
});

describe('single-level review (telc B1 and B2)', () => {
  const exams = [...B1_EXAMS, ...B2_EXAMS];

  it.each(exams.map(exam => [exam.level, exam.id, exam] as const))(
    '%s Modelltest %i: the key reviews as all correct',
    (_level, _id, exam) => {
      const key = singleKey(exam);
      const rows = allRows(singleReview(exam, singleAttempt(exam, key)));

      expect(rows).toHaveLength(Object.keys(key).length);
      expect(rows.every(row => row.correct)).toBe(true);
      for (const row of rows) expect(row.given).toBe(row.expected);
    }
  );

  it.each(exams.map(exam => [exam.level, exam.id, exam] as const))(
    '%s Modelltest %i: a blank sitting has no given answer and nothing correct',
    (_level, _id, exam) => {
      const rows = allRows(singleReview(exam, singleAttempt(exam, {})));

      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.given).toBeNull();
        expect(row.correct).toBe(false);
        expect(row.expected).not.toBe('');
      }
    }
  );

  it.each(exams.map(exam => [exam.level, exam.id, exam] as const))(
    '%s Modelltest %i: a mixed sitting marks exactly what the scoring counted',
    (_level, _id, exam) => {
      const answers = mixed(singleKey(exam));
      const sections = singleReview(exam, singleAttempt(exam, answers));

      expect(correctIn(sections, 'lesen')).toBe(singleLesen(exam, answers).correct);
      expect(correctIn(sections, 'sprachbausteine')).toBe(singleSprachbausteine(exam, answers).correct);
      expect(correctIn(sections, 'hoeren')).toBe(singleHoeren(exam, answers).correct);
    }
  );

  it('reads an index no option has as its letter, not as a crash', () => {
    const exam = B1_EXAMS[0];
    if (!exam) throw new Error('no B1 exam');
    const sections = singleReview(exam, singleAttempt(exam, { 'l1.0': 99, 's1.0': 99, 's2.0': 99 }));
    const rows = allRows(sections);

    expect(rows.find(row => row.id === 'l1.0')?.given).toBe('100) ');
    expect(rows.find(row => row.id === 's1.0')?.given).toBeNull();
    expect(rows.find(row => row.id === 's2.0')?.given).toBeNull();
  });

  it('shows only the module the attempt covered, with its score and the module maximum', () => {
    const exam = B1_EXAMS[0];
    if (!exam) throw new Error('no B1 exam');

    expect(singleReview(exam, singleAttempt(exam, {})).map(section => section.module)).toEqual([
      'lesen',
      'sprachbausteine',
      'hoeren'
    ]);
    const lesenOnly = singleReview(exam, singleAttempt(exam, {}, 'lesen'));
    expect(lesenOnly.map(section => section.module)).toEqual(['lesen']);
    expect(lesenOnly[0]?.heading).toMatch(/— 50\/75$/);
    /* A module with no stored score reads 0, not "undefined". */
    const hoerenOnly = singleReview(exam, singleAttempt(exam, {}, 'hoeren'));
    expect(hoerenOnly[0]?.heading).toMatch(/— 0\/75$/);
    expect(singleReview(exam, singleAttempt(exam, {}, 'schreiben'))).toEqual([]);
  });
});

describe('dual-level review (telc A2·B1)', () => {
  it.each(A2B1_EXAMS.map(exam => [exam.id, exam] as const))(
    'Modelltest %i: the key reviews as all correct',
    (_id, exam) => {
      const key = dualKey(exam);
      const rows = allRows(dualReview(exam, dualAttempt(exam, key)));

      expect(rows).toHaveLength(Object.keys(key).length);
      expect(rows.filter(row => !row.correct).map(row => row.id)).toEqual([]);
    }
  );

  it.each(A2B1_EXAMS.map(exam => [exam.id, exam] as const))(
    'Modelltest %i: a blank sitting has no given answer and nothing correct',
    (_id, exam) => {
      const rows = allRows(dualReview(exam, dualAttempt(exam, {})));

      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.given).toBeNull();
        expect(row.correct).toBe(false);
      }
    }
  );

  it.each(A2B1_EXAMS.map(exam => [exam.id, exam] as const))(
    'Modelltest %i: a mixed sitting marks exactly what the scoring counted',
    (_id, exam) => {
      const answers = mixed(dualKey(exam));
      const sections = dualReview(exam, dualAttempt(exam, answers));

      expect(correctIn(sections, 'lesen')).toBe(dualLesen(exam, answers).correct);
      expect(correctIn(sections, 'sprachbausteine')).toBe(dualSprachbausteine(exam, answers).correct);
      expect(correctIn(sections, 'hoeren')).toBe(dualHoeren(exam, answers).correct);
    }
  );

  it('leaves Sprachbausteine out when the attempt has no Sprachbausteine score', () => {
    const exam = A2B1_EXAMS[0];
    if (!exam) throw new Error('no A2·B1 exam');

    const withSb = dualReview(exam, dualAttempt(exam, {}));
    expect(withSb.map(section => section.module)).toEqual(['lesen', 'sprachbausteine', 'hoeren']);
    expect(withSb[1]?.heading).toBe('Sprachbausteine — 3/17 (18%)');
    expect(withSb[0]?.heading).toBe('Lesen — 0/60');
    expect(withSb[2]?.heading).toBe('Hören — 21/60');
    expect(withSb[2]?.transcripts).toHaveLength(2);

    expect(dualReview(exam, dualAttempt(exam, {}, 'full', null)).map(section => section.module)).toEqual([
      'lesen',
      'hoeren'
    ]);
    expect(dualReview(exam, dualAttempt(exam, {}, 'hoeren')).map(section => section.module)).toEqual([
      'hoeren'
    ]);
  });

  it('reads an index no option has as blank text rather than crashing', () => {
    const exam = A2B1_EXAMS[0];
    if (!exam) throw new Error('no A2·B1 exam');
    const rows = allRows(dualReview(exam, dualAttempt(exam, { 'l1.0': 99, 'l2.0': 99, 'h5.0': '' })));

    expect(rows.find(row => row.id === 'l1.0')?.given).toBe(') ');
    expect(rows.find(row => row.id === 'l2.0')?.given).toBeNull();
    /* An emptied gap is no answer, not an empty answer. */
    expect(rows.find(row => row.id === 'h5.0')?.given).toBeNull();
  });
});

describe('DTZ review', () => {
  const key = dtzKey;

  it.each(DTZ_EXAMS.map(exam => [exam.id, exam] as const))(
    'Modelltest %i: key, blank and mixed sittings agree with the scoring',
    (_id, exam) => {
      const keyed = allRows(dtzReview(exam, dtzAttempt(exam.id, key(exam))));
      expect(keyed).toHaveLength(45);
      expect(keyed.every(row => row.correct && row.given === row.expected)).toBe(true);

      const blank = allRows(dtzReview(exam, dtzAttempt(exam.id, {})));
      expect(blank.every(row => row.given === null && !row.correct)).toBe(true);

      const answers = mixed(key(exam));
      const sections = dtzReview(exam, dtzAttempt(exam.id, answers));
      /* One point per item on this paper, so the points are the count. */
      for (const module of ['hoeren', 'lesen'] as const) {
        expect(correctIn(sections, module)).toBe(scoreModule(exam, module, answers));
      }
    }
  );

  it('reads X as no matching ad, an unknown index by number, and a missing score as 0', () => {
    const exam = DTZ_EXAMS[0];
    if (!exam) throw new Error('no DTZ exam');
    const xItem = dtzItems(exam, 'lesen').find(item => item.allowsNoMatch && item.options !== null);
    if (!xItem) throw new Error('no Lesen item allows X');

    const sections = dtzReview(exam, dtzAttempt(exam.id, { [xItem.key]: -1 }, 'lesen'));
    expect(sections.map(section => section.module)).toEqual(['lesen']);
    expect(sections[0]?.heading).toMatch(/— 7\/25$/);
    expect(sections[0]?.rows.find(row => row.id === xItem.key)?.given).toBe(NO_MATCH_TEXT);

    const unknown = dtzReview(exam, dtzAttempt(exam.id, { [xItem.key]: 40 }, 'lesen'));
    expect(unknown[0]?.rows.find(row => row.id === xItem.key)?.given).toBe('41) ');

    const hoeren = dtzReview(exam, dtzAttempt(exam.id, {}, 'hoeren'));
    expect(hoeren[0]?.heading).toMatch(/— 0\/20$/);
    expect(hoeren[0]?.transcripts).toHaveLength(1);
  });
});

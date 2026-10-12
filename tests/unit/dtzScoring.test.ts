import { describe, expect, it } from 'vitest';

import { DTZ_PAPER_EXAMS } from '@content/trainers/index.ts';
import { DTZ_PART_LINES } from '@shared/config/dtzExam.ts';
import { NO_MATCH_ANSWER } from '@shared/lib/answers.ts';
import { type AnswerMap, type DtzExam, type DtzLevel } from '@shared/types';

import { buildAttempt } from '@features/mock-exam/lib/formats/dtz-paper/attempt.ts';
import { dtzItems } from '@features/mock-exam/lib/formats/dtz-paper/items.ts';
import { buildReviewSections, NO_MATCH_TEXT } from '@features/mock-exam/lib/formats/dtz-paper/review.ts';
import {
  countUnanswered,
  dtzCertificate,
  dtzLevel,
  gradeFullExam,
  scoreModule
} from '@features/mock-exam/lib/formats/dtz-paper/scoring.ts';

/*
 * The DTZ marking scheme, from the g.a.s.t. Übungssatz (docs/dtz-format.local.md, p. 42–49):
 *   Hören 20 + Lesen 25 items, 1 point each → Teilergebnis 1 of 45: B1 from 33, A2 from 20.
 *   Schreiben of 20: B1 from 15, A2 from 7.   Sprechen of 100: B1 from 75, A2 from 35.
 *   Sprechen unter A2 → no certificate. B1 = Sprechen B1 and (H+L B1 or Schreiben B1).
 *   A2 = Sprechen ≥ A2 and (H+L ≥ A2 or Schreiben ≥ A2). The p. 49 case tables list 5 B1
 *   and 11 A2 combinations.
 */

const exam = (): DtzExam => {
  const first = DTZ_PAPER_EXAMS[0];
  if (!first) throw new Error('the DTZ trainer ships no exams');
  return first;
};

/** Every item answered as the key expects. */
const allCorrect = (paper: DtzExam): AnswerMap =>
  Object.fromEntries(
    [...dtzItems(paper, 'hoeren'), ...dtzItems(paper, 'lesen')].map(item => [item.key, item.expected])
  );

describe('dtzLevel — the three Teilergebnisse at their boundaries', () => {
  it.each([
    ['hoerenLesen', 33, 'B1'],
    ['hoerenLesen', 32, 'A2'],
    ['hoerenLesen', 20, 'A2'],
    ['hoerenLesen', 19, 'unter A2'],
    ['schreiben', 15, 'B1'],
    ['schreiben', 14, 'A2'],
    ['schreiben', 7, 'A2'],
    ['schreiben', 6, 'unter A2'],
    ['sprechen', 75, 'B1'],
    ['sprechen', 74, 'A2'],
    ['sprechen', 35, 'A2'],
    ['sprechen', 34, 'unter A2']
  ] as const)('%s %i → %s', (part, points, level) => {
    expect(dtzLevel(points, DTZ_PART_LINES[part])).toBe(level);
  });
});

describe('dtzCertificate — the p. 49 case tables', () => {
  const LEVELS: readonly DtzLevel[] = ['B1', 'A2', 'unter A2'];
  const combos = LEVELS.flatMap(hoerenLesen =>
    LEVELS.flatMap(schreiben => LEVELS.map(sprechen => ({ hoerenLesen, schreiben, sprechen })))
  );

  it('enumerates all 27 combinations', () => {
    expect(combos).toHaveLength(27);
  });

  it('awards exactly 5 B1 and 11 A2 certificates', () => {
    const results = combos.map(dtzCertificate);
    expect(results.filter(result => result === 'Zertifikat B1')).toHaveLength(5);
    expect(results.filter(result => result === 'Zertifikat A2')).toHaveLength(11);
    expect(results.filter(result => result === 'unter A2')).toHaveLength(11);
  });

  it('never certifies when Sprechen is below A2, whatever the written results', () => {
    for (const combo of combos.filter(entry => entry.sprechen === 'unter A2')) {
      expect(dtzCertificate(combo)).toBe('unter A2');
    }
  });

  it('gives A2, not B1, for Sprechen B1 when neither written part reaches B1', () => {
    expect(dtzCertificate({ hoerenLesen: 'A2', schreiben: 'A2', sprechen: 'B1' })).toBe('Zertifikat A2');
    expect(dtzCertificate({ hoerenLesen: 'unter A2', schreiben: 'unter A2', sprechen: 'B1' })).toBe(
      'unter A2'
    );
  });

  it('grades a full sitting from its section scores', () => {
    expect(gradeFullExam({ hoeren: 15, lesen: 18, schreiben: 6, sprechen: 75 })).toEqual({
      hoerenLesen: 33,
      levels: { hoerenLesen: 'B1', schreiben: 'unter A2', sprechen: 'B1' },
      result: 'Zertifikat B1'
    });
    expect(gradeFullExam({ hoeren: 15, lesen: 18, schreiben: 20, sprechen: 74 }).result).toBe(
      'Zertifikat A2'
    );
  });
});

describe('the item list every DTZ marker walks', () => {
  it('numbers Hören 1–20 and Lesen 21–45 without gaps or repeated keys', () => {
    const hoeren = dtzItems(exam(), 'hoeren');
    const lesen = dtzItems(exam(), 'lesen');
    expect(hoeren.map(item => item.number)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(lesen.map(item => item.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 21));
    const keys = [...hoeren, ...lesen].map(item => item.key);
    expect(new Set(keys).size).toBe(45);
  });

  it('splits each module into the spec counts per Teil', () => {
    const perTeil = (module: 'hoeren' | 'lesen'): readonly number[] => {
      const counts: number[] = [];
      for (const item of dtzItems(exam(), module)) counts[item.teil - 1] = (counts[item.teil - 1] ?? 0) + 1;
      return counts;
    };
    expect(perTeil('hoeren')).toEqual([4, 5, 8, 3]);
    expect(perTeil('lesen')).toEqual([5, 5, 6, 3, 6]);
  });
});

describe('scoreModule and countUnanswered', () => {
  it('scores a perfect paper 20 and 25, and a blank one 0', () => {
    for (const paper of DTZ_PAPER_EXAMS) {
      expect(scoreModule(paper, 'hoeren', allCorrect(paper))).toBe(20);
      expect(scoreModule(paper, 'lesen', allCorrect(paper))).toBe(25);
      expect(scoreModule(paper, 'hoeren', {})).toBe(0);
      expect(scoreModule(paper, 'lesen', {})).toBe(0);
    }
  });

  it('credits X only on the one Lesen Teil 2 situation without an ad', () => {
    const paper = exam();
    const index = paper.lesen.teil2.answers.indexOf(NO_MATCH_ANSWER);
    const other = index === 0 ? 1 : 0;
    expect(index).toBeGreaterThanOrEqual(0);
    expect(scoreModule(paper, 'lesen', { [`l2.${String(index)}`]: NO_MATCH_ANSWER })).toBe(1);
    expect(scoreModule(paper, 'lesen', { [`l2.${String(other)}`]: NO_MATCH_ANSWER })).toBe(0);
  });

  it('counts every blank item, and none once everything is answered', () => {
    const paper = exam();
    expect(countUnanswered(paper, 'hoeren', {})).toBe(20);
    expect(countUnanswered(paper, 'lesen', {})).toBe(25);
    expect(countUnanswered(paper, 'lesen', allCorrect(paper))).toBe(0);
    /* A wrong answer is still an answer — including X. */
    expect(countUnanswered(paper, 'lesen', { 'l2.0': NO_MATCH_ANSWER })).toBe(24);
    expect(countUnanswered(paper, 'schreiben', {})).toBe(0);
  });
});

describe('a stored DTZ attempt', () => {
  const run = (mode: 'full' | 'lesen', answers: AnswerMap) =>
    buildAttempt({
      exam: exam(),
      mode,
      queue: mode === 'full' ? ['hoeren', 'lesen', 'schreiben', 'sprechen'] : ['lesen'],
      answers,
      ratings: mode === 'full' ? { schreiben: 12, sprechen: 80 } : {},
      times: {}
    });

  it('stores a certificate for a full sitting and none for practice', () => {
    expect(run('full', allCorrect(exam())).result).toBe('Zertifikat B1');
    expect(run('lesen', allCorrect(exam())).result).toBeUndefined();
    expect(run('lesen', allCorrect(exam())).scores).toEqual({ lesen: 25 });
  });

  it('reviews Lesen as 25 rows numbered 21–45, the X answer shown as X', () => {
    const paper = exam();
    const index = paper.lesen.teil2.answers.indexOf(NO_MATCH_ANSWER);
    const attempt = run('lesen', { [`l2.${String(index)}`]: NO_MATCH_ANSWER });
    const [section] = buildReviewSections(paper, attempt);
    expect(section?.rows).toHaveLength(25);
    expect(section?.rows[0]?.label).toBe('Teil 1 · Nr. 21');
    const xRow = section?.rows.find(row => row.id === `l2.${String(index)}`);
    expect(xRow?.given).toBe(NO_MATCH_TEXT);
    expect(xRow?.expected).toBe(NO_MATCH_TEXT);
    expect(xRow?.correct).toBe(true);
  });
});

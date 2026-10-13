import { describe, expect, it } from 'vitest';

import { A2B1_EXAMS } from '@content/a2b1/exams/allExams.ts';
import { B1_EXAMS } from '@content/b1/exams/allExams.ts';
import { DTZ_EXAMS } from '@content/dtz/exams/allExams.ts';
import { type FinishedRun } from '@shared/exam-run/types/examFormat.ts';
import { WRITING_TASK_KEY } from '@shared/lib/answers.ts';
import { type AttemptMode, type ExamModule } from '@shared/types/exam.ts';
import { type AnswerMap } from '@shared/types/progress.ts';

import * as dtz from '@features/mock-exam/lib/formats/dtz-paper/attempt.ts';
import * as dual from '@features/mock-exam/lib/formats/dual-level/attempt.ts';
import * as single from '@features/mock-exam/lib/formats/single-level/attempt.ts';

import { dtzKey, dualKey, singleKey } from '../support/answerKeys.ts';

/*
 * `buildAttempt` is the last step before a sitting is persisted: it marks the answers, copies
 * the self-ratings and, for a full sitting only, stores the verdict. What it writes is what
 * the history, dashboard and sync see for ever after, so each paper is checked for which
 * scores a module-only run stores, that a missing self-rating is 0 rather than absent, and
 * that a verdict never appears on a practice run.
 */

const first = <T>(list: readonly T[]): T => {
  const [head] = list;
  if (head === undefined) throw new Error('an exam list is empty');
  return head;
};

const SINGLE = first(B1_EXAMS);
const DUAL = first(A2B1_EXAMS);
const DTZ = first(DTZ_EXAMS);

const run = <TExam>(
  exam: TExam,
  mode: AttemptMode,
  queue: readonly ExamModule[],
  answers: AnswerMap,
  ratings: FinishedRun<TExam>['ratings'] = {}
): FinishedRun<TExam> => ({ exam, mode, queue, answers, ratings, times: { lesen: 60 } });

describe('single-level buildAttempt (telc B1/B2)', () => {
  const FULL: readonly ExamModule[] = ['lesen', 'sprachbausteine', 'hoeren', 'schreiben', 'sprechen'];

  it('a perfect full sitting stores full marks, the totals and Bestanden', () => {
    const attempt = single.buildAttempt(
      run(SINGLE, 'full', FULL, singleKey(SINGLE), { schreiben: 45, sprechen: 75 })
    );

    expect(attempt.scores).toEqual({
      lesen: 75,
      sprachbausteine: 30,
      hoeren: 75,
      schreiben: 45,
      sprechen: 75
    });
    expect(attempt).toMatchObject({
      written: 225,
      oral: 75,
      total: 300,
      result: 'Bestanden',
      examId: SINGLE.id
    });
    expect(attempt.times).toEqual({ lesen: 60 });
    expect(attempt).not.toHaveProperty('writingTask');

    const toast = single.completionToast(SINGLE, attempt);
    expect(toast.tone).toBe('success');
    expect(toast.title).toMatch(/finished — Bestanden$/);
    expect(toast.description).toMatch(/^225\/225 written · 75\/75 oral\./);
  });

  it('a blank full sitting with no self-ratings fails, with every module scored 0', () => {
    const attempt = single.buildAttempt(run(SINGLE, 'full', FULL, {}));

    expect(attempt.scores).toEqual({ lesen: 0, sprachbausteine: 0, hoeren: 0, schreiben: 0, sprechen: 0 });
    expect(attempt.result).toBe('Nicht bestanden');
    expect(single.completionToast(SINGLE, attempt).tone).toBe('info');
  });

  it('a module practice run stores that module only, no verdict, and says practice saved', () => {
    const attempt = single.buildAttempt(run(SINGLE, 'hoeren', ['hoeren'], singleKey(SINGLE)));

    expect(attempt.scores).toEqual({ hoeren: 75 });
    expect(attempt).not.toHaveProperty('result');
    expect(attempt).not.toHaveProperty('total');
    expect(single.completionToast(SINGLE, attempt).title).toMatch(/practice saved$/);
  });

  it('keeps the chosen writing task, and the sample falls back to the first task', () => {
    const attempt = single.buildAttempt(run(SINGLE, 'schreiben', ['schreiben'], { [WRITING_TASK_KEY]: 0 }));
    expect(attempt.writingTask).toBe(0);

    const firstTask = single.writingSample(SINGLE, {});
    expect(firstTask?.musterloesung).toBe(SINGLE.schreiben.tasks[0]?.musterloesung);
    /* An index no task has (an older paper offered more) still shows a sample, not nothing. */
    expect(single.writingSample(SINGLE, { [WRITING_TASK_KEY]: 7 })).toEqual(firstTask);
  });
});

describe('dual-level buildAttempt (telc A2·B1)', () => {
  const FULL: readonly ExamModule[] = ['lesen', 'sprachbausteine', 'hoeren', 'schreiben', 'sprechen'];

  it('a perfect full sitting is B1 out of 240, with Sprachbausteine kept apart from the total', () => {
    const attempt = dual.buildAttempt(
      run(DUAL, 'full', FULL, dualKey(DUAL), { schreiben: 60, sprechen: 60 })
    );

    expect(attempt.scores).toEqual({ lesen: 60, hoeren: 60, schreiben: 60, sprechen: 60 });
    expect(attempt.sb?.percent).toBe(100);
    expect(attempt).toMatchObject({ total: 240, result: 'B1' });
    const toast = dual.completionToast(DUAL, attempt);
    expect(toast).toMatchObject({ tone: 'success' });
    expect(toast.description).toMatch(/^240\/240 points\./);
  });

  it('a blank full sitting is Nicht bestanden, told as info', () => {
    const attempt = dual.buildAttempt(run(DUAL, 'full', FULL, {}));

    expect(attempt.result).toBe('Nicht bestanden');
    expect(dual.completionToast(DUAL, attempt).tone).toBe('info');
  });

  it('a module practice run has no Sprachbausteine score unless it ran, and no verdict', () => {
    const lesen = dual.buildAttempt(run(DUAL, 'lesen', ['lesen'], dualKey(DUAL)));
    expect(lesen.scores).toEqual({ lesen: 60 });
    expect(lesen.sb).toBeNull();
    expect(lesen).not.toHaveProperty('result');
    expect(dual.completionToast(DUAL, lesen).title).toMatch(/practice saved$/);

    const sb = dual.buildAttempt(run(DUAL, 'sprachbausteine', ['sprachbausteine'], {}));
    expect(sb.sb).toMatchObject({ correct: 0, percent: 0 });
  });

  it('the writing sample asks for every point of the one task', () => {
    expect(dual.writingSample(DUAL).tipps).toMatch(/all three points\?$/);
  });
});

describe('DTZ buildAttempt', () => {
  const FULL: readonly ExamModule[] = ['hoeren', 'lesen', 'schreiben', 'sprechen'];

  it('a perfect full sitting stores the scores and Zertifikat B1, never the part levels', () => {
    const attempt = dtz.buildAttempt(
      run(DTZ, 'full', FULL, { ...dtzKey(DTZ), [WRITING_TASK_KEY]: 1 }, { schreiben: 20, sprechen: 100 })
    );

    expect(attempt.scores).toEqual({ hoeren: 20, lesen: 25, schreiben: 20, sprechen: 100 });
    expect(attempt.result).toBe('Zertifikat B1');
    expect(attempt.writingTask).toBe(1);
    expect(Object.keys(attempt)).not.toContain('levels');
    const toast = dtz.completionToast(DTZ, attempt);
    expect(toast.tone).toBe('success');
    expect(toast.description).toMatch(/^Hören \+ Lesen 45\/45 · Schreiben 20\/20 · Sprechen 100\/100\./);
  });

  it('a blank full sitting is unter A2, told as info', () => {
    const attempt = dtz.buildAttempt(run(DTZ, 'full', FULL, {}));

    expect(attempt.result).toBe('unter A2');
    expect(dtz.completionToast(DTZ, attempt).tone).toBe('info');
  });

  it('a practice run has no result and no writing task unless one was chosen', () => {
    const attempt = dtz.buildAttempt(run(DTZ, 'sprechen', ['sprechen'], {}));

    expect(attempt.scores).toEqual({ sprechen: 0 });
    expect(attempt).not.toHaveProperty('result');
    expect(attempt).not.toHaveProperty('writingTask');
    expect(dtz.completionToast(DTZ, attempt).title).toMatch(/practice saved$/);
  });

  it('the writing sample follows the chosen Aufgabe and falls back to A', () => {
    expect(dtz.writingSample(DTZ, { [WRITING_TASK_KEY]: 1 })?.musterloesung).toBe(
      DTZ.schreiben.tasks[1]?.musterloesung
    );
    expect(dtz.writingSample(DTZ, { [WRITING_TASK_KEY]: 9 })?.musterloesung).toBe(
      DTZ.schreiben.tasks[0]?.musterloesung
    );
  });
});

import { type DtzExam } from '@shared/types/dtzExam.ts';
import { type DualLevelExam } from '@shared/types/exam.ts';
import { type AnswerMap, type AnswerValue } from '@shared/types/progress.ts';
import { type SingleLevelExam } from '@shared/types/singleLevelExam.ts';

import { dtzItems } from '@features/mock-exam/lib/formats/dtz-paper/items.ts';

/*
 * The answer key of a paper as the stored answer map a perfect sitting leaves behind. Built
 * from the exam's own data, so a suite can sweep every authored mock exam.
 */

const keyEntries = (prefix: string, values: readonly AnswerValue[]): [string, AnswerValue][] =>
  values.map((value, index) => [`${prefix}${String(index)}`, value]);

export const singleKey = (exam: SingleLevelExam): AnswerMap =>
  Object.fromEntries([
    ...keyEntries('l1.', exam.lesen.teil1.answers),
    ...keyEntries(
      'l2.',
      exam.lesen.teil2.questions.map(question => question.answer)
    ),
    ...keyEntries('l3.', exam.lesen.teil3.answers),
    ...keyEntries(
      's1.',
      exam.sprachbausteine.teil1.gaps.map(gap => gap.answer)
    ),
    ...keyEntries('s2.', exam.sprachbausteine.teil2.answers),
    ...keyEntries(
      'h1.',
      exam.hoeren.teil1.items.map(item => item.answer)
    ),
    ...keyEntries(
      'h2.',
      exam.hoeren.teil2.statements.map(item => item.answer)
    ),
    ...keyEntries(
      'h3.',
      exam.hoeren.teil3.items.map(item => item.answer)
    )
  ]);

export const dualKey = (exam: DualLevelExam): AnswerMap =>
  Object.fromEntries([
    ...keyEntries('l1.', exam.lesen.teil1.answers),
    ...keyEntries(
      'l2.',
      exam.lesen.teil2.questions.map(question => question.answer)
    ),
    ...keyEntries('l3.', exam.lesen.teil3.answers),
    ...keyEntries(
      'l4.',
      exam.lesen.teil4.statements.map(statement => statement.answer)
    ),
    ...keyEntries(
      's1.',
      exam.sprachbausteine.teil1.gaps.map(gap => gap.answer)
    ),
    ...keyEntries('s2.', exam.sprachbausteine.teil2.answers),
    ...keyEntries(
      's3.',
      exam.sprachbausteine.teil3.items.map(item => item.answer)
    ),
    ...keyEntries(
      'h1.',
      exam.hoeren.teil1.items.map(item => item.answer)
    ),
    ...keyEntries(
      'h2.',
      exam.hoeren.teil2.items.map(item => item.answer)
    ),
    ...keyEntries(
      'h3.',
      exam.hoeren.teil3.items.map(item => item.answer)
    ),
    ...keyEntries(
      'h4.',
      exam.hoeren.teil4.questions.map(question => question.answer)
    ),
    ...keyEntries(
      'h5.',
      exam.hoeren.teil5.gaps.map(gap => gap.answer)
    )
  ]);

export const dtzKey = (exam: DtzExam): AnswerMap =>
  Object.fromEntries(
    (['hoeren', 'lesen'] as const).flatMap(module =>
      dtzItems(exam, module).map(item => [item.key, item.expected])
    )
  );

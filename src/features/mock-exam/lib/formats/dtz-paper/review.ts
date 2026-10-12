/**
 * Every objectively-marked item of a DTZ attempt, turned into review rows numbered 1–45 as on
 * the paper. Same row and section types as the other papers' builders.
 */

import { DTZ_MODULE_META, DTZ_SECTION_MAX } from '@shared/config/dtzExam.ts';
import { NO_MATCH_ANSWER } from '@shared/lib/answers.ts';
import { LETTERS } from '@shared/lib/format.ts';
import { type AnswerValue, type DtzAttempt, type DtzExam } from '@shared/types';

import { attemptIncludes } from '@features/mock-exam/lib/attemptMode.ts';
import { type ReviewRow, type ReviewSection } from '@features/mock-exam/types/examFormat.ts';

import { dtzItems, type DtzItem, type DtzMarkedModule } from './items.ts';

/** How Lesen Teil 2's X reads in the review. */
export const NO_MATCH_TEXT = 'X) keine passende Anzeige';

/** An answer value as the candidate saw it: `b) …`, `X) …` or richtig/falsch. */
const describe = (item: DtzItem, value: AnswerValue | undefined): string | null => {
  if (typeof value === 'boolean') return value ? 'richtig' : 'falsch';
  if (typeof value !== 'number') return null;
  if (value === NO_MATCH_ANSWER) return NO_MATCH_TEXT;
  return `${LETTERS[value] ?? String(value + 1)}) ${item.options?.[value] ?? ''}`;
};

const rows = (exam: DtzExam, module: DtzMarkedModule, attempt: DtzAttempt): readonly ReviewRow[] =>
  dtzItems(exam, module).map<ReviewRow>(item => {
    const given = attempt.answers[item.key];
    return {
      id: item.key,
      label: `Teil ${String(item.teil)} · Nr. ${String(item.number)}`,
      prompt: item.prompt,
      given: describe(item, given),
      expected: describe(item, item.expected) ?? '',
      correct: given === item.expected,
      ...(item.audio === undefined ? {} : { audio: item.audio })
    };
  });

const heading = (module: DtzMarkedModule, attempt: DtzAttempt): string =>
  `${DTZ_MODULE_META[module].name} — ${String(attempt.scores[module] ?? 0)}/${String(DTZ_SECTION_MAX[module])}`;

/** Every objectively-marked item of an attempt, grouped by module, in exam order. */
export const buildReviewSections = (exam: DtzExam, attempt: DtzAttempt): readonly ReviewSection[] => {
  const sections: ReviewSection[] = [];
  if (attemptIncludes(attempt.mode, 'hoeren'))
    sections.push({
      module: 'hoeren',
      heading: heading('hoeren', attempt),
      rows: rows(exam, 'hoeren', attempt),
      /* Teil 4's worked example is scored by nobody, so it belongs to the section. */
      transcripts: [exam.hoeren.teil4.beispiel.audio]
    });
  if (attemptIncludes(attempt.mode, 'lesen'))
    sections.push({
      module: 'lesen',
      heading: heading('lesen', attempt),
      rows: rows(exam, 'lesen', attempt)
    });
  return sections;
};

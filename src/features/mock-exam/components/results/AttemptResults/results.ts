/** Presentation constants of the results and review screens. */

import { type AttemptGrade, type AttemptSummary } from '@shared/exam-run/types/examFormat.ts';

/** How long the headline score counts up. */
export const SCORE_COUNT_UP_MS = 900;

/** Staggers the score bars in behind the headline card. */
export const BARS_ANIMATION_DELAY = '120ms';

export const GRADE_TONE_CLASS: Readonly<Record<AttemptGrade['tone'], string>> = {
  success: 'text-[color:var(--success-foreground)]',
  warning: 'text-[color:var(--warning-foreground)]',
  destructive: 'text-destructive'
};

/** The verdict in one sentence, for the results screen's live region. */
export const verdictSentence = (summary: AttemptSummary): string => {
  const { grade } = summary;
  if (!grade) return `Your score: ${summary.headlineScore}${summary.headlineSuffix}.`;
  const points = grade.points ? `, ${String(grade.points.total)} of ${String(grade.points.of)} points` : '';
  return `Result: ${grade.label}${points}.`;
};

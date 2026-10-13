import { daysBetween, parseIsoDate } from '@shared/lib/format.ts';

/** Under two weeks out, the countdown turns urgent. */
const URGENT_DAYS = 14;

/** The badge variant the countdown wears: passed, urgent, or still comfortably ahead. */
export type ExamCountdownTone = 'warning' | 'destructive' | 'secondary';

export interface ExamCountdown {
  /** The exam date as a German reader writes it, e.g. `12.10.2026`. */
  readonly dateLabel: string;
  /** Whole days from today to the exam; negative once it has passed. */
  readonly days: number;
  readonly tone: ExamCountdownTone;
}

/**
 * The header's exam countdown, as a pure function of the exam date and today (both
 * `YYYY-MM-DD`). Null when the exam date is not a date, so the badge renders nothing.
 */
export const examCountdown = (examDate: string, today: string): ExamCountdown | null => {
  const date = parseIsoDate(examDate);
  const days = daysBetween(today, examDate);
  if (!date || days == null) return null;

  const tone: ExamCountdownTone = days < 0 ? 'warning' : days <= URGENT_DAYS ? 'destructive' : 'secondary';
  return { dateLabel: date.toLocaleDateString('de-DE'), days, tone };
};

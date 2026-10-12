import { toIsoDate } from '@shared/lib/format.ts';

import { examCountdown, type ExamCountdown } from '../lib/examCountdown.ts';

/**
 * The header's exam countdown, measured from today's date at render — the clock read the
 * badge component used to make itself. Null when there is no valid exam date.
 */
export const useExamCountdown = (examDate: string): ExamCountdown | null =>
  examCountdown(examDate, toIsoDate(new Date()));

import { useToday } from '@shared/study-schedule/hooks/useToday.tsx';

import { examCountdown, type ExamCountdown } from './examCountdown.ts';

/**
 * The header's exam countdown, measured from today. `useToday` re-reads the date at local
 * midnight and when the tab comes back, so a tab left open overnight does not keep showing
 * yesterday's count. Null when there is no valid exam date.
 */
export const useExamCountdown = (examDate: string): ExamCountdown | null =>
  examCountdown(examDate, useToday());

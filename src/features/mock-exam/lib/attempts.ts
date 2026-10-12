import { type StoredAttempt } from '@shared/exam-run/types/examFormat.ts';

/** Finds a stored attempt by the id in the route, whichever trainer stored it. */
export const findAttempt = <TAttempt extends StoredAttempt>(
  attempts: readonly TAttempt[],
  attemptId: string | undefined
): TAttempt | undefined => attempts.find(candidate => String(candidate.id) === attemptId);

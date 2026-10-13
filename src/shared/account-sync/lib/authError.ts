import { appError, type AppError } from '@shared/lib/appError.ts';

/** The text of whatever Supabase Auth (or the network under it) failed with. */
const textOf = (error: unknown): string =>
  error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
        ? error.message
        : '';

/**
 * An auth failure in the trainer's own words, with the next step. Supabase's raw messages
 * ("invalid request: both auth code and code verifier should be non-empty", a provider's
 * `error_description` echoed from the address bar) used to reach the learner verbatim — text
 * anyone could put in a link. The raw value goes to the log as `cause`, never on screen.
 */
export const classifyAuthError = (error: unknown, online = true): AppError => {
  const message = textOf(error);
  if (!online || /failed to fetch|networkerror|load failed|fetch failed/i.test(message)) {
    return appError('auth-offline', { cause: error });
  }
  if (/rate limit|too many requests|only request this after|for security purposes/i.test(message)) {
    return appError('auth-rate-limited', { cause: error });
  }
  if (/invalid login credentials|invalid_credentials/i.test(message)) {
    return appError('auth-bad-credentials', { cause: error });
  }
  if (/email not confirmed|email_not_confirmed/i.test(message)) {
    return appError('auth-email-not-confirmed', { cause: error });
  }
  if (/password should|weak password|weak_password/i.test(message)) {
    return appError('auth-weak-password', { cause: error });
  }
  if (/access_denied|denied/i.test(message)) return appError('auth-denied', { cause: error });
  return appError('auth-failed', { cause: error });
};

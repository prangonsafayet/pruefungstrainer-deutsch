import { appError, type AppError } from '@shared/lib/appError.ts';

/** What a failed Supabase call carries: PostgREST's `code`/`message`, plus the HTTP status. */
interface SupabaseFailure {
  readonly code?: unknown;
  readonly message?: unknown;
  readonly status?: unknown;
}

const field = (error: unknown, key: keyof SupabaseFailure): unknown =>
  typeof error === 'object' && error !== null && key in error ? (error as SupabaseFailure)[key] : undefined;

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

/**
 * A sync failure, classified so the learner hears the one thing that helps: offline (wait),
 * refused by row-level security or an expired session (sign in again), rate limited (wait a
 * minute), or anything else (retry). Data is never at risk in any of them — it is in this
 * browser — and every message says so.
 */
export const classifySyncError = (error: unknown, online: boolean): AppError => {
  if (!online) return appError('sync-offline', { cause: error });
  const code = text(field(error, 'code'));
  const status = Number(field(error, 'status') ?? 0);
  const message = text(field(error, 'message'));

  /* 42501 is Postgres "insufficient privilege" — what an RLS denial comes back as; PGRST301
     and a 401/403 are an expired or rejected session. */
  if (
    code === '42501' ||
    code === 'PGRST301' ||
    status === 401 ||
    status === 403 ||
    /row-level security|JWT expired/i.test(message)
  ) {
    return appError('sync-denied', { cause: error });
  }
  if (status === 429 || /rate limit|too many requests/i.test(message))
    return appError('sync-rate-limited', { cause: error });
  if (/failed to fetch|networkerror|load failed/i.test(message))
    return appError('sync-offline', { cause: error });
  return appError('sync-failed', { cause: error });
};

/**
 * The app's one error shape, and a `Result` for the I/O boundaries that can fail.
 *
 * Plain objects, not a class (`local/no-classes`): an `AppError` says what failed (`code`),
 * what to tell the learner (`message` — never a raw exception string or stack), whether
 * carrying on is safe (`recoverable`), and keeps the original exception as `cause` for the
 * local log only.
 */

export type AppErrorCode =
  | 'storage-full'
  | 'storage-unavailable'
  | 'storage-corrupt'
  | 'import-not-json'
  | 'import-not-export'
  | 'import-bad-field'
  | 'sync-offline'
  | 'sync-denied'
  | 'sync-rate-limited'
  | 'sync-failed'
  | 'mic-denied'
  | 'mic-missing'
  | 'mic-unsupported'
  | 'mic-failed'
  | 'tts-unsupported'
  | 'tts-no-voice'
  | 'chunk-load'
  | 'network'
  | 'unknown';

export interface AppError {
  readonly kind: 'app-error';
  readonly code: AppErrorCode;
  /** Shown to the learner as is: plain words and a next action. */
  readonly message: string;
  readonly recoverable: boolean;
  /** The original exception, for the local diagnostics log. Never rendered. */
  readonly cause?: unknown;
}

/** The default learner-facing text per code; a call site may pass a more specific one. */
const MESSAGES: Record<AppErrorCode, string> = {
  'storage-full':
    "This browser's storage is full, so new progress is kept only until you close the tab. Export a backup, then free some space.",
  'storage-unavailable':
    'This browser is not letting the trainer save (private mode or blocked site data). Progress lasts until you close the tab — export a backup to keep it.',
  'storage-corrupt':
    'Your saved progress could not be read, so the trainer started fresh. The damaged copy was kept — download it and keep it safe.',
  'import-not-json': 'That file is not JSON. Choose the .json file the trainer exported.',
  'import-not-export':
    'That JSON is not a trainer backup — it carries no attempts, plans or trainer progress. Choose the file from "Export a backup".',
  'import-bad-field': 'That backup has a damaged field, so nothing was imported.',
  'sync-offline': "You're offline. Progress is saved in this browser and syncs when you're back online.",
  'sync-denied':
    'The cloud database refused this account. Sign out and in again; your progress is safe in this browser.',
  'sync-rate-limited': 'Too many sync requests just now. Wait a minute, then retry — nothing is lost.',
  'sync-failed':
    'Could not reach the cloud database. Your progress is saved in this browser and will sync next time.',
  'mic-denied':
    'Microphone access is blocked. Allow it from the lock icon in the address bar, then press Record again — or speak out loud and rate yourself.',
  'mic-missing':
    'No microphone was found. Plug one in and press Record again, or speak out loud and rate yourself.',
  'mic-unsupported': 'This browser cannot record. Speak out loud and rate yourself.',
  'mic-failed': 'The microphone could not start. Press Record again, or speak out loud and rate yourself.',
  'tts-unsupported':
    'This browser has no speech synthesis, so the listening audio cannot play. Your plays are not used up; every transcript is in the review after you submit.',
  'tts-no-voice':
    'No German voice is installed, so the listening audio cannot play. Install one (Chrome and Edge ship it) and reload. Your plays are not used up; every transcript is in the review after you submit.',
  'chunk-load':
    'Part of the trainer could not load — usually because a new version was published. Reload to get it; your progress and any exam in progress are saved.',
  network: 'The network request failed. Check your connection and try again.',
  unknown: 'Something went wrong. Your saved progress is untouched.'
};

/** Codes whose failure leaves the app fully usable. */
const UNRECOVERABLE: ReadonlySet<AppErrorCode> = new Set(['chunk-load', 'unknown']);

export const appError = (
  code: AppErrorCode,
  options: { readonly message?: string; readonly cause?: unknown } = {}
): AppError => ({
  kind: 'app-error',
  code,
  message: options.message ?? MESSAGES[code],
  recoverable: !UNRECOVERABLE.has(code),
  ...('cause' in options ? { cause: options.cause } : {})
});

export const isAppError = (value: unknown): value is AppError =>
  typeof value === 'object' && value !== null && 'kind' in value && value.kind === 'app-error';

const errorName = (error: unknown): string =>
  typeof error === 'object' && error !== null && 'name' in error && typeof error.name === 'string'
    ? error.name
    : '';

const errorText = (error: unknown): string =>
  error instanceof Error ? error.message : typeof error === 'string' ? error : '';

/*
 * A dynamic import that 404s after a deploy. Chrome, Firefox and Safari each word it
 * differently; Vite's preload helper adds its own CSS variant.
 */
const CHUNK_LOAD =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS|Loading chunk [\w-]+ failed/i;

export const isChunkLoadError = (error: unknown): boolean =>
  errorName(error) === 'ChunkLoadError' || CHUNK_LOAD.test(errorText(error));

/**
 * Anything thrown, as an `AppError`. Only causes that mean the same thing everywhere are
 * classified here (quota, a stale chunk, a dead network); a boundary that knows more —
 * the recorder, sync — maps its own and passes `fallback`.
 */
export const toAppError = (error: unknown, fallback: AppErrorCode = 'unknown'): AppError => {
  if (isAppError(error)) return error;
  const name = errorName(error);
  if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED') {
    return appError('storage-full', { cause: error });
  }
  if (isChunkLoadError(error)) return appError('chunk-load', { cause: error });
  if (name === 'TypeError' && /failed to fetch|networkerror|load failed/i.test(errorText(error))) {
    return appError('network', { cause: error });
  }
  return appError(fallback, { cause: error });
};

/** Success or a typed failure — for boundaries where throwing would lose the reason. */
export type Result<T, E = AppError> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/** Runs `run`, turning a throw into a typed failure. */
export const tryCatch = <T>(run: () => T, fallback: AppErrorCode = 'unknown'): Result<T> => {
  try {
    return ok(run());
  } catch (error) {
    return err(toAppError(error, fallback));
  }
};

/** The async twin of `tryCatch`: never rejects. */
export const tryCatchAsync = async <T>(
  run: () => Promise<T>,
  fallback: AppErrorCode = 'unknown'
): Promise<Result<T>> => {
  try {
    return ok(await run());
  } catch (error) {
    return err(toAppError(error, fallback));
  }
};

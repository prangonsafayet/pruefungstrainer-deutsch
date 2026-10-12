import { err, ok, toAppError, type AppError, type Result } from './appError.ts';
import { logger } from './logger.ts';

/**
 * localStorage that degrades instead of throwing. Private-browsing modes, storage-disabled
 * browsers and a full quota reject writes, and losing progress is preferable to crashing
 * mid-exam — so an in-memory map stands in for the rest of the session. A failed write is
 * not silent, though: it returns the typed reason and tells every subscriber, so the learner
 * hears that their progress is not being kept and can export a backup.
 */
const fallback = new Map<string, string>();

type StorageFailureListener = (error: AppError) => void;
const failureListeners = new Set<StorageFailureListener>();

/** Called once per failed write. Returns the unsubscribe. */
export const subscribeToStorageFailures = (listener: StorageFailureListener): (() => void) => {
  failureListeners.add(listener);
  return () => {
    failureListeners.delete(listener);
  };
};

/* The fallback wins: once a write has failed, localStorage still holds the value from
   before it, and reading that back would silently undo everything since.
   shortcut: the fallback is per tab — another tab neither sees it nor is notified (no
   `storage` event fires for a failed write); a second open tab reads the older disk value. */
export const readLocal = (key: string): string | null => {
  const kept = fallback.get(key);
  if (kept !== undefined) return kept;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeLocal = (key: string, value: string): Result<void> => {
  try {
    localStorage.setItem(key, value);
    fallback.delete(key);
    return ok(undefined);
  } catch (error) {
    fallback.set(key, value);
    /* A quota error is "full"; anything else (SecurityError, no Storage at all) is "blocked". */
    const failure = toAppError(error, 'storage-unavailable');
    logger.warn('storage', `Could not write ${key}; kept in memory`, failure);
    for (const listener of failureListeners) listener(failure);
    return err(failure);
  }
};

export const removeLocal = (key: string): void => {
  fallback.delete(key);
  try {
    localStorage.removeItem(key);
  } catch (error) {
    logger.warn('storage', `Could not remove ${key}`, error);
  }
};

/**
 * Reads and parses a JSON value, returning `null` when absent or malformed. Deliberately
 * `unknown`: stored data can come from an older version of the app or a hand-edited
 * import file, so every caller has to validate it rather than assert a shape.
 */
export const readLocalJson = (key: string): unknown => {
  const raw = readLocal(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

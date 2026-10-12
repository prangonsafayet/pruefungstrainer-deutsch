/**
 * Recovery from a stale chunk: after a deploy, a tab opened on the old build asks for a
 * lazy chunk that no longer exists. Reloading fetches the new build — but only once: a
 * chunk that is still missing after a reload would otherwise reload forever. The guard is a
 * timestamp in sessionStorage, so it survives the reload it caused.
 */

import { isExamRunPath } from '@shared/exam-run/lib/examMode.ts';

import { tryCatch } from './appError.ts';
import { logger } from './logger.ts';

const RELOAD_SESSION_KEY = 'telcTrainerChunkReloadAt';
/** One automatic reload per window; a second failure inside it shows the fallback instead. */
export const RELOAD_WINDOW_MS = 5 * 60_000;

type GuardStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Whether to reload now, recording the decision. Never during an exam sitting: the run is
 * persisted, but a page that vanishes mid-module is alarming — the fallback's Reload button
 * lets the candidate choose the moment.
 */
export const claimStaleChunkReload = (storage: GuardStorage, now: number, pathname: string): boolean => {
  if (isExamRunPath(pathname)) return false;
  const last = Number(storage.getItem(RELOAD_SESSION_KEY));
  /* A timestamp from the future (a clock change) blocks as well: safe beats sorry. */
  if (last > 0 && now - last < RELOAD_WINDOW_MS) return false;
  storage.setItem(RELOAD_SESSION_KEY, String(now));
  return true;
};

/** Reloads once for a stale chunk. False when the guard (or no sessionStorage) says no. */
export const reloadOnceForStaleChunk = (): boolean => {
  const claimed = tryCatch(() => claimStaleChunkReload(sessionStorage, Date.now(), window.location.pathname));
  if (!claimed.ok || !claimed.value) {
    logger.warn('chunk', 'Stale chunk; not reloading automatically', claimed.ok ? undefined : claimed.error);
    return false;
  }
  logger.warn('chunk', 'Stale chunk; reloading once');
  window.location.reload();
  return true;
};

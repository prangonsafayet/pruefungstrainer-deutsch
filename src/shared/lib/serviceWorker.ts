/**
 * The service worker as the app sees it: a tiny external store (read with
 * `useSyncExternalStore` through `@shared/hooks/useServiceWorkerUpdate.tsx`) plus the one
 * registration call `main.tsx` makes in a production build.
 *
 * Updates never apply themselves. A new deploy installs a new worker that waits; the shell
 * offers "Reload" (not during an exam sitting), and only that click sends skip-waiting. Until
 * then the old worker keeps serving the old build's chunks from its own precache, so a tab
 * opened before the deploy rarely meets a stale chunk at all — and when one still slips through
 * (a worker that never installed, a cleared cache), `staleChunk.ts` keeps its reload-once guard.
 */
import { registerSW } from 'virtual:pwa-register';

import { isExamRunPath } from '@shared/exam-run/lib/examMode.ts';

import { tryCatchAsync } from './appError.ts';
import { logger } from './logger.ts';

/**
 * `off` until `registerServiceWorker` runs (development, tests); `unsupported` without the
 * API; `ready` once registered (the precache is filled during install); `update-waiting` when
 * a newer build is installed and waits for the learner.
 */
export type ServiceWorkerStatus =
  'off' | 'unsupported' | 'registering' | 'ready' | 'update-waiting' | 'failed';

let status: ServiceWorkerStatus = 'off';
let sendSkipWaiting: (() => Promise<void>) | null = null;
/** The new worker already controls this page (Reload in another tab): a plain reload shows it. */
let takenOver = false;
const listeners = new Set<() => void>();

const setStatus = (next: ServiceWorkerStatus): void => {
  status = next;
  for (const listener of listeners) listener();
};

export const subscribeServiceWorker = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getServiceWorkerStatus = (): ServiceWorkerStatus => status;

export const registerServiceWorker = (): void => {
  if (!('serviceWorker' in navigator)) {
    setStatus('unsupported');
    return;
  }
  setStatus('registering');
  sendSkipWaiting = registerSW({
    /* A worker found already waiting reports `onNeedRefresh` first; do not overwrite it. */
    onRegisteredSW: (_url, registration) => {
      if (registration && status === 'registering') setStatus('ready');
    },
    onNeedRefresh: () => {
      setStatus('update-waiting');
    },
    /* The new worker took control: after our own Reload click, or another tab's. The plugin
       would reload unconditionally; a candidate mid-exam keeps the page and gets the prompt
       once the sitting ends. */
    onNeedReload: () => {
      if (isExamRunPath(window.location.pathname)) {
        takenOver = true;
        setStatus('update-waiting');
        return;
      }
      window.location.reload();
    },
    onRegisterError: (error: unknown) => {
      logger.error('sw', 'Service worker registration failed', error);
      setStatus('failed');
    }
  });
};

/**
 * The learner's Reload: activates the waiting worker, which then takes control and reloads
 * the page (`onNeedReload`). Never rejects.
 */
export const applyServiceWorkerUpdate = async (): Promise<void> => {
  if (takenOver || !sendSkipWaiting) {
    window.location.reload();
    return;
  }
  const skip = sendSkipWaiting;
  const result = await tryCatchAsync(() => skip());
  if (!result.ok) {
    logger.error('sw', 'Could not activate the new version', result.error);
    window.location.reload();
  }
};

import { isChunkLoadError } from './appError.ts';
import { logger } from './logger.ts';
import { reloadOnceForStaleChunk } from './staleChunk.ts';

/**
 * The last net under everything a component or a promise chain did not handle: each lands in
 * the local log (Settings → Copy diagnostics). Error boundaries handle render crashes; these
 * catch what happens outside React — event handlers, timers, stray promises.
 */
export const installGlobalErrorHandlers = (): void => {
  window.addEventListener('error', event => {
    logger.error('window', event.message || 'Uncaught error', event.error);
  });

  window.addEventListener('unhandledrejection', event => {
    logger.error('promise', 'Unhandled promise rejection', event.reason);
  });

  /* Vite fires this when a lazy chunk (or one it preloads) fails to load in a built app.
     Preventing the default stops the throw, which is right only when a reload is under way;
     otherwise the error reaches the route's boundary and its Reload action. */
  window.addEventListener('vite:preloadError', event => {
    logger.warn('chunk', 'Preload failed', event.payload);
    if (reloadOnceForStaleChunk()) event.preventDefault();
  });
};

/**
 * An error boundary's `onError`: logs the crash, and for a chunk that failed to load after a
 * deploy, reloads once (in dev there is no `vite:preloadError`, so this is the only path).
 */
export const reportRenderError = (error: unknown): void => {
  logger.error('render', 'A screen crashed', error);
  if (isChunkLoadError(error)) reloadOnceForStaleChunk();
};

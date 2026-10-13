/**
 * Stands in for `virtual:pwa-register`, which only exists inside a Vite build that runs
 * vite-plugin-pwa — vitest.config.ts aliases the specifier here. It records the options the
 * app registered with, so a suite can fire the worker's lifecycle events by hand, and counts
 * skip-waiting requests.
 */
import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

export const pwaStub: { options: RegisterSWOptions | undefined; skipWaitingCalls: number } = {
  options: undefined,
  skipWaitingCalls: 0
};

export const registerSW = (options: RegisterSWOptions = {}): (() => Promise<void>) => {
  pwaStub.options = options;
  return () => {
    pwaStub.skipWaitingCalls += 1;
    return Promise.resolve();
  };
};

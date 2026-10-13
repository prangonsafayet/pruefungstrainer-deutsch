import { useSyncExternalStore } from 'react';

const subscribe = (listener: () => void): (() => void) => {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
};

const getOnline = (): boolean => navigator.onLine;

/** Whether the browser reports a network connection, kept current by its online/offline events. */
export const useOnline = (): boolean => useSyncExternalStore(subscribe, getOnline, getOnline);

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether a CSS media query matches, kept live. For layout that has to differ in behaviour,
 * not just in CSS — a panel beside the plan on a wide screen, a modal sheet on a narrow one.
 * False where there is no `matchMedia` (server, old test environments).
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => {
        list.removeEventListener('change', onChange);
      };
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
    () => false
  );
};

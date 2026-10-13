import { useEffect, useRef, type RefObject } from 'react';

import { APP_NAME } from '@shared/config/trainers.ts';

/**
 * After a client-side navigation, moves focus to the new screen's `<h1>` — so a screen
 * reader announces where it landed and the next Tab starts inside the page — and names the
 * tab after that heading. The initial load leaves focus alone, so the skip link stays the
 * first thing Tab reaches.
 *
 * Screens load lazily, so the heading may arrive after the path changes: until it does, main
 * holds focus and the title falls back to `fallbackTitle`. A screen without an `<h1>` keeps
 * focus on main.
 */
export const usePageFocus = (
  pathname: string,
  mainRef: RefObject<HTMLElement | null>,
  fallbackTitle: string
): void => {
  /* The path last focused for. A ref of the path, not a first-render flag: StrictMode runs
     the effect twice on mount, and a flag would read the second run as a navigation. */
  const focusedPath = useRef(pathname);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;
    const moveFocus = focusedPath.current !== pathname;
    focusedPath.current = pathname;

    document.title = `${fallbackTitle} — ${APP_NAME}`;
    const settle = (): boolean => {
      const heading = main.querySelector('h1');
      if (!heading) return false;
      const text = heading.textContent.replace(/\s+/g, ' ').trim();
      if (text) document.title = `${text} — ${APP_NAME}`;
      /* Only take focus back from main or the body — never from something the user chose. */
      if (moveFocus && (document.activeElement === main || document.activeElement === document.body)) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
      return true;
    };

    if (moveFocus) main.focus({ preventScroll: true });
    if (settle()) return undefined;
    const observer = new MutationObserver(() => {
      if (settle()) observer.disconnect();
    });
    observer.observe(main, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [pathname, mainRef, fallbackTitle]);
};

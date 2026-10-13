import { useEffect, useState } from 'react';

/** Long enough for the page's own focus move to be spoken first. */
const ANNOUNCE_DELAY_MS = 300;

/**
 * Text for a polite live region that should speak exactly once. A region that mounts already
 * holding its text is not announced by most screen readers, so this starts empty and fills a
 * moment after mount — and again only if the text itself changes.
 */
export const useAnnouncement = (text: string): string => {
  const [shown, setShown] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShown(text);
    }, ANNOUNCE_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [text]);

  return shown;
};

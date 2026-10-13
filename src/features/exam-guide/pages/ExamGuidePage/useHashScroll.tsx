import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { prefersReducedMotion } from '@shared/lib/motion.ts';

/** Scrolls to the element named by the URL hash, including on a direct visit. */
export const useHashScroll = (): void => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, [hash]);
};

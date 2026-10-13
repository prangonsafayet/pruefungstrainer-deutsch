import { useEffect, useState } from 'react';

import { prefersReducedMotion } from '@shared/lib/motion.ts';

/* Hand-rolled: a ten-line rAF ease-out costs less than any count-up library's bundle. */

/**
 * Counts from 0 to `to` once, so a score lands rather than simply appearing.
 * Returns `null` when `to` is nullish, and jumps straight to the value when the viewer
 * has asked for reduced motion.
 */
export const useCountUp = (to: number | null | undefined, durationMs = 700): number | null => {
  /* When motion is reduced there is no animation at all, so the final value is the
     initial value — no effect, no cascading render. */
  const [value, setValue] = useState(() => (prefersReducedMotion() ? (to ?? 0) : 0));

  useEffect(() => {
    if (to == null || prefersReducedMotion()) return undefined;
    let frame = 0;
    const start = performance.now();
    const step = (now: number): void => {
      const progress = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [to, durationMs]);

  /* Read live, not from state: under reduced motion nothing animates, so a later `to` has to
     show at once instead of the value the state was first given. */
  return to == null ? null : prefersReducedMotion() ? to : value;
};

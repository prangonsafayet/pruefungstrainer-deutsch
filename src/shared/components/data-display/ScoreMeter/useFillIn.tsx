import { useEffect, useState } from 'react';

/**
 * The value a meter shows: zero on the first paint, then `target` on the next frame, so the
 * bar's CSS transition animates it in. Under reduced motion the transition is cut to nothing
 * and the bar simply appears full.
 */
export const useFillIn = (target: number): number => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShown(target);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [target]);
  return shown;
};

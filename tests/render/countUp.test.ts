import { useState, type Dispatch, type SetStateAction } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCountUp } from '@shared/hooks/useCountUp.tsx';

import { renderHook } from './harness.ts';

/*
 * Under reduced motion the count-up starts at its target and never animates. The value lived
 * in state seeded once, so when the target changed (a new best score) the number on screen
 * stayed at the old one.
 */

const reduceMotion = (reduce: boolean): void => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    query => ({ matches: reduce && query.includes('reduce'), media: query }) as MediaQueryList
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useCountUp under reduced motion', () => {
  it('shows a changed target at once', async () => {
    reduceMotion(true);
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    let setTarget: Dispatch<SetStateAction<number>> = () => undefined;
    const hook = await renderHook(() => {
      const [target, set] = useState(10);
      setTarget = set;
      return useCountUp(target);
    });
    expect(hook.current()).toBe(10);

    await hook.act(() => {
      setTarget(42);
    });

    expect(hook.current()).toBe(42);
    await hook.unmount();
  });

  it('is null for no target', async () => {
    reduceMotion(true);
    const hook = await renderHook(() => useCountUp(null));
    expect(hook.current()).toBeNull();
    await hook.unmount();
  });
});

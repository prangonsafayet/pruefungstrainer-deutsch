import { act } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useExamCountdown } from '@features/app-shell/components/ExamCountdownBadge/useExamCountdown.tsx';

import { renderHook } from './harness.ts';

/*
 * The header countdown read `new Date()` during render, and the header does not re-render
 * at midnight: a tab left open overnight kept yesterday's "10 days". It now reads `useToday`.
 */

afterEach(() => {
  vi.useRealTimers();
});

describe('the header exam countdown', () => {
  it('counts down one day when local midnight passes', async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(new Date(2026, 9, 12, 23, 59, 50));
    const examDate = '2026-10-22';

    const hook = await renderHook(() => useExamCountdown(examDate));
    expect(hook.current()?.days).toBe(10);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });

    expect(hook.current()?.days).toBe(9);
    await hook.unmount();
  });

  it('measures from the local date, local midnight to local midnight', async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout'] });
    /* Late evening: a UTC-based "today" would already be tomorrow east of Greenwich. */
    vi.setSystemTime(new Date(2026, 9, 12, 23, 30));

    for (const [examDate, expected] of [
      ['2026-10-26', { days: 14, tone: 'destructive' }],
      ['2026-10-27', { days: 15, tone: 'secondary' }],
      ['2026-10-11', { days: -1, tone: 'warning' }]
    ] as const) {
      const hook = await renderHook(() => useExamCountdown(examDate));
      expect(hook.current()).toMatchObject(expected);
      await hook.unmount();
    }
  });
});

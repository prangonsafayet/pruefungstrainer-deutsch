import { afterEach, describe, expect, it, vi } from 'vitest';

import { TRAINER_ORDER, TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { addDays } from '@shared/lib/format.ts';
import { useExamCountdown } from '@features/app-shell/hooks/useExamCountdown.ts';
import { examCountdown } from '@features/app-shell/lib/examCountdown.ts';
import { NAV_ENTRIES } from '@features/app-shell/lib/navEntries.ts';
import { isSyncOffline } from '@features/app-shell/lib/syncStatus.ts';

const TODAY = '2026-10-12';

const inDays = (days: number): string => {
  const iso = addDays(TODAY, days);
  if (iso === null) throw new Error('unreachable: TODAY is a valid date');
  return iso;
};

describe('the header exam countdown', () => {
  it('is null when the exam date is not a date', () => {
    expect(examCountdown('', TODAY)).toBeNull();
    expect(examCountdown('2026-13-45x', TODAY)).toBeNull();
  });

  it('labels the date the German way and counts whole days', () => {
    expect(examCountdown('2026-11-01', TODAY)).toEqual({
      dateLabel: '1.11.2026',
      days: 20,
      tone: 'secondary'
    });
  });

  /* The tone flips at both edges of the urgent window: 14 days out is urgent, 15 is not,
     today is still urgent, and yesterday is "passed". Swept so an off-by-one at either edge fails. */
  it.each([
    [-30, 'warning'],
    [-1, 'warning'],
    [0, 'destructive'],
    [1, 'destructive'],
    [13, 'destructive'],
    [14, 'destructive'],
    [15, 'secondary'],
    [120, 'secondary']
  ] as const)('%i days out wears the %s tone', (days, tone) => {
    const countdown = examCountdown(inDays(days), TODAY);
    expect(countdown?.days).toBe(days);
    expect(countdown?.tone).toBe(tone);
  });
});

describe('useExamCountdown', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('measures from the real clock, local midnight to local midnight', () => {
    vi.useFakeTimers();
    /* Late evening: a UTC-based "today" would already be tomorrow east of Greenwich. */
    vi.setSystemTime(new Date(2026, 9, 12, 23, 30));

    expect(useExamCountdown(inDays(14))?.tone).toBe('destructive');
    expect(useExamCountdown(inDays(15))?.tone).toBe('secondary');
    expect(useExamCountdown(inDays(-1))).toMatchObject({ days: -1, tone: 'warning' });
  });
});

describe('the main nav', () => {
  it.each(TRAINER_ORDER)('%s: every tab sits in its own namespace, Settings shared', trainer => {
    const entries = NAV_ENTRIES[trainer];
    const base = TRAINERS[trainer].basePath;

    expect(entries[0]).toMatchObject({ to: trainerHome(trainer), label: 'Dashboard', exact: true });
    expect(entries.at(-1)).toMatchObject({ to: '/settings', label: 'Settings' });
    for (const entry of entries.slice(1, -1)) expect(entry.to.startsWith(`${base}/`)).toBe(true);
    expect(entries.filter(entry => entry.exact)).toHaveLength(1);
  });

  it.each(TRAINER_ORDER)('%s: has a Guide tab exactly when it ships a guide', trainer => {
    const labels = NAV_ENTRIES[trainer].map(entry => entry.label);
    expect(labels.includes('Exam Guide')).toBe(TRAINERS[trainer].hasGuide);
  });
});

describe('the offline badge', () => {
  it('shows only when the sync chip says offline', () => {
    expect(isSyncOffline(null)).toBe(false);
    expect(isSyncOffline({ text: 'synced' })).toBe(false);
    expect(isSyncOffline({ text: 'offline' })).toBe(true);
  });
});

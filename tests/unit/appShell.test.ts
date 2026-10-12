import { afterEach, describe, expect, it, vi } from 'vitest';

import { TRAINER_ORDER, TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { addDays } from '@shared/lib/format.ts';
import { useExamCountdown } from '@features/app-shell/components/ExamCountdownBadge/useExamCountdown.tsx';
import { examCountdown } from '@features/app-shell/components/ExamCountdownBadge/examCountdown.ts';
import { NAV_ENTRIES, splitTabBar, TAB_BAR_SLOTS } from '@features/app-shell/lib/navEntries.ts';
import { isExamRunPath } from '@features/app-shell/components/AppLayout/examMode.ts';
import { isSyncOffline } from '@features/app-shell/components/AppLayout/syncStatus.ts';

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

describe('the phone tab bar', () => {
  it.each(TRAINER_ORDER)('%s: at most five slots, every tab reachable exactly once', trainer => {
    const entries = NAV_ENTRIES[trainer];
    const { tabs, more } = splitTabBar(entries, trainerHome(trainer));

    expect(tabs.length + (more.length > 0 ? 1 : 0)).toBeLessThanOrEqual(TAB_BAR_SLOTS);
    expect([...tabs, ...more].map(entry => entry.to).sort()).toEqual(entries.map(entry => entry.to).sort());
  });

  it.each(TRAINER_ORDER)('%s: the daily tabs stay in the bar, reference and settings go to More', trainer => {
    const { tabs, more } = splitTabBar(NAV_ENTRIES[trainer], trainerHome(trainer));
    /* Six tabs (a guide ships) is the case where the split has to choose. */
    expect(more.length > 0).toBe(TRAINERS[trainer].hasGuide);
    if (more.length > 0) {
      expect(tabs.map(entry => entry.label)).toEqual(['Dashboard', 'Learn', 'Practice', 'History']);
      expect(more.map(entry => entry.label)).toEqual(['Exam Guide', 'Settings']);
    }
  });

  it('marks More as current only on a page behind it', () => {
    const trainer = TRAINER_ORDER.find(id => TRAINERS[id].hasGuide);
    if (!trainer) throw new Error('fixture: no trainer ships a guide');
    const entries = NAV_ENTRIES[trainer];
    expect(splitTabBar(entries, '/settings').moreActive).toBe(true);
    expect(splitTabBar(entries, `${TRAINERS[trainer].basePath}/guide`).moreActive).toBe(true);
    expect(splitTabBar(entries, `${TRAINERS[trainer].basePath}/history`).moreActive).toBe(false);
    expect(splitTabBar(entries, '/settingsx').moreActive).toBe(false);
  });
});

describe('distraction-free exam mode', () => {
  it.each(TRAINER_ORDER)('%s: the runner route is an exam sitting; results and review are not', trainer => {
    const base = TRAINERS[trainer].basePath;
    expect(isExamRunPath(`${base}/exam/exam01/full`)).toBe(true);
    expect(isExamRunPath(`${base}/exam/exam01/lesen/`)).toBe(true);
    expect(isExamRunPath(`${base}/results/abc`)).toBe(false);
    expect(isExamRunPath(`${base}/review/abc`)).toBe(false);
    expect(isExamRunPath(`${base}/learn`)).toBe(false);
    expect(isExamRunPath(`${base}/exam/exam01`)).toBe(false);
  });
});

describe('the offline badge', () => {
  it('shows only when the sync chip says offline', () => {
    expect(isSyncOffline(null)).toBe(false);
    expect(isSyncOffline({ text: 'synced' })).toBe(false);
    expect(isSyncOffline({ text: 'offline' })).toBe(true);
  });
});

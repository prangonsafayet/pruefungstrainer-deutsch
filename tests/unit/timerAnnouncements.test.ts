import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createRun, secondsLeft } from '@shared/exam-run/lib/runStore.ts';
import {
  ANNOUNCE_AT_SECONDS,
  crossedThreshold,
  remainingMessage,
  timeUpMessage
} from '@features/mock-exam/components/runner/ExamRunnerView/timerAnnouncements.ts';

/*
 * The exam clock speaks at 10, 5 and 1 minutes left and never otherwise. Driven the way the
 * runner drives it: a real absolute deadline, the real `secondsLeft`, and a one-second
 * heartbeat — on fake timers, so a 15-minute module runs in milliseconds.
 */

const HEARTBEAT_MS = 1000;

/** Every announcement a module of `minutes` produces, second by second, from start to zero. */
const announcementsOver = (minutes: number, startAfterSeconds = 0): string[] => {
  const run = {
    ...createRun({ trainer: 'b1', examId: 1, mode: 'lesen', queue: ['lesen'] }),
    deadline: Date.now() + minutes * 60_000
  };
  vi.advanceTimersByTime(startAfterSeconds * 1000);
  const spoken: string[] = [];
  let previous = secondsLeft(run);
  while (previous > 0) {
    vi.advanceTimersByTime(HEARTBEAT_MS);
    const current = secondsLeft(run);
    const threshold = crossedThreshold(previous, current);
    if (threshold !== null) spoken.push(remainingMessage(threshold));
    previous = current;
  }
  return spoken;
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 12, 9, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the spoken exam clock', () => {
  it('speaks exactly three times over a 15-minute module, in order', () => {
    expect(announcementsOver(15)).toEqual([
      '10 minutes remaining.',
      '5 minutes remaining.',
      '1 minute remaining.'
    ]);
  });

  it('does not announce the threshold a module starts on, nor one already passed', () => {
    /* A 10-minute module starts AT 10:00 — that is not news. */
    expect(announcementsOver(10)).toEqual(['5 minutes remaining.', '1 minute remaining.']);
    /* Resumed with 7 minutes left: 10 is gone, so it is not said late. */
    expect(announcementsOver(15, 8 * 60)).toEqual(['5 minutes remaining.', '1 minute remaining.']);
  });

  it('never speaks between thresholds', () => {
    let previous = 900;
    const silent: number[] = [];
    for (let now = 899; now >= 0; now -= 1) {
      if (crossedThreshold(previous, now) !== null && !ANNOUNCE_AT_SECONDS.some(at => at === now))
        silent.push(now);
      previous = now;
    }
    expect(silent).toEqual([]);
  });

  it('says the smaller threshold when a throttled tab jumps past two', () => {
    expect(crossedThreshold(620, 290)).toBe(300);
    expect(crossedThreshold(320, 30)).toBe(60);
  });

  it('says at zero whether the module was submitted or only its guideline ran out', () => {
    expect(timeUpMessage('Lesen', false)).toBe('Time is up — Lesen was submitted automatically.');
    expect(timeUpMessage('Sprechen', true)).toMatch(/^Guideline time for Sprechen is over/);
  });
});

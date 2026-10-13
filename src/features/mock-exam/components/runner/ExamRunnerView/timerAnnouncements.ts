/**
 * What the exam clock says out loud, and when. A timer read out every second is noise, so a
 * screen reader hears it three times — at 10, 5 and 1 minutes left — and once more, urgently,
 * when time is up. Pure: the hook feeds it the clock, the tests feed it a fake one.
 */

import { plural } from '@shared/lib/format.ts';

/** Seconds remaining at which the clock speaks, largest first. */
export const ANNOUNCE_AT_SECONDS = [600, 300, 60] as const;

const SECONDS_PER_MINUTE = 60;

/**
 * The threshold the clock passed between two readings, if any. A throttled background tab can
 * jump past two at once; the smaller one is the true state, so it wins.
 */
export const crossedThreshold = (previous: number, current: number): number | null => {
  const crossed = ANNOUNCE_AT_SECONDS.filter(at => previous > at && current <= at);
  return crossed.at(-1) ?? null;
};

export const remainingMessage = (threshold: number): string => {
  const minutes = Math.round(threshold / SECONDS_PER_MINUTE);
  return `${plural(minutes, 'minute')} remaining.`;
};

/** The urgent announcement at zero: a hard stop submits, a guideline clock only informs. */
export const timeUpMessage = (moduleShort: string, guidelineOnly: boolean): string =>
  guidelineOnly
    ? `Guideline time for ${moduleShort} is over — finish when you are ready.`
    : `Time is up — ${moduleShort} was submitted automatically.`;

/** Display formatting helpers. All dates are handled in the viewer's local time. */

import { addDays as addCalendarDays, differenceInCalendarDays, isValid, lightFormat } from 'date-fns';

export const LETTERS = 'abcdefghijkl';

/** Seconds → `m:ss`, clamped at zero. */
export const fmtClock = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${String(minutes)}:${String(rest).padStart(2, '0')}`;
};

/**
 * ISO timestamp or calendar day → `dd.mm.yy`.
 *
 * Goes through `parseIsoDate` first for the reason that helper exists: `new Date()` reads a
 * bare `YYYY-MM-DD` as UTC midnight, which is the previous day anywhere west of Greenwich.
 * Every caller passes a full timestamp today — `attempt.date` — where that does not apply,
 * but this is the one formatter in the module and a stored `examDate` is one call away.
 */
export const fmtDate = (iso: string): string =>
  (parseIsoDate(iso) ?? new Date(iso)).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

export const wordCount = (text: string | undefined): number => {
  const trimmed = text?.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

/**
 * `new Date('2026-09-12')` is parsed as UTC midnight, which is the previous day
 * anywhere west of Greenwich. These two build and format the date from its parts so a
 * calendar day always means that calendar day. `new Date(2026, 1, 31)` silently rolls over
 * to 3 March, so a day only counts if it formats back to the very string it came from.
 * (Not date-fns `parse`: it would add ~7 kB gzip to an eagerly loaded chunk for this.)
 */
export const parseIsoDate = (iso: string | undefined): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return isValid(date) && toIsoDate(date) === iso ? date : null;
};

export const toIsoDate = (date: Date): string => lightFormat(date, 'yyyy-MM-dd');

/** `1 day`, `3 days` — English nouns that take an `s` are all this copy needs. */
export const plural = (count: number, noun: string): string =>
  `${String(count)} ${noun}${count === 1 ? '' : 's'}`;

/** `iso` shifted by whole calendar days (DST-safe), or null when `iso` is not a date. */
export const addDays = (iso: string | undefined, days: number): string | null => {
  const start = parseIsoDate(iso);
  return start ? toIsoDate(addCalendarDays(start, days)) : null;
};

/**
 * Whole days from `fromIso` to `toIso`; negative when `toIso` is earlier. Unlike
 * `daysUntil` this reads no clock, so schedule maths stays a pure function of its input.
 */
export const daysBetween = (fromIso: string | undefined, toIso: string | undefined): number | null => {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  return from && to ? differenceInCalendarDays(to, from) : null;
};

/** Whole days from today to `iso`; negative once the date has passed. */
export const daysUntil = (iso: string | undefined): number | null => {
  const target = parseIsoDate(iso);
  return target ? differenceInCalendarDays(target, new Date()) : null;
};

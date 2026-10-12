import { DTZ_MODULE_META, DTZ_PART_LINES, DTZ_SECTION_MAX } from '@shared/config/dtzExam.ts';
import { FULL_EXAM_MAX, MODULE_META } from '@shared/config/exam.ts';
import { unreachableFormat } from '@shared/config/examConditions.ts';
import {
  SINGLE_LEVEL_MODULE_META,
  SINGLE_LEVEL_ORAL_MAX,
  SINGLE_LEVEL_TOTAL_MAX,
  SINGLE_LEVEL_WRITTEN_MAX
} from '@shared/config/singleLevelExam.ts';
import { dtzHoerenLesen } from '@shared/lib/dtzScores.ts';
import { dtzResultTone, gradeTone } from '@shared/lib/examBadges.ts';
import { fmtClock, fmtDate } from '@shared/lib/format.ts';
import {
  type DtzAttempt,
  type DualLevelAttempt,
  type ModuleTimes,
  type ScoredAttempts,
  type SingleLevelAttempt
} from '@shared/types';

import { type AttemptCell, type AttemptRow, type AttemptTableModel } from '../types/attemptTable.ts';

const DASH = '–';

const text = (value: string): AttemptCell => ({ text: value, badge: null, numeric: false, strong: false });

const number = (value: number | undefined, suffix = ''): AttemptCell => ({
  text: value == null ? DASH : `${String(value)}${suffix}`,
  badge: null,
  numeric: true,
  strong: false
});

const total = (value: number | undefined, of: number): AttemptCell => ({
  text: value == null ? DASH : `${String(value)}/${String(of)}`,
  badge: null,
  numeric: true,
  strong: true
});

const PRACTICE: AttemptCell = { text: 'practice', badge: 'outline', numeric: false, strong: false };

const elapsed = (times: ModuleTimes): AttemptCell =>
  text(fmtClock(Object.values(times).reduce<number>((sum, value) => sum + value, 0)));

const DUAL_LEVEL_COLUMNS = [
  'Date',
  'Test',
  'Mode',
  'Lesen',
  'SB %',
  'Hören',
  'Schreiben',
  'Sprechen',
  'Total',
  'Result',
  'Time'
] as const;

const SINGLE_LEVEL_COLUMNS = ['Date', 'Test', 'Mode', 'Written', 'Oral', 'Total', 'Result', 'Time'] as const;

const DTZ_COLUMNS = [
  'Date',
  'Test',
  'Mode',
  'Hören + Lesen',
  'Schreiben',
  'Sprechen',
  'Result',
  'Time'
] as const;

/* A practice run sat only one of the two, so the cell names which one and its own maximum. */
const dtzHoerenLesenCell = (attempt: DtzAttempt): AttemptCell => {
  const sum = dtzHoerenLesen(attempt.scores);
  if (sum != null) return total(sum, DTZ_PART_LINES.hoerenLesen.max);
  for (const module of ['hoeren', 'lesen'] as const) {
    const value = attempt.scores[module];
    if (value != null)
      return text(`${String(value)}/${String(DTZ_SECTION_MAX[module])} (${DTZ_MODULE_META[module].short})`);
  }
  return number(undefined);
};

const dtzRow = (attempt: DtzAttempt, reviewTo: string): AttemptRow => ({
  id: attempt.id,
  reviewTo,
  cells: [
    text(fmtDate(attempt.date)),
    text(`T${String(attempt.examId)}`),
    text(attempt.mode === 'full' ? 'Full' : DTZ_MODULE_META[attempt.mode].short),
    dtzHoerenLesenCell(attempt),
    attempt.scores.schreiben == null
      ? number(undefined)
      : total(attempt.scores.schreiben, DTZ_SECTION_MAX.schreiben),
    attempt.scores.sprechen == null
      ? number(undefined)
      : total(attempt.scores.sprechen, DTZ_SECTION_MAX.sprechen),
    attempt.result
      ? { text: attempt.result, badge: dtzResultTone(attempt.result), numeric: false, strong: false }
      : PRACTICE,
    elapsed(attempt.times)
  ]
});

const singleLevelTable = (
  attempts: readonly SingleLevelAttempt[],
  reviewTo: (id: number) => string
): AttemptTableModel => ({
  columns: SINGLE_LEVEL_COLUMNS,
  rows: attempts.toReversed().map<AttemptRow>(attempt => ({
    id: attempt.id,
    reviewTo: reviewTo(attempt.id),
    cells: [
      text(fmtDate(attempt.date)),
      text(`T${String(attempt.examId)}`),
      text(attempt.mode === 'full' ? 'Full' : SINGLE_LEVEL_MODULE_META[attempt.mode].short),
      total(attempt.written, SINGLE_LEVEL_WRITTEN_MAX),
      total(attempt.oral, SINGLE_LEVEL_ORAL_MAX),
      total(attempt.total, SINGLE_LEVEL_TOTAL_MAX),
      attempt.result
        ? {
            text: attempt.result,
            badge: attempt.result === 'Bestanden' ? 'success' : 'destructive',
            numeric: false,
            strong: false
          }
        : PRACTICE,
      elapsed(attempt.times)
    ]
  }))
});

const dualLevelTable = (
  attempts: readonly DualLevelAttempt[],
  reviewTo: (id: number) => string
): AttemptTableModel => ({
  columns: DUAL_LEVEL_COLUMNS,
  rows: attempts.toReversed().map<AttemptRow>(attempt => ({
    id: attempt.id,
    reviewTo: reviewTo(attempt.id),
    cells: [
      text(fmtDate(attempt.date)),
      text(`T${String(attempt.examId)}`),
      text(attempt.mode === 'full' ? 'Full' : MODULE_META[attempt.mode].short),
      number(attempt.scores.lesen),
      attempt.sb ? number(attempt.sb.percent, '%') : number(undefined),
      number(attempt.scores.hoeren),
      number(attempt.scores.schreiben),
      number(attempt.scores.sprechen),
      attempt.mode === 'full' ? total(attempt.total ?? 0, FULL_EXAM_MAX) : number(undefined),
      attempt.mode === 'full'
        ? {
            text: attempt.result ?? 'Nicht bestanden',
            badge: gradeTone(attempt.result),
            numeric: false,
            strong: false
          }
        : PRACTICE,
      elapsed(attempt.times)
    ]
  }))
});

/**
 * Every stored attempt of one trainer as table rows, newest first. Which columns those are
 * follows from the paper the attempts were marked against, never from the trainer.
 */
export const buildAttemptTable = (source: ScoredAttempts, basePath: string): AttemptTableModel => {
  const reviewTo = (id: number): string => `${basePath}/review/${String(id)}`;

  switch (source.format) {
    case 'dtz-paper':
      return {
        columns: DTZ_COLUMNS,
        rows: source.attempts.toReversed().map(attempt => dtzRow(attempt, reviewTo(attempt.id)))
      };
    case 'single-level':
      return singleLevelTable(source.attempts, reviewTo);
    case 'dual-level':
      return dualLevelTable(source.attempts, reviewTo);
    default:
      return unreachableFormat(source);
  }
};

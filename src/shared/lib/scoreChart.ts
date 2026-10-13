/** Turns stored attempts into the score-history chart's model, per paper. */

import { DTZ_PART_LINES } from '@shared/config/dtzExam.ts';
import { A2_TOTAL, B1_TOTAL, FULL_EXAM_MAX } from '@shared/config/exam.ts';
import { unreachableFormat } from '@shared/config/examConditions.ts';
import {
  SINGLE_LEVEL_ORAL_PASS,
  SINGLE_LEVEL_TOTAL_MAX,
  SINGLE_LEVEL_WRITTEN_PASS
} from '@shared/config/singleLevelExam.ts';
import { plural } from '@shared/lib/format.ts';
import { type DtzAttempt } from '@shared/types/dtzExam.ts';
import { type ExamGrade } from '@shared/types/exam.ts';
import { type DualLevelAttempt } from '@shared/types/progress.ts';
import {
  type ScoreChartGridline,
  type ScoreChartModel,
  type ScoredAttempts
} from '@shared/types/scoreChart.ts';
import { type SingleLevelAttempt } from '@shared/types/singleLevelExam.ts';

import { dtzHoerenLesen } from './dtzScores.ts';

export const CHART_HEIGHT = 160;

/** Older sittings scroll off: a dozen bars is what fits and what is still comparable. */
const MAX_BARS = 12;

const DUAL_LEVEL_GRIDLINES: readonly ScoreChartGridline[] = [
  { value: FULL_EXAM_MAX, label: String(FULL_EXAM_MAX) },
  { value: B1_TOTAL, label: `${String(B1_TOTAL)} · B1` },
  { value: A2_TOTAL, label: `${String(A2_TOTAL)} · A2` }
];

const DUAL_LEVEL_DESCRIPTION = `Total points per full exam. Gridlines mark the B1 (${String(B1_TOTAL)}) and A2 (${String(A2_TOTAL)}) zones. B1 needs ${String(B1_TOTAL)} points and the per-subtest minimums — see the Exam Guide.`;

/** 60% written plus 60% oral is the lowest total any pass can add up to. */
const SINGLE_LEVEL_PASS_LINE = SINGLE_LEVEL_WRITTEN_PASS + SINGLE_LEVEL_ORAL_PASS;

const SINGLE_LEVEL_GRIDLINES: readonly ScoreChartGridline[] = [
  { value: SINGLE_LEVEL_PASS_LINE, label: String(SINGLE_LEVEL_PASS_LINE) }
];

const SINGLE_LEVEL_DESCRIPTION = `Total points per full exam out of ${String(SINGLE_LEVEL_TOTAL_MAX)}. The gridline marks ${String(SINGLE_LEVEL_PASS_LINE)} — the minimum a pass adds up to (60% written and 60% oral, judged separately).`;

const { hoerenLesen: HL } = DTZ_PART_LINES;

const DTZ_GRIDLINES: readonly ScoreChartGridline[] = [
  { value: HL.max, label: String(HL.max) },
  { value: HL.b1From, label: `${String(HL.b1From)} · B1` },
  { value: HL.a2From, label: `${String(HL.a2From)} · A2` }
];

const DTZ_DESCRIPTION = `Hören + Lesen per full exam, out of ${String(HL.max)}. Gridlines mark that part's B1 (${String(HL.b1From)}) and A2 (${String(HL.a2From)}) lines; the bar's colour is the certificate, which also needs Sprechen.`;

const dtzColor = (attempt: DtzAttempt): string => {
  if (attempt.result === 'Zertifikat B1') return 'var(--success)';
  if (attempt.result === 'Zertifikat A2') return 'var(--warning)';
  return 'var(--destructive)';
};

const dtzChart = (attempts: readonly DtzAttempt[]): ScoreChartModel => ({
  max: HL.max,
  description: DTZ_DESCRIPTION,
  gridlines: DTZ_GRIDLINES,
  bars: attempts
    .filter(attempt => attempt.mode === 'full' && attempt.result != null)
    .slice(-MAX_BARS)
    .map(attempt => ({
      id: attempt.id,
      examId: attempt.examId,
      date: attempt.date,
      total: dtzHoerenLesen(attempt.scores) ?? 0,
      result: attempt.result ?? '',
      color: dtzColor(attempt)
    }))
});

const gradeColor = (result: ExamGrade): string => {
  if (result === 'B1') return 'var(--success)';
  if (result === 'A2') return 'var(--warning)';
  return 'var(--destructive)';
};

/** A bar per scored sitting; practice runs and unscored attempts are not comparable. */
const scored = <T extends { readonly mode: string; readonly total?: number }>(
  attempts: readonly T[]
): readonly T[] =>
  attempts.filter(attempt => attempt.mode === 'full' && typeof attempt.total === 'number').slice(-MAX_BARS);

const singleLevelChart = (attempts: readonly SingleLevelAttempt[]): ScoreChartModel => ({
  max: SINGLE_LEVEL_TOTAL_MAX,
  description: SINGLE_LEVEL_DESCRIPTION,
  gridlines: SINGLE_LEVEL_GRIDLINES,
  bars: scored(attempts).map(attempt => ({
    id: attempt.id,
    examId: attempt.examId,
    date: attempt.date,
    total: attempt.total ?? 0,
    result: attempt.result ?? '',
    color: attempt.result === 'Bestanden' ? 'var(--success)' : 'var(--destructive)'
  }))
});

const dualLevelChart = (attempts: readonly DualLevelAttempt[]): ScoreChartModel => ({
  max: FULL_EXAM_MAX,
  description: DUAL_LEVEL_DESCRIPTION,
  gridlines: DUAL_LEVEL_GRIDLINES,
  bars: scored(attempts).map(attempt => {
    const result = attempt.result ?? 'Nicht bestanden';
    return {
      id: attempt.id,
      examId: attempt.examId,
      date: attempt.date,
      total: attempt.total ?? 0,
      result,
      color: gradeColor(result)
    };
  })
});

export const buildScoreChart = (source: ScoredAttempts): ScoreChartModel => {
  switch (source.format) {
    case 'dtz-paper':
      return dtzChart(source.attempts);
    case 'single-level':
      return singleLevelChart(source.attempts);
    case 'dual-level':
      return dualLevelChart(source.attempts);
    default:
      return unreachableFormat(source);
  }
};

/** The chart's lines in words — "168 · B1, 96 · A2" — for its table caption and summary. */
export const describeGridlines = (model: ScoreChartModel): string =>
  model.gridlines.map(line => line.label).join(', ');

/**
 * What the bars say, in one sentence, for the chart's accessible name: bar heights alone
 * tell a screen reader nothing. The full numbers are in the table under the chart.
 */
export const summarizeScoreChart = (model: ScoreChartModel): string => {
  const latest = model.bars.at(-1);
  if (!latest) return 'Score history: no full exams yet.';
  const best = Math.max(...model.bars.map(bar => bar.total));
  const count = model.bars.length;
  const of = String(model.max);
  return [
    `Score history: ${plural(count, 'full exam')}, scored out of ${of}.`,
    `Latest: Test ${String(latest.examId)}, ${String(latest.total)} of ${of}${latest.result ? ` (${latest.result})` : ''}.`,
    `Best: ${String(best)} of ${of}.`,
    `Lines at ${describeGridlines(model)}.`
  ].join(' ');
};

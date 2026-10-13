import {
  DTZ_MODULE_META,
  DTZ_PART_LINES,
  DTZ_SECTION_MAX,
  type DtzPartLine
} from '@shared/config/dtzExam.ts';
import { PASS_PERCENT, PASS_RULES, passLineLabel } from '@shared/config/examConditions.ts';
import {
  type AttemptGrade,
  type AttemptSummary,
  type ModuleTimeEntry,
  type ScoreBar
} from '@shared/exam-run/types/examFormat.ts';
import { DTZ_HOEREN_LESEN_LINE, dtzHoerenLesen, dtzModuleLine } from '@shared/lib/dtzScores.ts';
import { dtzResultTone } from '@shared/lib/examBadges.ts';
import { type DtzAttempt, type DtzLevel, type DtzModule } from '@shared/types/dtzExam.ts';
import { type ExamModule } from '@shared/types/exam.ts';

import { dtzLevel, gradeFullExam } from './scoring.ts';

const moduleBar = (module: DtzModule, value: number): ScoreBar => {
  const line = dtzModuleLine(module);
  return {
    label:
      module === 'schreiben' || module === 'sprechen'
        ? `${DTZ_MODULE_META[module].short} (self)`
        : DTZ_MODULE_META[module].short,
    value,
    of: DTZ_SECTION_MAX[module],
    thresholdPercent: line.percent,
    thresholdLabel: line.label
  };
};

const bars = ({ scores }: DtzAttempt): readonly ScoreBar[] => {
  const result: ScoreBar[] = [];
  const hoerenLesen = dtzHoerenLesen(scores);
  if (scores.hoeren != null) result.push(moduleBar('hoeren', scores.hoeren));
  if (scores.lesen != null) result.push(moduleBar('lesen', scores.lesen));
  if (hoerenLesen != null)
    result.push({
      label: 'Hören + Lesen',
      value: hoerenLesen,
      of: DTZ_PART_LINES.hoerenLesen.max,
      thresholdPercent: DTZ_HOEREN_LESEN_LINE.percent,
      thresholdLabel: DTZ_HOEREN_LESEN_LINE.label
    });
  if (scores.schreiben != null) result.push(moduleBar('schreiben', scores.schreiben));
  if (scores.sprechen != null) result.push(moduleBar('sprechen', scores.sprechen));
  return result;
};

/** One Teilergebnis as a line of the results card, e.g. `Hören + Lesen: 30/45 → A2 (B1 ab 33, A2 ab 20)`. */
export const partNote = (label: string, points: number, line: DtzPartLine): string => {
  const level: DtzLevel = dtzLevel(points, line);
  return `${label}: ${String(points)}/${String(line.max)} → ${level} (B1 ab ${String(line.b1From)}, A2 ab ${String(line.a2From)})`;
};

const gradeFor = (attempt: DtzAttempt): AttemptGrade | null => {
  if (attempt.mode !== 'full' || attempt.result == null) return null;
  const { scores } = attempt;
  const { hoerenLesen } = gradeFullExam(scores);
  return {
    label: attempt.result,
    tone: dtzResultTone(attempt.result),
    points: null,
    notes: [
      partNote('Hören + Lesen', hoerenLesen, DTZ_PART_LINES.hoerenLesen),
      partNote('Schreiben', scores.schreiben ?? 0, DTZ_PART_LINES.schreiben),
      partNote('Sprechen', scores.sprechen ?? 0, DTZ_PART_LINES.sprechen),
      PASS_RULES['dtz-paper']
    ]
  };
};

const ACCENTS: Readonly<Record<'success' | 'warning' | 'destructive', string>> = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  destructive: 'var(--destructive)'
};

/** Turns a stored DTZ attempt into the numbers and labels the results screen renders. */
export const summarizeAttempt = (attempt: DtzAttempt): AttemptSummary => {
  const scoreBars = bars(attempt);
  const moduleTimes: readonly ModuleTimeEntry[] = Object.entries(attempt.times)
    .filter((entry): entry is [ExamModule, number] => typeof entry[1] === 'number')
    .map(([module, seconds]) => ({ module, seconds }));
  const firstBar = scoreBars[0];

  return {
    totalSeconds: moduleTimes.reduce((sum, entry) => sum + entry.seconds, 0),
    accentColor: attempt.mode === 'full' ? ACCENTS[dtzResultTone(attempt.result)] : 'var(--primary)',
    bars: scoreBars,
    thresholdPercent: PASS_PERCENT['dtz-paper'],
    thresholdLabel: passLineLabel('dtz-paper'),
    /* Hören and Lesen have no line of their own (only their sum does): theirs is a target. */
    markNote:
      'The thin mark on each bar is where B1 starts for that part. Hören and Lesen alone have no line of their own — their mark is a pace this trainer sets.',
    moduleTimes,
    grade: gradeFor(attempt),
    headlineScore: firstBar ? String(firstBar.value) : '–',
    headlineSuffix: firstBar ? `/${String(firstBar.of)}` : ''
  };
};

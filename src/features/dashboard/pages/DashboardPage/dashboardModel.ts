import { DTZ_MODULE_META, DTZ_MODULES, DTZ_SECTION_MAX } from '@shared/config/dtzExam.ts';
import { A2_TOTAL, B1_TOTAL, MODULE_META, SKILL_MAX, SKILL_MODULES } from '@shared/config/exam.ts';
import {
  PAPER_TOTAL_MAX,
  PASS_PERCENT,
  PASS_RULE_SUMMARY,
  passLineLabel,
  type PassRuleSummary,
  unreachableFormat
} from '@shared/config/examConditions.ts';
import {
  SINGLE_LEVEL_MODULE_META,
  SINGLE_LEVEL_MODULES,
  SINGLE_LEVEL_SECTION_MAX
} from '@shared/config/singleLevelExam.ts';
import { CATEGORY_META, STUDY_CATEGORIES } from '@shared/config/studyCategories.ts';
import { hasVocabBank, TRAINERS, type TrainerInfo } from '@shared/config/trainers.ts';
import { dtzHoerenLesen, dtzModuleLine } from '@shared/lib/dtzScores.ts';
import { fmtDate } from '@shared/lib/format.ts';
import { countMastery, streakLength, type MasteryCounts } from '@shared/lib/srs.ts';
import { idsFor } from '@shared/lib/studyItems.ts';
import { type TrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';
import { type ExamModule } from '@shared/types/exam.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { type SrsMap, type VocabBank } from '@shared/types/vocab.ts';

import {
  type MasteryModel,
  type MeterModel,
  type StatTileModel,
  type WeakAreaModel
} from '@features/dashboard/types/dashboard.ts';

const bestFor = (
  attempts: readonly { readonly scores: Partial<Record<string, number>> }[],
  key: string
): number | null => {
  const scores = attempts
    .map(attempt => attempt.scores[key])
    .filter((value): value is number => value != null);
  return scores.length > 0 ? Math.max(...scores) : null;
};

/**
 * What the meters are, per paper: the A2·B1 paper's four 60-point skills, the single-level
 * paper's five marked sections out of 75/30/75/45/75, or the DTZ's four parts out of
 * 20/25/20/100. Calling the latter two "skills" would be wrong — Sprachbausteine is not a
 * skill, and none of them is out of 60.
 */
export const metersHeading = (slice: TrainerSlice): string => {
  switch (slice.format) {
    case 'dual-level':
      return 'Skill progress (best scores)';
    case 'single-level':
      return 'Section results (best scores)';
    case 'dtz-paper':
      return 'Part results (best scores)';
    default:
      return unreachableFormat(slice);
  }
};

/** The best score of each scored part of the paper, against a perfect one. */
export const buildMeters = (slice: TrainerSlice): readonly MeterModel[] => {
  const thresholdPercent = PASS_PERCENT[slice.format];
  const thresholdLabel = passLineLabel(slice.format);

  switch (slice.format) {
    case 'single-level':
      return SINGLE_LEVEL_MODULES.map(section => ({
        key: section,
        label: SINGLE_LEVEL_MODULE_META[section].short,
        value: bestFor(slice.attempts, section),
        of: SINGLE_LEVEL_SECTION_MAX[section],
        thresholdPercent,
        thresholdLabel
      }));
    /* Each DTZ part has its own line — and Hören and Lesen only share one, as a target. */
    case 'dtz-paper':
      return DTZ_MODULES.map(module => ({
        key: module,
        label: DTZ_MODULE_META[module].short,
        value: bestFor(slice.attempts, module),
        of: DTZ_SECTION_MAX[module],
        thresholdPercent: dtzModuleLine(module).percent,
        thresholdLabel: dtzModuleLine(module).label
      }));
    case 'dual-level':
      return SKILL_MODULES.map(key => ({
        key,
        label: MODULE_META[key].short,
        value: bestFor(slice.attempts, key),
        of: SKILL_MAX,
        thresholdPercent,
        thresholdLabel
      }));
    default:
      return unreachableFormat(slice);
  }
};

/** The best full-sitting score: the total, or the DTZ's Hören + Lesen (it has no total). */
const bestFullScore = (slice: TrainerSlice): number | null => {
  const best = (scores: readonly (number | null | undefined)[]): number | null => {
    const numbers = scores.filter((value): value is number => value != null);
    return numbers.length > 0 ? Math.max(...numbers) : null;
  };
  switch (slice.format) {
    case 'dtz-paper':
      return best(
        slice.attempts
          .filter(attempt => attempt.mode === 'full')
          .map(attempt => dtzHoerenLesen(attempt.scores))
      );
    case 'single-level':
      return best(
        slice.attempts.filter(attempt => attempt.mode === 'full').map(attempt => attempt.total ?? 0)
      );
    case 'dual-level':
      return best(
        slice.attempts.filter(attempt => attempt.mode === 'full').map(attempt => attempt.total ?? 0)
      );
    default:
      return unreachableFormat(slice);
  }
};

/** What the best-score tile is called: the DTZ has no total, only Hören + Lesen. */
const bestLabel = (slice: TrainerSlice): string => {
  switch (slice.format) {
    case 'dtz-paper':
      return 'Best Hören + Lesen';
    case 'single-level':
    case 'dual-level':
      return 'Best total';
    default:
      return unreachableFormat(slice);
  }
};

const dualLevelCaption = (best: number | null): string => {
  if (best == null) return 'no full exam yet';
  if (best >= B1_TOTAL) return 'B1 territory';
  if (best >= A2_TOTAL) return `A2 zone — push to ${String(B1_TOTAL)}`;
  return 'keep training';
};

const bestCaption = (slice: TrainerSlice, best: number | null): string => {
  switch (slice.format) {
    case 'dual-level':
      return dualLevelCaption(best);
    case 'single-level':
      return 'across every full exam';
    case 'dtz-paper':
      return 'Hören + Lesen, best full exam';
    default:
      return unreachableFormat(slice);
  }
};

/**
 * The tiles above the fold. A trainer with a vocabulary bank gets the two study tiles as
 * well — that is the descriptor offering more data, not a second dashboard.
 */
export const buildTiles = (
  slice: TrainerSlice,
  mastery: MasteryCounts | null,
  today: string
): readonly StatTileModel[] => {
  const full = slice.attempts.filter(attempt => attempt.mode === 'full');
  const best = bestFullScore(slice);
  const max = PAPER_TOTAL_MAX[slice.format];
  const last = slice.attempts.at(-1) ?? null;

  const study: readonly StatTileModel[] =
    mastery === null
      ? []
      : [
          {
            kind: 'streak',
            label: 'Streak',
            value: streakLength(slice.activity, today),
            suffix: null,
            caption: streakLength(slice.activity, today) === 1 ? 'day in a row' : 'days in a row'
          },
          {
            kind: 'due',
            label: 'Due today',
            value: mastery.due,
            suffix: null,
            caption: `${String(mastery.total)} items in the bank`
          }
        ];

  return [
    ...study,
    {
      kind: 'exams',
      label: 'Full exams taken',
      value: full.length,
      suffix: null,
      caption: `${String(slice.attempts.length - full.length)} module practice runs`
    },
    {
      kind: 'best',
      label: bestLabel(slice),
      value: best ?? '–',
      suffix: best === null ? null : `/${String(max)}`,
      caption: bestCaption(slice, best)
    },
    {
      kind: 'last',
      label: 'Last activity',
      value: last ? `Test ${String(last.examId)}` : '–',
      suffix: null,
      caption: last ? fmtDate(last.date) : 'start below'
    }
  ];
};

/** How far through its vocabulary bank a trainer is, or null when it has none. */
export const buildMastery = (
  trainer: TrainerId,
  vocab: VocabBank,
  srs: SrsMap,
  today: string
): MasteryModel | null => {
  if (!hasVocabBank(vocab)) return null;
  const base = TRAINERS[trainer].basePath;
  const categories = STUDY_CATEGORIES.map(category => {
    const counts = countMastery(idsFor(vocab, category), srs, today);
    return {
      key: category,
      label: CATEGORY_META[category].label,
      mastered: counts.mastered,
      total: counts.total,
      percent: counts.total > 0 ? (counts.mastered / counts.total) * 100 : 0
    };
  });
  const all = countMastery(
    STUDY_CATEGORIES.flatMap(category => idsFor(vocab, category)),
    srs,
    today
  );
  return {
    mastered: all.mastered,
    total: all.total,
    percent: all.total > 0 ? Math.round((all.mastered / all.total) * 100) : 0,
    categories,
    practiceTo: `${base}/practice`,
    learnTo: `${base}/learn`
  };
};

/** The vocabulary and paper counts a mastery section needs, whether or not it renders. */
export const masteryCounts = (vocab: VocabBank, srs: SrsMap, today: string): MasteryCounts =>
  countMastery(
    STUDY_CATEGORIES.flatMap(category => idsFor(vocab, category)),
    srs,
    today
  );

/** Too few answers to call anything weak. */
const MIN_SIGNAL = 5;
/** Below this error rate a category is not worth flagging. */
const WEAK_RATE = 0.2;
interface SectionScores {
  readonly section: ExamModule;
  /**
   * What the paper the trainer actually sits calls this section. The two papers name three
   * of the five differently — the single-level paper's "Schriftlicher Ausdruck" and
   * "Mündliche Prüfung" are the A2·B1 paper's "Schreiben" and "Sprechen", and its
   * "Hörverstehen" is that paper's "Hörverstehen · Hören & Schreiben" — so one shared table
   * put the wrong paper's section names on the A2·B1 dashboard.
   */
  readonly label: string;
  readonly scores: readonly number[];
  readonly of: number;
  /** Where this section counts as weak, as a percentage, and what that line is called. */
  readonly passPercent: number;
  readonly lineName: string;
}

const scoresOf = (
  attempts: readonly { readonly scores: Partial<Record<string, number>> }[],
  key: string
): readonly number[] =>
  attempts.map(attempt => attempt.scores[key]).filter((score): score is number => typeof score === 'number');

/** Every scored section of whichever paper the trainer sets, with the scores it has. */
const sectionScores = (slice: TrainerSlice): readonly SectionScores[] => {
  /* The pass line is the paper's own — 70% of a skill at A2·B1, 60% of a section on the
     single-level paper, 75% of a DTZ part — so a skill at 65% is weak on one paper and fine
     on another. */
  const passPercent = PASS_PERCENT[slice.format];
  switch (slice.format) {
    case 'single-level':
      return SINGLE_LEVEL_MODULES.map(section => ({
        section,
        label: SINGLE_LEVEL_MODULE_META[section].name,
        scores: scoresOf(slice.attempts, section),
        of: SINGLE_LEVEL_SECTION_MAX[section],
        passPercent,
        lineName: 'pass line'
      }));
    case 'dtz-paper':
      return DTZ_MODULES.map(section => ({
        section,
        label: DTZ_MODULE_META[section].name,
        scores: scoresOf(slice.attempts, section),
        of: DTZ_SECTION_MAX[section],
        passPercent: dtzModuleLine(section).percent,
        lineName: section === 'hoeren' || section === 'lesen' ? 'B1 pace this trainer targets' : 'B1 line'
      }));
    case 'dual-level':
      return SKILL_MODULES.map(key => ({
        section: key,
        label: MODULE_META[key].name,
        scores: scoresOf(slice.attempts, key),
        of: SKILL_MAX,
        passPercent,
        lineName: 'pass line'
      }));
    default:
      return unreachableFormat(slice);
  }
};

/**
 * The weakest study categories and exam sections, worst first, each with a one-tap drill.
 * A trainer with no bank simply contributes no category rows.
 */
export const buildWeakAreas = (
  slice: TrainerSlice,
  vocab: VocabBank,
  basePath: string
): readonly WeakAreaModel[] => {
  const areas: WeakAreaModel[] = [];

  for (const category of STUDY_CATEGORIES) {
    let wrong = 0;
    let seen = 0;
    for (const id of idsFor(vocab, category)) {
      const entry = slice.srs[id];
      if (!entry) continue;
      wrong += entry.wrong;
      seen += entry.seen;
    }
    if (seen < MIN_SIGNAL) continue;
    const rate = wrong / seen;
    if (rate < WEAK_RATE) continue;
    areas.push({
      key: `vocab.${category}`,
      label: CATEGORY_META[category].label,
      detail: `${String(wrong)} of ${String(seen)} answers wrong — drill the weak cards.`,
      severity: rate,
      to: `${basePath}/practice?tab=quiz&category=${category}`,
      actionLabel: 'Drill it'
    });
  }

  for (const { section, label, scores, of, passPercent, lineName } of sectionScores(slice)) {
    if (scores.length === 0) continue;
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const percent = (average / of) * 100;
    if (percent >= passPercent) continue;
    areas.push({
      key: `exam.${section}`,
      label,
      detail: `Averaging ${String(Math.round(percent))}% across ${String(scores.length)} attempt${scores.length === 1 ? '' : 's'} — below the ${String(Math.round(passPercent))}% ${lineName}.`,
      severity: 1 - percent / 100,
      to: basePath || '/',
      actionLabel: 'Practise a mock'
    });
  }

  return areas.toSorted((a, b) => b.severity - a.severity);
};

/** The pass rule of the paper a trainer sets, as the rows of the callout under the page title. */
export const passRuleFor = (trainer: TrainerInfo): PassRuleSummary => PASS_RULE_SUMMARY[trainer.format];

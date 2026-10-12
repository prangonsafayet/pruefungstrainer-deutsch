/**
 * The exam conditions a trainer lets the candidate tune, per paper. Keyed by format: the
 * official writing time and the number of times an audio plays are properties of the paper,
 * so a trainer offers whichever set the paper it sets does.
 */

import { type ExamFormatId } from '@shared/types/trainer.ts';

import { DTZ_PART_LINES } from './dtzExam.ts';
import { DEFAULT_SETTINGS, FULL_EXAM_MAX } from './exam.ts';
import { SINGLE_LEVEL_TOTAL_MAX } from './singleLevelExam.ts';

export interface SettingChoice {
  readonly value: number;
  readonly label: string;
}

export const WRITING_MINUTE_CHOICES: Readonly<Record<ExamFormatId, readonly SettingChoice[]>> = {
  'dual-level': [
    { value: 10, label: '10 minutes (exam pace)' },
    { value: 15, label: '15 minutes (relaxed)' }
  ],
  'single-level': [
    { value: 30, label: '30 minutes (official)' },
    { value: 40, label: '40 minutes (relaxed)' }
  ],
  /* The DTZ Übungssatz states 30 minutes for Schreiben (p. 6). */
  'dtz-paper': [
    { value: 30, label: '30 minutes (official)' },
    { value: 40, label: '40 minutes (relaxed)' }
  ]
};

/**
 * The share of a scored section a pass needs, per paper. The A2·B1 paper wants 42 of 60 in
 * three of its four skills, which telc publishes; the 60% this trainer marks the single-level
 * paper's written and oral parts at is the app's own working target, since telc publishes only
 * that paper's weighting table (see `SINGLE_LEVEL_WRITTEN_PASS`). Every consumer — the
 * dashboard meters, the weak-area detection and the copy that names the line — reads this, so
 * the two papers' lines cannot be crossed.
 */
export const PASS_PERCENT: Readonly<Record<ExamFormatId, number>> = {
  'dual-level': 70,
  'single-level': 60,
  /* Schreiben 15/20 and Sprechen 75/100 are both 75% (DTZ spec p. 47). Hören + Lesen's 33/45
     is drawn per bar instead — see the DTZ summary. */
  'dtz-paper': 75
};

/** How the pass line reads on screen. */
export const passLineLabel = (format: ExamFormatId): string => {
  switch (format) {
    case 'dual-level':
      return `B1 threshold (${String(PASS_PERCENT[format])}%)`;
    case 'single-level':
      return `Pass line (${String(PASS_PERCENT[format])}%)`;
    case 'dtz-paper':
      return `B1 line (${String(PASS_PERCENT[format])}%)`;
    default:
      return unreachableFormat(format);
  }
};

/** The compile-time end of an exhaustive switch over the papers. */
export const unreachableFormat = (format: never): never => {
  throw new Error(`Unknown exam format: ${String(format)}`);
};

/** Points a perfect sitting of each paper scores. */
export const PAPER_TOTAL_MAX: Readonly<Record<ExamFormatId, number>> = {
  'dual-level': FULL_EXAM_MAX,
  'single-level': SINGLE_LEVEL_TOTAL_MAX,
  /* The DTZ has no single total: its one summed Teilergebnis is Hören + Lesen, out of 45. */
  'dtz-paper': DTZ_PART_LINES.hoerenLesen.max
};

/** How each paper is passed, in one sentence — the lead under a dashboard title. */
export const PASS_RULES: Readonly<Record<ExamFormatId, string>> = {
  'dual-level': 'Aim: ≥ 168/240 overall, with ≥ 42/60 in three skills and ≥ 24/60 in the fourth = B1.',
  'single-level':
    'Aim: ≥ 135/225 written and ≥ 45/75 oral — this trainer marks each part at 60%, judged separately.',
  'dtz-paper':
    'Zertifikat B1: Sprechen ≥ 75/100 and either Hören + Lesen ≥ 33/45 or Schreiben ≥ 15/20. Zertifikat A2: Sprechen ≥ 35 and either Hören + Lesen ≥ 20 or Schreiben ≥ 7.'
};

/**
 * How long the paper gives for writing, said next to the choice. The number comes from the
 * trainer's own paper rather than from a second list, so the two cannot disagree. The
 * single-level paper's 30 minutes is a published telc figure and the DTZ's 30 a g.a.s.t. one;
 * the A2·B1 Schreiben slot is this app's, so it is not claimed as official (see `a2b1/paper.ts`).
 */
export const writingTimeHint = (format: ExamFormatId, minutes: number): string => {
  switch (format) {
    case 'dual-level':
      return `This trainer's pace: ${String(minutes)} minutes.`;
    case 'single-level':
    case 'dtz-paper':
      return `Official: ${String(minutes)} minutes.`;
    default:
      return unreachableFormat(format);
  }
};

export const PLAYS_ALLOWED_CHOICES: Readonly<Record<ExamFormatId, readonly SettingChoice[]>> = {
  'dual-level': [
    { value: 1, label: '1 (hard mode)' },
    { value: 2, label: '2 (realistic)' },
    { value: 3, label: '3 (training)' }
  ],
  'single-level': [
    { value: 1, label: '1 (official — you hear it once)' },
    { value: 2, label: '2 (training)' },
    { value: 3, label: '3 (training)' }
  ],
  /* The DTZ material states no play count, so no choice is called official. */
  'dtz-paper': [
    { value: 1, label: '1 (hard mode)' },
    { value: 2, label: "2 (this trainer's default)" },
    { value: 3, label: '3 (training)' }
  ]
};

/** How often each listening item plays in a fresh trainer document, per paper. */
export const DEFAULT_PLAYS_ALLOWED: Readonly<Record<ExamFormatId, number>> = {
  'dual-level': DEFAULT_SETTINGS.playsAllowed,
  'single-level': 1,
  /* This trainer's choice: the DTZ material does not say how often a text plays. */
  'dtz-paper': 2
};

/** What the real sitting does with its audio, said next to the plays-per-item choice. */
export const PLAYS_ALLOWED_HINTS: Readonly<Record<ExamFormatId, string>> = {
  'dual-level': 'The real exam plays most items twice.',
  'single-level': 'The real exam plays each item once.',
  'dtz-paper':
    "The DTZ material this trainer follows does not say how often each text plays — the default is this trainer's choice."
};

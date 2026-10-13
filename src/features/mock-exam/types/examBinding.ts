/**
 * A trainer resolved to everything an exam screen needs: the paper it sets, the papers it
 * ships, and the slice of the progress document its attempts live in. Which of those a
 * trainer has is read from the registry, so the screens narrow once — on the format — and
 * then render the same generic views either way.
 */

import { type ExamFormat } from '@shared/exam-run/types/examFormat.ts';
import { type DtzAttempt, type DtzExam } from '@shared/types/dtzExam.ts';
import { type DualLevelExam } from '@shared/types/exam.ts';
import { type DualLevelAttempt, type Settings } from '@shared/types/progress.ts';
import { type SingleLevelAttempt, type SingleLevelExam } from '@shared/types/singleLevelExam.ts';
import { type LevelTrainerSettings, type TrainerId } from '@shared/types/trainer.ts';

export interface ExamStore<TSettings, TAttempt> {
  readonly settings: TSettings;
  readonly attempts: readonly TAttempt[];
  /** Appends a finished attempt and persists the whole database. */
  readonly saveAttempt: (attempt: TAttempt) => void;
}

export type DualLevelFormat = ExamFormat<DualLevelExam, Settings, DualLevelAttempt>;
export type SingleLevelFormat = ExamFormat<SingleLevelExam, LevelTrainerSettings, SingleLevelAttempt>;
export type DtzFormat = ExamFormat<DtzExam, LevelTrainerSettings, DtzAttempt>;

export type ExamBinding =
  | {
      readonly kind: 'dual-level';
      readonly trainer: TrainerId;
      readonly format: DualLevelFormat;
      /** Its Modelltests, easiest first. */
      readonly papers: readonly DualLevelExam[];
      readonly store: ExamStore<Settings, DualLevelAttempt>;
    }
  | {
      readonly kind: 'single-level';
      readonly trainer: TrainerId;
      readonly format: SingleLevelFormat;
      readonly papers: readonly SingleLevelExam[];
      readonly store: ExamStore<LevelTrainerSettings, SingleLevelAttempt>;
    }
  | {
      readonly kind: 'dtz-paper';
      readonly trainer: TrainerId;
      readonly format: DtzFormat;
      readonly papers: readonly DtzExam[];
      readonly store: ExamStore<LevelTrainerSettings, DtzAttempt>;
    };

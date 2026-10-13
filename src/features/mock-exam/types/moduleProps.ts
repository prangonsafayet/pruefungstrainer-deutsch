import { type DtzExam } from '@shared/types/dtzExam.ts';
import { type DualLevelExam } from '@shared/types/exam.ts';
import { type ExamModuleProps } from '@shared/types/examRun.ts';
import { type Settings } from '@shared/types/progress.ts';
import { type SingleLevelExam } from '@shared/types/singleLevelExam.ts';
import { type LevelTrainerSettings } from '@shared/types/trainer.ts';

/** What an A2·B1 module renderer receives. */
export type A2b1ModuleProps = ExamModuleProps<DualLevelExam, Settings>;

/** What a single-level (B1/B2) module renderer receives. */
export type SingleLevelModuleProps = ExamModuleProps<SingleLevelExam, LevelTrainerSettings>;

/** What a DTZ module renderer receives. */
export type DtzModuleProps = ExamModuleProps<DtzExam, LevelTrainerSettings>;

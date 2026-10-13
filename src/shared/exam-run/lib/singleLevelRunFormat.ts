/**
 * The paper-independent half of the single-level (telc B1/B2) descriptor. Both levels share
 * it: they share the module list and the storage key, and a stored run names its own
 * trainer.
 */

import { SINGLE_LEVEL_MODULE_META, SINGLE_LEVEL_MODULES } from '@shared/config/singleLevelExam.ts';
import { type ExamRunFormat } from '@shared/exam-run/types/examFormat.ts';
import { type ExamModule } from '@shared/types/exam.ts';

import { createRunStore } from './runStore.ts';

/** Stable since the feature shipped — do not rename without a migration. */
const RUN_STORAGE_KEY = 'telcTrainerLevelRunV1';

export const SINGLE_LEVEL_RUN_FORMAT: ExamRunFormat = {
  modules: SINGLE_LEVEL_MODULES,
  moduleShort: (module: ExamModule) => SINGLE_LEVEL_MODULE_META[module].short,
  runStore: createRunStore(RUN_STORAGE_KEY)
};

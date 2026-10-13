/**
 * The paper-independent half of the DTZ descriptor: enough to start, resume or discard a run
 * without pulling in the module renderers.
 */

import { DTZ_MODULE_META, DTZ_MODULES } from '@shared/config/dtzExam.ts';
import { type ExamRunFormat } from '@shared/exam-run/types/examFormat.ts';
import { type ExamModule } from '@shared/types/exam.ts';

import { createRunStore } from './runStore.ts';

/**
 * Its own key, never `telcTrainerLevelRunV1`: an older build's `parseRuns` reads only the
 * trainers it knows from a key, so a DTZ run filed under a shared key would be dropped the
 * next time that build rewrote it. Persisted user data — never rename.
 */
const RUN_STORAGE_KEY = 'telcTrainerDtzRunV1';

export const DTZ_RUN_FORMAT: ExamRunFormat = {
  modules: DTZ_MODULES,
  moduleShort: (module: ExamModule) => DTZ_MODULE_META[module].short,
  runStore: createRunStore(RUN_STORAGE_KEY)
};

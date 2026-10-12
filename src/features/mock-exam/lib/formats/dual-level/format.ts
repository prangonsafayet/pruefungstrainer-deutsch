/**
 * The dual-level paper — the telc Deutsch A2·B1 Modelltest — described for the generic
 * runner: five modules, four 60-point skills plus Sprachbausteine, and a grade of B1, A2 or
 * Nicht bestanden.
 */

/* Sourced straight from its own paper.ts, not from the test-only content module: that module's
   evaluation is all-or-nothing (importing one export loads every trainer's whole content),
   which is exactly what per-trainer chunking depends on nobody doing — see the comment atop
   `content/trainerContent.ts`. */
import { A2B1_PAPER as DUAL_LEVEL_PAPER } from '@content/a2b1/paper.ts';

import { MODULE_META, RATING_CRITERIA } from '@shared/config/exam.ts';
import { MAX_CRITERION_SCORE } from '@shared/exam-run/config/run.ts';
import { DUAL_LEVEL_RUN_FORMAT } from '@shared/exam-run/lib/dualLevelRunFormat.ts';
import { type RatingSpec } from '@shared/exam-run/types/examFormat.ts';
import { type RatedModule } from '@shared/exam-run/types/run.ts';
import { moduleMinutes } from '@shared/lib/paper.ts';
import { type ExamModule } from '@shared/types/exam.ts';

import DualLevelHoerenModule from '@features/mock-exam/components/modules/dual-level/DualLevelHoerenModule/DualLevelHoerenModule.tsx';
import DualLevelLesenModule from '@features/mock-exam/components/modules/dual-level/DualLevelLesenModule/DualLevelLesenModule.tsx';
import DualLevelSchreibenModule from '@features/mock-exam/components/modules/dual-level/DualLevelSchreibenModule/DualLevelSchreibenModule.tsx';
import DualLevelSprachbausteineModule from '@features/mock-exam/components/modules/dual-level/DualLevelSprachbausteineModule/DualLevelSprachbausteineModule.tsx';
import DualLevelSprechenModule from '@features/mock-exam/components/modules/dual-level/DualLevelSprechenModule/DualLevelSprechenModule.tsx';
import { type DualLevelFormat } from '@features/mock-exam/types/examBinding.ts';

import { buildAttempt, completionToast, writingSample } from './attempt.ts';
import { buildReviewSections } from './review.ts';
import { countUnanswered } from './scoring.ts';
import { summarizeAttempt } from './summary.ts';

/** Each criterion scores 0–5; the sum is multiplied by 3 for a 60-point module score. */
const CRITERION_SCALE = 3;

const ratingSpec = (module: RatedModule): RatingSpec => {
  const criteria = RATING_CRITERIA[module];
  return {
    criteria,
    scale: CRITERION_SCALE,
    max: criteria.length * MAX_CRITERION_SCORE * CRITERION_SCALE
  };
};

export const DUAL_LEVEL_FORMAT: DualLevelFormat = {
  ...DUAL_LEVEL_RUN_FORMAT,
  examLabel: exam => `${exam.title} · ${exam.level}`,
  moduleName: (module: ExamModule) => MODULE_META[module].name,
  minutes: (module, _exam, settings) => moduleMinutes(DUAL_LEVEL_PAPER, module, settings),
  briefing: (module: ExamModule) => DUAL_LEVEL_PAPER.briefing[module],
  rating: { schreiben: ratingSpec('schreiben'), sprechen: ratingSpec('sprechen') },
  speakingHint:
    'Rate against the Redemittel: did you use suggestion phrases, react, ask back, reach a result in Teil 3?',
  speakingReviewNote:
    'Recordings are session-only and not stored. Re-run the module to practice again — and re-read the Sprechen tactics in the Exam Guide.',
  moduleComponents: {
    lesen: DualLevelLesenModule,
    sprachbausteine: DualLevelSprachbausteineModule,
    hoeren: DualLevelHoerenModule,
    schreiben: DualLevelSchreibenModule,
    sprechen: DualLevelSprechenModule
  },
  scoring: {
    countUnanswered,
    buildAttempt,
    summarize: summarizeAttempt,
    completionToast,
    review: buildReviewSections,
    writingSample: exam => writingSample(exam)
  }
};

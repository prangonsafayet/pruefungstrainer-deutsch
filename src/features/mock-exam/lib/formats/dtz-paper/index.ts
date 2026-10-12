/**
 * The Deutsch-Test für Zuwanderer (A2–B1), described for the generic runner: four modules
 * (no Sprachbausteine), one point per Hören and Lesen item, and a certificate — B1, A2 or
 * none — decided from three Teilergebnisse rather than from a total.
 */

/* Sourced straight from its own paper.ts, not from the content barrel — see the note atop
   `dual-level/index.ts`. */
import { DTZ_PAPER } from '@content/dtz/paper.ts';

import { DTZ_MODULE_META, DTZ_RATING_CRITERIA, DTZ_SPRECHEN_MAX } from '@shared/config/dtzExam.ts';
import { moduleMinutes } from '@shared/lib/paper.ts';
import { type ExamModule } from '@shared/types';

import DtzHoerenModule from '@features/mock-exam/components/modules/dtz-paper/DtzHoerenModule.tsx';
import DtzLesenModule from '@features/mock-exam/components/modules/dtz-paper/DtzLesenModule.tsx';
import DtzSchreibenModule from '@features/mock-exam/components/modules/dtz-paper/DtzSchreibenModule.tsx';
import DtzSprechenModule from '@features/mock-exam/components/modules/dtz-paper/DtzSprechenModule.tsx';
import { MAX_CRITERION_SCORE } from '@features/mock-exam/config/run.ts';
import { type DtzFormat } from '@features/mock-exam/types/examBinding.ts';
import { type RatingSpec } from '@features/mock-exam/types/examFormat.ts';

import { buildAttempt, completionToast, writingSample } from './attempt.ts';
import { buildReviewSections } from './review.ts';
import { DTZ_RUN_FORMAT } from './runFormat.ts';
import { countUnanswered } from './scoring.ts';
import { summarizeAttempt } from './summary.ts';

/* Schreiben: four criteria, 0–5 each, one point per step → 20 (spec p. 42–43). */
const SCHREIBEN_RATING: RatingSpec = {
  criteria: DTZ_RATING_CRITERIA.schreiben,
  scale: 1,
  max: DTZ_RATING_CRITERIA.schreiben.length * MAX_CRITERION_SCORE
};

/* Sprechen: nine six-step scales of unequal weight; one slider step is a fifth of each. */
const SPRECHEN_RATING: RatingSpec = {
  criteria: DTZ_RATING_CRITERIA.sprechen,
  scale: 1,
  stepPoints: DTZ_SPRECHEN_MAX.map(max => max / MAX_CRITERION_SCORE),
  max: DTZ_SPRECHEN_MAX.reduce((sum, max) => sum + max, 0)
};

export const DTZ_FORMAT: DtzFormat = {
  ...DTZ_RUN_FORMAT,
  examLabel: exam => `${exam.title} · A2–B1`,
  moduleName: (module: ExamModule) => DTZ_MODULE_META[module].name,
  minutes: (module, _exam, settings) => moduleMinutes(DTZ_PAPER, module, settings),
  briefing: (module: ExamModule) => DTZ_PAPER.briefing[module],
  rating: { schreiben: SCHREIBEN_RATING, sprechen: SPRECHEN_RATING },
  speakingHint:
    'Rate each part against the Redemittel: did you cover every Stichwort, describe the photo, answer the follow-up questions and reach a plan in Teil 3?',
  speakingReviewNote:
    'Recordings are session-only and not stored. Re-run the module to practice again — and re-read the Sprechen Redemittel before your next attempt.',
  moduleComponents: {
    hoeren: DtzHoerenModule,
    lesen: DtzLesenModule,
    schreiben: DtzSchreibenModule,
    sprechen: DtzSprechenModule
  },
  scoring: {
    countUnanswered,
    buildAttempt,
    summarize: summarizeAttempt,
    completionToast,
    review: buildReviewSections,
    writingSample
  }
};

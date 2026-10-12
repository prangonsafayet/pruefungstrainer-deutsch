import { type DtzContent } from '@shared/types/trainer.ts';

import { DTZ_CURRICULUM } from './curriculum.ts';
import { DTZ_EXAMS } from './exams/allExams.ts';
import { DTZ_GUIDE } from './guide.ts';
import { DTZ_VOCAB } from './vocab.ts';

/*
 * `paper.ts` is deliberately not part of this — see the note on `TrainerContent` in
 * @shared/types/trainer.ts. `TRAINERS.dtz.paper` in @shared/config/trainers.ts is where it
 * lives.
 */

/** Everything the DTZ trainer studies from. */
export const DTZ_CONTENT: DtzContent = {
  trainer: 'dtz',
  vocab: DTZ_VOCAB,
  curriculum: DTZ_CURRICULUM,
  exams: DTZ_EXAMS,
  guide: DTZ_GUIDE
};

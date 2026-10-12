import { useMemo } from 'react';

import { useTrainerContent } from '@shared/hooks/useTrainerContent.ts';
import { type DtzExam, type DualLevelExam, type SingleLevelExam, type TrainerId } from '@shared/types';

import { DTZ_FORMAT } from '@features/mock-exam/lib/formats/dtz-paper/index.ts';
import { DUAL_LEVEL_FORMAT } from '@features/mock-exam/lib/formats/dual-level/index.ts';
import { SINGLE_LEVEL_FORMAT } from '@features/mock-exam/lib/formats/single-level/index.ts';
import { type ExamBinding } from '@features/mock-exam/types/examBinding.ts';
import { useTrainerSlice } from '@features/progress-store';

/**
 * Resolves a trainer to the paper it sets, the papers it ships and the document its
 * attempts live in, so the three exam screens narrow once and then render the same generic
 * views either way. Which paper that is comes from the trainer's stored slice, which the
 * registry places — never from the trainer's id.
 *
 * `content.exams` comes back as the generic `TrainerContent` shape, so each branch below
 * casts it to the paper `slice.format` already says it is — the registry pairs a trainer
 * with one paper for good; only the type system needs telling twice.
 */
export const useExamBinding = (trainer: TrainerId): ExamBinding => {
  const slice = useTrainerSlice(trainer);
  const content = useTrainerContent(trainer);

  return useMemo(() => {
    /* Exhaustive without a `default`: a new paper leaves a path that returns nothing, which
       does not typecheck against `ExamBinding`. (A `never` check would read `slice`, which
       the deliberately narrow dependency list below leaves out.) */
    switch (slice.format) {
      case 'single-level':
        return {
          kind: 'single-level',
          trainer,
          format: SINGLE_LEVEL_FORMAT,
          papers: content.exams as readonly SingleLevelExam[],
          store: { settings: slice.settings, attempts: slice.attempts, saveAttempt: slice.saveAttempt }
        };
      case 'dtz-paper':
        return {
          kind: 'dtz-paper',
          trainer,
          format: DTZ_FORMAT,
          papers: content.exams as readonly DtzExam[],
          store: { settings: slice.settings, attempts: slice.attempts, saveAttempt: slice.saveAttempt }
        };
      case 'dual-level':
        return {
          kind: 'dual-level',
          trainer,
          format: DUAL_LEVEL_FORMAT,
          papers: content.exams as readonly DualLevelExam[],
          store: { settings: slice.settings, attempts: slice.attempts, saveAttempt: slice.saveAttempt }
        };
    }
    /* Narrow deliberately: `slice` and `content` are new objects on every progress write,
       so depending on them rebuilt `store` — and re-rendered the runner — whenever an
       unrelated field of the document changed. These five references do not move unless
       the thing they name actually changed. */
  }, [trainer, slice.format, slice.settings, slice.attempts, slice.saveAttempt, content.exams]);
};

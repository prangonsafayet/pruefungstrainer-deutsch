import { useMemo } from 'react';

import { TRAINERS } from '@shared/config/trainers.ts';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { useTrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';
import { buildScheduleFrom } from '@shared/study-schedule/lib/buildSchedule.ts';
import { trainerScheduleSource } from '@shared/study-schedule/lib/trainerSource.ts';
import { type Schedule } from '@shared/types/schedule.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import { useToday } from './useToday.tsx';

/**
 * The adaptive study plan of one trainer, or null when its stored exam date is unusable.
 * Derived on render and never persisted, so a plan can never disagree with progress.
 */
export const useTrainerSchedule = (trainer: TrainerId): Schedule | null => {
  const { learnDone, settings, attemptedExamIds } = useTrainerSlice(trainer);
  const today = useToday();
  const examDate = settings.examDate;
  const content = useTrainerContent(trainer);
  const { sprintLearnDays } = TRAINERS[trainer];

  return useMemo(
    () =>
      buildScheduleFrom(
        { examDate, today, learnDone, attemptedExamIds },
        trainerScheduleSource(content, sprintLearnDays)
      ),
    [examDate, today, learnDone, attemptedExamIds, content, sprintLearnDays]
  );
};

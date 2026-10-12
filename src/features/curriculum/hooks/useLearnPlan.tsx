import { useCallback, useMemo } from 'react';

import { TRAINERS } from '@shared/config/trainers.ts';
import { type StartAttempt, useStartAttempt } from '@shared/exam-run/hooks/useStartAttempt.tsx';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { learnTaskKey } from '@shared/lib/learnProgress.ts';
import { touchActivity, useTrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';
import { useToday } from '@shared/study-schedule/hooks/useToday.tsx';
import { type AiPromptLang, type Cheatsheet } from '@shared/types/learn.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import { summarizePlan, type PlanSummary } from '@features/curriculum/lib/planProgress.ts';

export interface LearnPlanState {
  readonly summary: PlanSummary;
  readonly cheatsheets: Readonly<Record<string, Cheatsheet>>;
  /** The language the plan's AI prompts are written in. */
  readonly aiPromptLang: AiPromptLang;
  readonly isTaskDone: (day: number, taskIndex: number) => boolean;
  readonly toggleTask: (day: number, taskIndex: number, done: boolean) => void;
  readonly isDayComplete: (day: number) => boolean;
  /** The trainer's route namespace, for the task links. */
  readonly basePath: string;
  /** Opens a task's module — resuming it if that run is already open, asking before replacing another. */
  readonly startModule: StartAttempt;
}

/**
 * The curriculum checkbox state of one trainer, stored in whichever slice of the progress
 * document that trainer owns. The key scheme is shared and persisted — never change it.
 */
export const useLearnPlan = (trainer: TrainerId): LearnPlanState => {
  const { learnDone: done, update } = useTrainerSlice(trainer);
  const today = useToday();
  const startModule = useStartAttempt(trainer);
  const curriculum = useTrainerContent(trainer).curriculum;

  const isTaskDone = useCallback(
    (day: number, taskIndex: number) => done[learnTaskKey(day, taskIndex)] === true,
    [done]
  );

  const toggleTask = useCallback(
    (day: number, taskIndex: number, isDone: boolean) => {
      update(current => {
        const key = learnTaskKey(day, taskIndex);
        /* Absent rather than `false`, so the map only ever lists completed tasks. */
        const { [key]: _removed, ...rest } = current.learnDone;
        const next = { ...current, learnDone: isDone ? { ...rest, [key]: true } : rest };
        return isDone ? touchActivity(next, today) : next;
      });
    },
    [update, today]
  );

  const isDayComplete = useCallback(
    (day: number) => {
      const entry = curriculum.days.find(candidate => candidate.day === day);
      return entry ? entry.tasks.every((_, index) => isTaskDone(day, index)) : false;
    },
    [curriculum.days, isTaskDone]
  );

  const summary = useMemo(() => summarizePlan(curriculum, done), [curriculum, done]);

  return {
    summary,
    cheatsheets: curriculum.cheatsheets,
    aiPromptLang: curriculum.aiPromptLang ?? 'en',
    isTaskDone,
    toggleTask,
    isDayComplete,
    basePath: TRAINERS[trainer].basePath,
    startModule
  };
};

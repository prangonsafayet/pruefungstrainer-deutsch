/** The learn-plan checkbox key scheme. Persisted and synced, so it never changes. */

import { type LearnDay, type LearnTask, type LearnTaskTarget } from '@shared/types/learn.ts';
import { type LearnDoneMap } from '@shared/types/progress.ts';

/** Checkbox key for one task of one day: `d7t2`. */
export const learnTaskKey = (day: number, taskIndex: number): string =>
  `d${String(day)}t${String(taskIndex)}`;

/** A day counts as done when every one of its tasks is ticked. */
export const isLearnDayComplete = (day: LearnDay, done: LearnDoneMap): boolean =>
  day.tasks.every((_, index) => done[learnTaskKey(day.day, index)] === true);

/** What a task says, whether or not it is annotated with a target. */
export const learnTaskText = (task: LearnTask): string => (typeof task === 'string' ? task : task.text);

/** Where a task is done, or null for a plain-string task. */
export const learnTaskTarget = (task: LearnTask): LearnTaskTarget | null =>
  typeof task === 'string' ? null : task.target;

import { useMemo } from 'react';

import { TRAINERS } from '@shared/config/trainers.ts';
import { buildScoreChart } from '@shared/lib/scoreChart.ts';
import { useTrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';
import { type ScoreChartModel } from '@shared/types/scoreChart.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import { type AttemptTableModel } from '@features/attempt-history/types/attemptTable.ts';

import { buildAttemptTable } from './attemptRows.ts';

export interface AttemptHistory {
  readonly heading: string;
  readonly lead: string;
  readonly chart: ScoreChartModel;
  readonly table: AttemptTableModel;
}

/** One trainer's stored attempts, resolved into the two views the History screen renders. */
export const useAttemptHistory = (trainer: TrainerId): AttemptHistory => {
  const slice = useTrainerSlice(trainer);
  const { name, short, basePath } = TRAINERS[trainer];

  return useMemo(() => {
    const full = slice.attempts.filter(attempt => attempt.mode === 'full').length;
    const practice = slice.attempts.length - full;
    return {
      heading: `History · ${short}`,
      lead: `Every attempt in the ${name} trainer — ${String(full)} full exam${full === 1 ? '' : 's'} and ${String(practice)} module practice run${practice === 1 ? '' : 's'}, with the time you actually used.`,
      chart: buildScoreChart(slice),
      table: buildAttemptTable(slice, basePath)
    };
  }, [slice, name, short, basePath]);
};

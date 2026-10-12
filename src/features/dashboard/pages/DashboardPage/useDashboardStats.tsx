import { useMemo } from 'react';

import { type PassRuleSummary } from '@shared/config/examConditions.ts';
import { examCount, examsRampInDifficulty, TRAINERS } from '@shared/config/trainers.ts';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { buildScoreChart } from '@shared/lib/scoreChart.ts';
import { useTrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';
import { useToday } from '@shared/study-schedule/hooks/useToday.tsx';
import { useTrainerSchedule } from '@shared/study-schedule/hooks/useTrainerSchedule.tsx';
import { describeMockLead, examSlotLabel } from '@shared/study-schedule/lib/describeSchedule.ts';
import { type ScoreChartModel } from '@shared/types/scoreChart.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import {
  type ExamCardModel,
  type MasteryModel,
  type MeterModel,
  type StatTileModel,
  type WeakAreaModel
} from '@features/dashboard/types/dashboard.ts';

import {
  buildMastery,
  buildMeters,
  buildTiles,
  buildWeakAreas,
  masteryCounts,
  metersHeading,
  passRuleFor
} from './dashboardModel.ts';
import { buildExamCards } from './examCards.ts';

export interface DashboardStats {
  readonly heading: string;
  readonly lead: string;
  readonly passRule: PassRuleSummary;
  readonly attemptCount: number;
  /** This trainer's own history page. */
  readonly historyTo: string;
  readonly tiles: readonly StatTileModel[];
  /** Best score per scored part of the paper, under the name that paper gives them. */
  readonly meters: readonly MeterModel[];
  readonly metersHeading: string;
  /** Null for a trainer with no vocabulary bank; its Practice page shows its empty state. */
  readonly mastery: MasteryModel | null;
  readonly weakAreas: readonly WeakAreaModel[];
  readonly chart: ScoreChartModel;
  readonly examCards: readonly ExamCardModel[];
}

/**
 * Everything one trainer's dashboard displays, derived from its stored slice, its content
 * and its plan. Which sections that adds up to follows from what the descriptor offers.
 */
export const useDashboardStats = (trainer: TrainerId): DashboardStats => {
  const slice = useTrainerSlice(trainer);
  const schedule = useTrainerSchedule(trainer);
  const today = useToday();
  const info = TRAINERS[trainer];
  const content = useTrainerContent(trainer);
  const vocab = content.vocab;

  return useMemo(() => {
    const mastery = buildMastery(trainer, vocab, slice.srs, today);
    const counts = mastery === null ? null : masteryCounts(vocab, slice.srs, today);
    return {
      heading: `Dashboard · ${info.short}`,
      lead: `${info.name}: ${describeMockLead(schedule, examCount(content), examsRampInDifficulty(content))}`,
      passRule: passRuleFor(info),
      attemptCount: slice.attempts.length,
      historyTo: `${info.basePath}/history`,
      tiles: buildTiles(slice, counts, today),
      meters: buildMeters(slice),
      metersHeading: metersHeading(slice),
      mastery,
      weakAreas: buildWeakAreas(slice, vocab, info.basePath),
      chart: buildScoreChart(slice),
      examCards: buildExamCards(slice, info, content.exams, examId => examSlotLabel(schedule, examId))
    };
  }, [trainer, info, content, vocab, slice, schedule, today]);
};

import { useAccountIdentity } from '@shared/account-sync/hooks/useAccountIdentity.tsx';
import ScoreHistoryChart from '@shared/components/data-display/ScoreHistoryChart/ScoreHistoryChart.tsx';
import ScoreMeter from '@shared/components/data-display/ScoreMeter/ScoreMeter.tsx';
import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import SectionTitle from '@shared/components/layout/SectionTitle/SectionTitle.tsx';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Card, CardContent } from '@shared/ui/card.tsx';

import DashboardExamCard from '@features/dashboard/components/DashboardExamCard/DashboardExamCard.tsx';
import DashboardStatTile from '@features/dashboard/components/DashboardStatTile/DashboardStatTile.tsx';
import LocalOnlyNotice from '@features/dashboard/components/LocalOnlyNotice/LocalOnlyNotice.tsx';
import ResumeRunNotice from '@features/dashboard/components/ResumeRunNotice/ResumeRunNotice.tsx';
import SchedulePhaseNotice from '@features/dashboard/components/SchedulePhaseNotice/SchedulePhaseNotice.tsx';
import TodayPlanCard from '@features/dashboard/components/TodayPlanCard/TodayPlanCard.tsx';
import VocabMasteryCard from '@features/dashboard/components/VocabMasteryCard/VocabMasteryCard.tsx';
import WeakAreasCard from '@features/dashboard/components/WeakAreasCard/WeakAreasCard.tsx';
import { useTodayPlan } from '@features/dashboard/hooks/useTodayPlan.tsx';

import { useDashboardStats } from './useDashboardStats.tsx';
import { useResumableRun } from './useResumableRun.tsx';

interface DashboardPageProps {
  readonly trainer: TrainerId;
}

/**
 * One trainer's landing screen. Every section is driven by what its descriptor offers —
 * the mastery card and the two study tiles appear for a trainer with a vocabulary bank, the
 * weak areas once there is enough signal — so there is one Dashboard, not one per trainer.
 */
const DashboardPage = ({ trainer }: DashboardPageProps) => {
  const stats = useDashboardStats(trainer);
  const identity = useAccountIdentity();
  const resumable = useResumableRun(trainer);
  const plan = useTodayPlan(trainer);

  return (
    <>
      <PageTitle
        lead={
          <>
            {stats.lead} <b className="text-foreground">{stats.passRule}</b>
          </>
        }
      >
        {stats.heading}
      </PageTitle>

      {identity.signedIn ? null : (
        <LocalOnlyNotice
          attemptCount={stats.attemptCount}
          syncAvailable={identity.configured}
          historyTo={stats.historyTo}
        />
      )}

      {resumable.run ? (
        <ResumeRunNotice
          run={resumable.run}
          modeLabel={resumable.modeLabel}
          onResume={resumable.resume}
          onDiscard={resumable.discard}
        />
      ) : null}

      {plan.notice ? (
        <SchedulePhaseNotice
          message={plan.notice}
          needsNewDate={plan.needsNewDate}
          settingsTo={plan.settingsTo}
        />
      ) : null}

      {plan.today ? (
        <TodayPlanCard
          plan={plan.today}
          onStartExam={examId => {
            resumable.start(examId, 'full');
          }}
        />
      ) : null}

      <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.tiles.map(tile => (
          <DashboardStatTile key={tile.kind} tile={tile} />
        ))}
      </div>

      {stats.weakAreas.length > 0 ? (
        <div className="mt-6">
          <WeakAreasCard areas={stats.weakAreas} />
        </div>
      ) : null}

      <SectionTitle>{stats.metersHeading}</SectionTitle>
      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {stats.meters.map(meter => (
            <ScoreMeter
              key={meter.key}
              label={meter.label}
              value={meter.value}
              of={meter.of}
              thresholdPercent={meter.thresholdPercent}
              thresholdLabel={meter.thresholdLabel}
            />
          ))}
        </CardContent>
      </Card>

      {stats.mastery ? (
        <>
          <SectionTitle>Vocabulary &amp; grammar mastery</SectionTitle>
          <VocabMasteryCard mastery={stats.mastery} />
        </>
      ) : null}

      <div className="mt-6">
        <ScoreHistoryChart model={stats.chart} />
      </div>

      <SectionTitle>Mock exams</SectionTitle>
      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.examCards.map(card => (
          <DashboardExamCard key={card.id} card={card} onStart={resumable.start} />
        ))}
        {stats.examCards.length === 0 ? (
          <p className="text-sm text-muted-foreground">The Modelltests for this trainer are on their way.</p>
        ) : null}
      </div>
    </>
  );
};

export default DashboardPage;

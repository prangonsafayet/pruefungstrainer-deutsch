import { Download, Upload } from 'lucide-react';

import ScoreHistoryChart from '@shared/components/data-display/ScoreHistoryChart/ScoreHistoryChart.tsx';
import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import { useProgressBackup } from '@shared/progress-store/hooks/useProgressBackup.tsx';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';

import AttemptTable from '@features/attempt-history/components/AttemptTable/AttemptTable.tsx';

import { useAttemptHistory } from './useAttemptHistory.tsx';

interface AttemptHistoryPageProps {
  readonly trainer: TrainerId;
}

/** Every stored attempt of one trainer, newest first, plus the backup controls. */
const AttemptHistoryPage = ({ trainer }: AttemptHistoryPageProps) => {
  const history = useAttemptHistory(trainer);
  const backup = useProgressBackup();

  return (
    <>
      <PageTitle lead={history.lead}>{history.heading}</PageTitle>

      <ScoreHistoryChart model={history.chart} />

      <Card className="mt-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
        <CardContent className="overflow-x-auto">
          <AttemptTable model={history.table} />
        </CardContent>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" onClick={backup.exportToFile}>
          <Download /> Export progress (JSON)
        </Button>
        <Button variant="outline" onClick={backup.importFromFile}>
          <Upload /> Import progress
        </Button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        The backup file holds every trainer&apos;s progress, not just this one.
      </p>
    </>
  );
};

export default AttemptHistoryPage;

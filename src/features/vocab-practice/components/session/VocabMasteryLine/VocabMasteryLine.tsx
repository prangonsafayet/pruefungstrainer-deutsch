import { useId } from 'react';

import { type MasteryCounts } from '@shared/lib/srs.ts';
import { Progress } from '@shared/ui/progress.tsx';

interface VocabMasteryLineProps {
  readonly counts: MasteryCounts;
}

/** A category's mastered/learning counts over a thin progress bar. */
const VocabMasteryLine = ({ counts }: VocabMasteryLineProps) => {
  const id = useId();
  const percent = counts.total > 0 ? (counts.mastered / counts.total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-xs text-muted-foreground">
        <span id={id}>
          {counts.mastered}/{counts.total} mastered · {counts.learning} learning
        </span>
        <span className="tabular-nums">{Math.round(percent)}%</span>
      </div>
      <Progress value={percent} className="h-1.5" aria-labelledby={id} />
    </div>
  );
};

export default VocabMasteryLine;

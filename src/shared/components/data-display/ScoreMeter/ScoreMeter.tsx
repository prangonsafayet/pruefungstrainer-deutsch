import { useId } from 'react';

import { cn } from '@shared/lib/cn.ts';
import { Progress } from '@shared/ui/progress.tsx';

import { meterTone } from './meterTone.ts';
import { useFillIn } from './useFillIn.tsx';

interface ScoreMeterProps {
  readonly label: string;
  readonly value: number | null | undefined;
  /** Points a perfect score on this bar is worth — a paper fact, so never defaulted. */
  readonly of: number;
  /** A status bar: green at or above its pass line, amber/red below it (see `meterTone`). */
  readonly colorByScore?: boolean;
  /** Where the pass line of this paper sits, as a percentage of `of`. */
  readonly thresholdPercent: number;
  readonly thresholdLabel: string;
}

/** A labelled progress bar with its paper's pass line marked. */
const ScoreMeter = ({
  label,
  value,
  of,
  colorByScore = false,
  thresholdPercent,
  thresholdLabel
}: ScoreMeterProps) => {
  const pct = value == null ? 0 : Math.round((value / of) * 100);
  const tone = meterTone(pct, thresholdPercent, colorByScore);

  /* Start empty and fill on the next frame so the bar animates in. */
  const shown = useFillIn(pct);
  const id = useId();

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span id={id} className="font-medium">
          {label}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {value == null ? '—' : `${String(value)}/${String(of)}`}
        </span>
      </div>
      <div className="relative">
        <Progress
          value={shown}
          aria-labelledby={id}
          /* The bar animates in, so its value in words is the score, not the frame. */
          aria-valuetext={
            value == null
              ? 'not taken'
              : `${String(value)} of ${String(of)} points (${String(pct)}%); ${thresholdLabel}`
          }
          indicatorClassName={cn(
            tone,
            'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
          )}
        />
        <div
          className="absolute inset-y-0 w-px bg-foreground/40"
          style={{ left: `${String(thresholdPercent)}%` }}
          title={thresholdLabel}
        />
      </div>
    </div>
  );
};

export default ScoreMeter;

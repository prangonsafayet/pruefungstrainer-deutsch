import { cn } from '@shared/lib/cn.ts';
import { fmtClock } from '@shared/lib/format.ts';

interface CountdownRingProps {
  readonly secondsRemaining: number;
  readonly totalSeconds: number;
  /** Diameter in pixels. */
  readonly size?: number;
  readonly className?: string;
}

const CRITICAL_SECONDS = 60;
const WARNING_SECONDS = 300;
const STROKE = 4;

/**
 * A stopwatch-style countdown: the ring drains clockwise as time runs out and shifts colour as
 * the deadline nears, and the time itself is always written beside it. Purely visual — the
 * deadline lives in run state, and the spoken warnings are the runner's live regions, never
 * this element (a timer read out every second is noise). No `aria-label`: it would replace the
 * visible "mm:ss left" as the name, so a screen reader heard "Time remaining" with no time.
 */
const CountdownRing = ({ secondsRemaining, totalSeconds, size = 40, className }: CountdownRingProps) => {
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = totalSeconds > 0 ? Math.min(1, Math.max(0, secondsRemaining / totalSeconds)) : 0;
  const critical = secondsRemaining <= CRITICAL_SECONDS;
  const warning = !critical && secondsRemaining <= WARNING_SECONDS;

  return (
    <span role="timer" aria-live="off" className={cn('inline-flex shrink-0 items-center gap-2', className)}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          className={cn(
            'transition-[stroke-dashoffset] duration-1000 ease-linear',
            critical ? 'text-destructive' : warning ? 'text-warning-foreground' : 'text-primary'
          )}
        />
      </svg>
      <span
        className={cn(
          'font-heading text-lg font-extrabold tabular-nums leading-none',
          critical ? 'text-destructive-on-tint' : warning ? 'text-warning-foreground' : 'text-foreground'
        )}
      >
        {fmtClock(secondsRemaining)}
        <span className="sr-only"> left</span>
      </span>
    </span>
  );
};

export default CountdownRing;

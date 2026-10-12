import { Send } from 'lucide-react';

import CountdownRing from '@shared/components/exam-ui/CountdownRing/CountdownRing.tsx';
import { Button } from '@shared/ui/button.tsx';
import { Progress } from '@shared/ui/progress.tsx';

interface ExamModuleToolbarProps {
  readonly secondsRemaining: number;
  readonly totalSeconds: number;
  /** True where the clock is only a guideline (Sprechen): it says so instead of "auto-submits". */
  readonly guidelineOnly: boolean;
  /** Items answered so far, and how many there are; 0 total (a productive module) hides it. */
  readonly answered: number;
  readonly total: number;
  /** "Submit Lesen" — the module's own verb. */
  readonly submitLabel: string;
  readonly onSubmit: () => void;
}

/**
 * The runner's controls — time, progress, submit — shared by every paper. Tablets and desktops
 * get them sticky under the header; phones get them docked at the bottom, within thumb reach,
 * clear of the home indicator. It is one element either way, so the tab order never changes.
 */
const ExamModuleToolbar = ({
  secondsRemaining,
  totalSeconds,
  guidelineOnly,
  answered,
  total,
  submitLabel,
  onSubmit
}: ExamModuleToolbarProps) => (
  <section
    aria-label="Timer, progress and submit"
    className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2.5 shadow-pop backdrop-blur-md sm:sticky sm:inset-x-auto sm:bottom-auto sm:top-[var(--header-h,4rem)] sm:z-30 sm:-mx-6 sm:mb-6 sm:border-b sm:border-t-0 sm:px-6 sm:py-3 sm:shadow-none"
  >
    <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-5">
      <div className="flex min-w-0 flex-col">
        <CountdownRing secondsRemaining={secondsRemaining} totalSeconds={totalSeconds} />
        <span className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
          {guidelineOnly ? 'guideline time' : 'auto-submits at 0:00'}
        </span>
      </div>

      {total > 0 ? (
        <div className="min-w-0 flex-1 space-y-1 sm:max-w-xs">
          <p
            id="exam-progress-label"
            className="text-xs font-semibold tabular-nums text-muted-foreground sm:text-sm"
          >
            {answered} of {total} answered
          </p>
          <Progress
            value={(answered / total) * 100}
            aria-labelledby="exam-progress-label"
            className="h-1.5"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <Button size="lg" className="ml-auto shrink-0" onClick={onSubmit}>
        <Send aria-hidden /> {submitLabel}
      </Button>
    </div>
  </section>
);

export default ExamModuleToolbar;

import { forwardRef, type AriaAttributes, type ComponentPropsWithoutRef, type ComponentRef } from 'react';

import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@shared/lib/cn.ts';

/**
 * A progressbar with no name is announced as just "progress bar, 40%" — so a name is
 * required by type: a label, or the id of the visible text that already says what it is.
 */
type ProgressName =
  Required<Pick<AriaAttributes, 'aria-label'>> | Required<Pick<AriaAttributes, 'aria-labelledby'>>;

export type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
  ProgressName & {
    /** Styles the filled portion — used to tone bars by score. */
    readonly indicatorClassName?: string;
  };

export const Progress = forwardRef<ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, indicatorClassName, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        value={value}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            'h-full w-full flex-1 rounded-full bg-primary transition-transform duration-[600ms] ease-out',
            indicatorClassName
          )}
          style={{ transform: `translateX(-${String(100 - (value ?? 0))}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);

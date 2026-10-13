import { CloudOff } from 'lucide-react';

import { cn } from '@shared/lib/cn.ts';
import { badgeVariants } from '@shared/ui/badge.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover.tsx';

/**
 * The header's offline badge. It opens a short note on what still works, so a learner who
 * loses the connection mid-session knows nothing is lost and what to expect.
 */
const OfflineBadge = () => (
  <Popover>
    <PopoverTrigger
      aria-label="Offline — what still works"
      className={cn(
        badgeVariants({ variant: 'warning' }),
        'cursor-pointer gap-1.5 py-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring'
      )}
    >
      <CloudOff className="size-3" aria-hidden />
      <span className="max-sm:sr-only">offline</span>
    </PopoverTrigger>
    <PopoverContent align="end" className="max-w-xs space-y-2 text-sm">
      <p className="font-heading font-bold">You&apos;re offline</p>
      <p>
        The trainer keeps working: exams, study plans, practice and your progress all live on this device.
      </p>
      <p className="text-muted-foreground">
        Cloud sync and writing feedback resume when you&apos;re back online. Listening audio uses your
        device&apos;s German voice, so it plays offline only if one is installed.
      </p>
    </PopoverContent>
  </Popover>
);

export default OfflineBadge;

import { CalendarClock, ClipboardCheck, Flame, Layers, Trophy, type LucideIcon } from 'lucide-react';

import CountedNumber from '@shared/components/data-display/CountedNumber/CountedNumber.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';

import { type StatTileKind, type StatTileModel } from '@features/dashboard/types/dashboard.ts';

interface DashboardStatTileProps {
  readonly tile: StatTileModel;
}

const ICONS: Readonly<Record<StatTileKind, LucideIcon>> = {
  streak: Flame,
  due: Layers,
  exams: ClipboardCheck,
  best: Trophy,
  last: CalendarClock
};

const DashboardStatTile = ({ tile }: DashboardStatTileProps) => {
  const Icon = ICONS[tile.kind];

  return (
    <Card className="card-hover gap-2 overflow-hidden py-4">
      <CardContent className="relative px-4">
        {/* An absolute inset resolves against the padding box, so `right-0` would ignore
            this container's px-4 and sit flush with the card edge while the label is inset
            16px. `right-4` gives the icon the same inset the text has. */}
        <Icon
          className="absolute right-4 top-0 size-8 text-primary/10 sm:size-10"
          strokeWidth={1.5}
          aria-hidden
        />
        <div className="pr-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:pr-10">
          {tile.label}
        </div>
        <div className="mt-1 text-2xl font-bold tabular-nums">
          {typeof tile.value === 'number' ? (
            <CountedNumber value={tile.value} />
          ) : (
            <span className="text-lg">{tile.value}</span>
          )}
          {tile.suffix === null ? null : (
            <span className="text-base font-normal text-muted-foreground">{tile.suffix}</span>
          )}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{tile.caption}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardStatTile;

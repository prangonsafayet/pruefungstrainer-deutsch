import { Play, Timer } from 'lucide-react';

import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';

interface ModuleBriefingCardProps {
  /** "Mock exam 3 · B1 · Module 2 of 5" — whatever identifies the sitting. */
  readonly kicker: string;
  /** The module name, e.g. "Leseverstehen". */
  readonly title: string;
  /** What to do, in one paragraph. */
  readonly briefing: string;
  readonly minutes: number;
  /** True for modules whose clock is only a guideline (Sprechen). */
  readonly guidelineOnly: boolean;
  /** The verb on the start button, e.g. "Start Lesen". */
  readonly startLabel: string;
  readonly onBegin: () => void;
  readonly onAbort: () => void;
}

/**
 * The "what to do" screen shown before each exam module starts — shared by all trainers. The
 * module name is the screen's `<h1>`; the kicker rides inside it after a separator a screen
 * reader hears, so the tab title reads "Leseverstehen · Mock exam 3 · B1 · Module 1 of 5".
 */
const ModuleBriefingCard = ({
  kicker,
  title,
  briefing,
  minutes,
  guidelineOnly,
  startLabel,
  onBegin,
  onAbort
}: ModuleBriefingCardProps) => (
  <Card className="animate-pop-in relative mx-auto max-w-2xl overflow-hidden shadow-lift">
    <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
    <CardContent className="space-y-6 pt-2 text-center">
      <h1 className="flex flex-col-reverse gap-1">
        <span className="text-3xl font-extrabold sm:text-4xl">{title}</span>
        <span className="sr-only"> · </span>
        <span className="text-sm font-semibold text-muted-foreground">{kicker}</span>
      </h1>
      <p className="mx-auto max-w-prose text-left leading-relaxed text-muted-foreground">
        <b className="text-foreground">What to do:</b> {briefing}
      </p>
      <p className="mx-auto flex w-fit items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
        <Timer className="size-4 shrink-0 text-primary" aria-hidden />
        <span>
          {minutes} minutes
          {guidelineOnly ? ' (guideline)' : ' — auto-submits when time runs out'}
        </span>
      </p>
      <div className="flex flex-col items-center gap-2">
        <Button size="lg" className="w-full px-8 sm:w-auto" onClick={onBegin}>
          <Play aria-hidden /> {startLabel}
        </Button>
        <Button variant="ghost" onClick={onAbort}>
          Abort attempt
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ModuleBriefingCard;

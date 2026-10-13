import { useId } from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';
import { Progress } from '@shared/ui/progress.tsx';

import { type MasteryModel } from '@features/dashboard/types/dashboard.ts';

interface VocabMasteryCardProps {
  readonly mastery: MasteryModel;
}

/** How far through its vocabulary and grammar bank a trainer is, with a way in. */
const VocabMasteryCard = ({ mastery }: VocabMasteryCardProps) => {
  /* Each bar is named by the visible text beside it, so both say the same thing. */
  const id = useId();
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between text-sm">
          <span id={`${id}-all`} className="font-medium">
            {mastery.mastered}/{mastery.total} items mastered
          </span>
          <span className="tabular-nums text-muted-foreground">{mastery.percent}%</span>
        </div>
        <Progress value={mastery.percent} aria-labelledby={`${id}-all`} />
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {mastery.categories.map(category => (
            <div key={category.key} className="flex items-center gap-3 text-sm">
              <span id={`${id}-${category.key}`} className="w-44 shrink-0">
                {category.label}
              </span>
              <Progress
                value={category.percent}
                className="h-1.5"
                aria-labelledby={`${id}-${category.key}`}
                aria-valuetext={`${String(category.mastered)} of ${String(category.total)} mastered`}
              />
              <span className="w-16 shrink-0 text-right tabular-nums text-muted-foreground">
                {category.mastered}/{category.total}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to={mastery.practiceTo}>Open the practice hub ▸</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to={mastery.learnTo}>Study plan ▸</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabMasteryCard;

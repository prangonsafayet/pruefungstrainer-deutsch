import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import CopyTextButton from '@shared/components/actions/CopyTextButton/CopyTextButton.tsx';
import { cn } from '@shared/lib/cn.ts';
import { learnTaskKey, learnTaskTarget, learnTaskText } from '@shared/lib/learnProgress.ts';
import { type Cheatsheet, type LearnDay } from '@shared/types/learn.ts';
import { Badge } from '@shared/ui/badge.tsx';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent, CardHeader } from '@shared/ui/card.tsx';
import { Checkbox } from '@shared/ui/checkbox.tsx';
import { Label } from '@shared/ui/label.tsx';

import { learnDayAnchor } from '@features/curriculum/hooks/useCheatsheetPanel.tsx';
import { resolveTaskTarget } from '@features/curriculum/lib/taskTarget.ts';

interface LearnDayCardProps {
  readonly day: LearnDay;
  readonly complete: boolean;
  /** The trainer's cheatsheets, for the titles this day names. */
  readonly cheatsheets: Readonly<Record<string, Cheatsheet>>;
  /** The trainer's route namespace, for the task links. */
  readonly basePath: string;
  readonly isTaskDone: (taskIndex: number) => boolean;
  readonly onToggleTask: (taskIndex: number, done: boolean) => void;
  readonly onOpenCheatsheet: (id: string) => void;
}

const GO_CLASS =
  'h-auto min-h-9 max-w-full whitespace-normal rounded-full px-3 py-1 text-left text-xs [&_svg]:size-3.5';

/** One curriculum day: its tasks as checkboxes, where to do them, its cheatsheets and AI prompts. */
const LearnDayCard = ({
  day,
  complete,
  cheatsheets,
  basePath,
  isTaskDone,
  onToggleTask,
  onOpenCheatsheet
}: LearnDayCardProps) => (
  <Card
    className={cn(
      'card-hover',
      complete &&
        'border-l-4 border-l-[color:var(--success)] bg-[color-mix(in_oklab,var(--success)_4%,transparent)]'
    )}
  >
    <CardHeader>
      <div className="flex flex-wrap items-center gap-2">
        {/* The way back from a cheatsheet lands here, so it takes focus without being a stop. */}
        <h3
          id={learnDayAnchor(day.day)}
          tabIndex={-1}
          className="scroll-mt-[calc(var(--header-h,4rem)+1rem)] text-base font-bold leading-snug outline-none"
        >
          Day {day.day}: {day.title}
        </h3>
        <Badge variant="secondary" className="text-left">
          {day.focus}
        </Badge>
        {complete ? <Badge variant="success">done</Badge> : null}
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <ul className="space-y-3">
        {day.tasks.map((task, index) => {
          const id = learnTaskKey(day.day, index);
          const done = isTaskDone(index);
          const rawTarget = learnTaskTarget(task);
          const target = rawTarget === null ? null : resolveTaskTarget(rawTarget, basePath, cheatsheets);
          return (
            <li key={id} className="flex items-start gap-3">
              <Checkbox
                id={id}
                className="mt-0.5"
                checked={done}
                onCheckedChange={next => {
                  onToggleTask(index, next === true);
                }}
              />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Label
                  htmlFor={id}
                  className={cn(
                    'cursor-pointer items-start text-sm font-normal leading-relaxed',
                    done && 'text-muted-foreground line-through'
                  )}
                >
                  {learnTaskText(task)}
                </Label>
                {target?.kind === 'link' ? (
                  <Button asChild variant="secondary" size="sm" className={GO_CLASS}>
                    <Link to={target.to}>
                      Go to {target.label} <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                ) : null}
                {target?.kind === 'cheatsheet' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className={GO_CLASS}
                    onClick={() => {
                      onOpenCheatsheet(target.id);
                    }}
                  >
                    <BookOpen aria-hidden /> Open {target.label}
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {day.cheats.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold">Cheatsheets:</span>
          {day.cheats.map(cheat => (
            <Button
              key={cheat}
              variant="outline"
              size="sm"
              className={GO_CLASS}
              onClick={() => {
                onOpenCheatsheet(cheat);
              }}
            >
              <BookOpen aria-hidden /> {cheatsheets[cheat]?.title ?? cheat}
            </Button>
          ))}
        </div>
      ) : null}

      {day.ai.map((prompt, index) => (
        <div
          key={index}
          className="rounded-xl border-l-4 border-primary bg-accent/40 p-3 transition-colors hover:bg-accent/60"
        >
          <div className="flex items-center gap-1.5 font-heading font-bold">
            <Sparkles className="size-4 shrink-0" aria-hidden /> AI practice — {prompt.t}
          </div>
          <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{prompt.p}</p>
          <CopyTextButton text={prompt.p} />
        </div>
      ))}
    </CardContent>
  </Card>
);

export default LearnDayCard;

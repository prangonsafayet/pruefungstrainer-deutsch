import { Check, ChevronsUpDown, GraduationCap } from 'lucide-react';

import { Button } from '@shared/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@shared/ui/dropdown-menu.tsx';

import { useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';

/** Switches between the three trainers; each one owns its own area of the app. */
const TrainerSwitcher = () => {
  const { trainer: active, trainers, switchTo } = useActiveTrainer();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5 rounded-full px-3"
          aria-label={`${active.short} — switch trainer`}
        >
          <GraduationCap className="size-4 text-primary max-sm:hidden" aria-hidden />
          <span>{active.short}</span>
          <ChevronsUpDown className="size-3.5 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Trainers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {trainers.map(trainer => {
          const { id } = trainer;
          return (
            <DropdownMenuItem
              key={id}
              onSelect={() => {
                switchTo(id);
              }}
              className="min-h-11 items-start gap-2.5 py-2.5"
            >
              <Check
                className={`mt-0.5 size-4 shrink-0 text-primary ${id === active.id ? '' : 'invisible'}`}
                aria-hidden
              />
              {/* Name and the static registry tagline only — this menu lists every trainer
                  at once, and only the active one's content has (or will have) loaded. */}
              <span>
                <span className="block font-heading font-bold">{trainer.name}</span>
                <span className="block text-xs text-muted-foreground">{trainer.tagline}</span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TrainerSwitcher;

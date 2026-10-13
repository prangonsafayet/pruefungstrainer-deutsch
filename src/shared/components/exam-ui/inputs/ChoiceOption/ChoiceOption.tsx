import { type ReactNode } from 'react';

import { Check } from 'lucide-react';

import { cn } from '@shared/lib/cn.ts';
import { Label } from '@shared/ui/label.tsx';
import { RadioGroupItem } from '@shared/ui/radio-group.tsx';

interface ChoiceOptionProps {
  /** The radio's id; the whole card is its label, so a tap anywhere on it chooses it. */
  readonly id: string;
  readonly value: string;
  readonly selected: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * One answer of a radio group drawn as a large tappable card. Selected reads four ways —
 * border, tint, a check and the word "Selected" — so colour is never the only signal; the
 * radio itself carries the state for a screen reader, so the visible word is hidden from it.
 */
const ChoiceOption = ({ id, value, selected, children, className }: ChoiceOptionProps) => (
  <Label
    htmlFor={id}
    className={cn(
      'min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 px-3 py-2.5 font-sans text-base font-normal leading-relaxed transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background sm:text-[0.9375rem]',
      selected
        ? 'border-primary bg-accent'
        : 'border-border bg-card hover:border-primary/50 hover:bg-accent/40',
      className
    )}
  >
    <RadioGroupItem
      id={id}
      value={value}
      className="mt-0.5 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
    <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</span>
    {selected ? (
      <span
        aria-hidden
        lang="en"
        className="flex shrink-0 items-center gap-1 self-center font-heading text-xs font-bold text-accent-foreground"
      >
        <Check className="size-4" /> Selected
      </span>
    ) : null}
  </Label>
);

export default ChoiceOption;

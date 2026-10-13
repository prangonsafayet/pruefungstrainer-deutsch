import { useId } from 'react';

import { cn } from '@shared/lib/cn.ts';
import { Label } from '@shared/ui/label.tsx';
import { Textarea } from '@shared/ui/textarea.tsx';

interface WritingFieldProps {
  /** The field's visible label, in the exam's language: "Ihre E-Mail", "Ihr Text". */
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly onChange: (text: string) => void;
  /** "84 Wörter — aim for 80–100", or a bare count where the paper sets no target. */
  readonly countText: string;
  /** True once the count is inside the target, which the count's colour echoes (never alone). */
  readonly inRange: boolean;
}

/**
 * The writing module's answer box: a visible label, and the live word count tied to it as its
 * description — read on focus, never announced on every keystroke.
 */
const WritingField = ({ label, placeholder, value, onChange, countText, inRange }: WritingFieldProps) => {
  const id = useId();
  return (
    <div className="max-w-3xl space-y-2">
      <Label htmlFor={id} className="font-heading text-base font-bold">
        {label}
      </Label>
      <Textarea
        id={id}
        className="min-h-72 text-base leading-relaxed"
        placeholder={placeholder}
        spellCheck={false}
        aria-describedby={`${id}-count`}
        value={value}
        onChange={event => {
          onChange(event.target.value);
        }}
      />
      <p
        id={`${id}-count`}
        className={cn(
          'text-right text-sm font-semibold tabular-nums',
          inRange ? 'text-success-foreground' : 'text-muted-foreground'
        )}
      >
        {countText}
      </p>
    </div>
  );
};

export default WritingField;

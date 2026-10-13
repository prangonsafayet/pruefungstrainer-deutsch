import { NO_MATCH_ANSWER } from '@shared/lib/answers.ts';
import { LETTERS } from '@shared/lib/format.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select.tsx';

interface LetterSelectProps {
  readonly count: number;
  readonly value: number | undefined;
  readonly onChange: (value: number) => void;
  readonly placeholder?: string;
  /** The control's accessible name — required: a bare letter box says nothing on its own. */
  readonly label: string;
  /**
   * Offers an extra "no match" option (value `NO_MATCH_ANSWER`, -1) after the letters,
   * labelled with this text — DTZ Lesen Teil 2's X.
   */
  readonly noMatchLabel?: string;
}

/** Letter dropdown (a–l) for the matching parts of Lesen. */
const LetterSelect = ({
  count,
  value,
  onChange,
  placeholder = '–',
  label,
  noMatchLabel
}: LetterSelectProps) => (
  <Select
    value={value == null ? '' : String(value)}
    onValueChange={next => {
      onChange(Number(next));
    }}
  >
    <SelectTrigger className="w-24 bg-card font-heading font-bold" aria-label={label}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {Array.from({ length: count }, (_, index) => (
        <SelectItem key={index} value={String(index)}>
          {LETTERS[index] ?? String(index + 1)}
        </SelectItem>
      ))}
      {noMatchLabel ? <SelectItem value={String(NO_MATCH_ANSWER)}>{noMatchLabel}</SelectItem> : null}
    </SelectContent>
  </Select>
);

export default LetterSelect;

import ChoiceOption from '@shared/components/exam-ui/inputs/ChoiceOption/ChoiceOption.tsx';
import { LETTERS } from '@shared/lib/format.ts';
import { RadioGroup } from '@shared/ui/radio-group.tsx';

interface MultipleChoiceProps {
  readonly name: string;
  readonly options: readonly string[];
  /** Index into `options`. */
  readonly value: number | undefined;
  readonly onChange: (value: number) => void;
  /** Names the group — usually the question it answers. */
  readonly label?: string;
}

/** a/b/c as one radio group of option cards: arrow keys move within it, Tab leaves it. */
const MultipleChoice = ({ name, options, value, onChange, label }: MultipleChoiceProps) => (
  <RadioGroup
    className="gap-2"
    aria-label={label}
    value={value == null ? '' : String(value)}
    onValueChange={next => {
      onChange(Number(next));
    }}
  >
    {options.map((option, index) => (
      <ChoiceOption
        key={index}
        id={`${name}-${String(index)}`}
        value={String(index)}
        selected={value === index}
      >
        <span className="mr-1.5 font-heading font-bold text-muted-foreground">{LETTERS[index]})</span>
        {option}
      </ChoiceOption>
    ))}
  </RadioGroup>
);

export default MultipleChoice;

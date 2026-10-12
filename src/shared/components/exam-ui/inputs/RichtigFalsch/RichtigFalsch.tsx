import ChoiceOption from '@shared/components/exam-ui/inputs/ChoiceOption/ChoiceOption.tsx';
import { RadioGroup } from '@shared/ui/radio-group.tsx';

interface RichtigFalschProps {
  /** Item id, e.g. `l4.2`; used to tie labels to inputs. */
  readonly name: string;
  readonly value: boolean | undefined;
  readonly onChange: (value: boolean) => void;
  /** Names the group — usually the statement it judges. */
  readonly label?: string;
}

const CHOICES = [
  [true, 'richtig'],
  [false, 'falsch']
] as const;

/** richtig / falsch. Radix works in strings, so the boolean is encoded on the way through. */
const RichtigFalsch = ({ name, value, onChange, label }: RichtigFalschProps) => (
  <RadioGroup
    className="grid-cols-2 gap-2 sm:max-w-md"
    aria-label={label}
    value={value == null ? '' : String(value)}
    onValueChange={next => {
      onChange(next === 'true');
    }}
  >
    {CHOICES.map(([raw, text]) => (
      <ChoiceOption key={text} id={`${name}-${String(raw)}`} value={String(raw)} selected={value === raw}>
        {text}
      </ChoiceOption>
    ))}
  </RadioGroup>
);

export default RichtigFalsch;

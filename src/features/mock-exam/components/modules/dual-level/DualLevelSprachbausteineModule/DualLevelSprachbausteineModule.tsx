import GapFillText from '@shared/components/exam-ui/gaps/GapFillText/GapFillText.tsx';
import InlineGapSelect from '@shared/components/exam-ui/gaps/InlineGapSelect/InlineGapSelect.tsx';
import MultipleChoice from '@shared/components/exam-ui/inputs/MultipleChoice/MultipleChoice.tsx';
import QuestionItem from '@shared/components/exam-ui/layout/QuestionItem/QuestionItem.tsx';
import QuestionText from '@shared/components/exam-ui/layout/QuestionText/QuestionText.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import { itemKey, numberAnswer } from '@shared/lib/answers.ts';
import { LETTERS } from '@shared/lib/format.ts';

import { type A2b1ModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const DualLevelSprachbausteineModule = ({ exam, answers, setAnswer }: A2b1ModuleProps) => {
  const { sprachbausteine } = exam;

  return (
    <>
      <TeilSection
        title="Teil 1 — Grammatik-Lücken"
        chip="6 Items"
        anweisung={sprachbausteine.teil1.anweisung}
      >
        <GapFillText
          text={sprachbausteine.teil1.text}
          renderGap={(gapIndex, label) => (
            <InlineGapSelect
              label={label}
              options={sprachbausteine.teil1.gaps[gapIndex]?.options ?? []}
              value={numberAnswer(answers, itemKey('s1.', gapIndex))}
              onChange={value => {
                setAnswer(itemKey('s1.', gapIndex), value);
              }}
            />
          )}
        />
      </TeilSection>

      <TeilSection
        title="Teil 2 — Wortschatz-Lücken"
        chip="6 Items"
        anweisung={sprachbausteine.teil2.anweisung}
      >
        <ul aria-label="Wörter" className="mb-4 flex flex-wrap gap-2">
          {sprachbausteine.teil2.wordBank.map((word, index) => (
            <li key={index} className="rounded-full bg-muted px-3 py-1">
              <span className="font-heading font-bold text-muted-foreground">{LETTERS[index]})</span> {word}
            </li>
          ))}
        </ul>
        <GapFillText
          text={sprachbausteine.teil2.text}
          renderGap={(gapIndex, label) => (
            <InlineGapSelect
              label={label}
              options={sprachbausteine.teil2.wordBank}
              value={numberAnswer(answers, itemKey('s2.', gapIndex))}
              onChange={value => {
                setAnswer(itemKey('s2.', gapIndex), value);
              }}
            />
          )}
        />
      </TeilSection>

      <TeilSection
        title="Teil 3 — Passende Antwort"
        chip="5 Items"
        anweisung={sprachbausteine.teil3.anweisung}
      >
        {sprachbausteine.teil3.items.map((item, index) => (
          <QuestionItem key={index}>
            <QuestionText>
              {index + 1}. {item.prompt}
            </QuestionText>
            <MultipleChoice
              name={itemKey('s3.', index)}
              label={item.prompt}
              options={item.options}
              value={numberAnswer(answers, itemKey('s3.', index))}
              onChange={value => {
                setAnswer(itemKey('s3.', index), value);
              }}
            />
          </QuestionItem>
        ))}
      </TeilSection>
    </>
  );
};

export default DualLevelSprachbausteineModule;

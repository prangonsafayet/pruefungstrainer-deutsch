import GapFillText from '@shared/components/exam-ui/gaps/GapFillText/GapFillText.tsx';
import InlineGapSelect from '@shared/components/exam-ui/gaps/InlineGapSelect/InlineGapSelect.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import { itemKey, numberAnswer } from '@shared/lib/answers.ts';
import { LETTERS } from '@shared/lib/format.ts';

import { type SingleLevelModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const SingleLevelSprachbausteineModule = ({ exam, answers, setAnswer }: SingleLevelModuleProps) => {
  const { sprachbausteine } = exam;

  return (
    <>
      <TeilSection
        title="Teil 1 — Grammatik-Lücken"
        chip="10 Items · je 1,5 Punkte"
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
        chip="10 Items · je 1,5 Punkte"
        anweisung={sprachbausteine.teil2.anweisung}
      >
        <ul aria-label="Wörter" className="mb-4 flex flex-wrap gap-2">
          {sprachbausteine.teil2.wordBank.map((word, index) => (
            <li key={index} className="rounded-full bg-muted px-3 py-1">
              <span className="font-heading font-bold text-muted-foreground">
                {LETTERS[index] ?? String(index + 1)})
              </span>{' '}
              {word}
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
    </>
  );
};

export default SingleLevelSprachbausteineModule;

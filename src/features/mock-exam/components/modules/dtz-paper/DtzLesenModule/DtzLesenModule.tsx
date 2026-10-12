import GapFillText from '@shared/components/exam-ui/gaps/GapFillText/GapFillText.tsx';
import InlineGapSelect from '@shared/components/exam-ui/gaps/InlineGapSelect/InlineGapSelect.tsx';
import LetterSelect from '@shared/components/exam-ui/inputs/LetterSelect/LetterSelect.tsx';
import MultipleChoice from '@shared/components/exam-ui/inputs/MultipleChoice/MultipleChoice.tsx';
import RichtigFalsch from '@shared/components/exam-ui/inputs/RichtigFalsch/RichtigFalsch.tsx';
import QuestionItem from '@shared/components/exam-ui/layout/QuestionItem/QuestionItem.tsx';
import QuestionText from '@shared/components/exam-ui/layout/QuestionText/QuestionText.tsx';
import ReadingText from '@shared/components/exam-ui/layout/ReadingText/ReadingText.tsx';
import SplitTeil from '@shared/components/exam-ui/layout/SplitTeil/SplitTeil.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import MatchingOptionCards from '@shared/components/exam-ui/MatchingOptionCards/MatchingOptionCards.tsx';
import MultilineText from '@shared/components/MultilineText/MultilineText.tsx';
import { booleanAnswer, itemKey, numberAnswer } from '@shared/lib/answers.ts';

import { dtzItemNumbers } from '@features/mock-exam/lib/formats/dtz-paper/items.ts';
import { type DtzModuleProps } from '@features/mock-exam/types/moduleProps.ts';

/* Teil 5's gaps sit inside the letter itself, so it stays one column: there is no separate
   material to put beside them. Every other Teil splits its shared text from its items. */
const DtzLesenModule = ({ exam, answers, setAnswer }: DtzModuleProps) => {
  const { teil1, teil2, teil3, teil4, teil5 } = exam.lesen;
  const numbers = dtzItemNumbers(exam);

  const choice = (key: string, frage: string, options: readonly string[]) => (
    <>
      <QuestionText>
        {numbers[key]}. {frage}
      </QuestionText>
      <MultipleChoice
        name={key}
        label={frage}
        options={options}
        value={numberAnswer(answers, key)}
        onChange={value => {
          setAnswer(key, value);
        }}
      />
    </>
  );

  const truth = (key: string, statement: string) => (
    <>
      <QuestionText>
        {numbers[key]}. {statement}
      </QuestionText>
      <RichtigFalsch
        name={key}
        label={statement}
        value={booleanAnswer(answers, key)}
        onChange={value => {
          setAnswer(key, value);
        }}
      />
    </>
  );

  return (
    <>
      <TeilSection title="Teil 1 — Verzeichnis" chip="5 Aufgaben · a/b/c" anweisung={teil1.anweisung}>
        <SplitTeil
          materialLabel={teil1.titel}
          material={
            <ReadingText title={teil1.titel}>
              <MultilineText text={teil1.verzeichnis} />
            </ReadingText>
          }
        >
          {teil1.questions.map((question, index) => (
            <QuestionItem key={index}>
              {choice(itemKey('l1.', index), question.frage, question.options)}
            </QuestionItem>
          ))}
        </SplitTeil>
      </TeilSection>

      <TeilSection title="Teil 2 — Anzeigen" chip="5 Aufgaben · a–h oder X" anweisung={teil2.anweisung}>
        <SplitTeil materialLabel="Anzeigen" material={<MatchingOptionCards items={teil2.ads} />}>
          {teil2.situations.map((situation, index) => {
            const key = itemKey('l2.', index);
            return (
              <QuestionItem key={index}>
                <QuestionText>
                  {numbers[key]}. {situation}
                </QuestionText>
                <LetterSelect
                  count={teil2.ads.length}
                  label={`Anzeige für Aufgabe ${String(numbers[key] ?? index + 1)}`}
                  noMatchLabel="X"
                  value={numberAnswer(answers, key)}
                  onChange={value => {
                    setAnswer(key, value);
                  }}
                />
              </QuestionItem>
            );
          })}
        </SplitTeil>
      </TeilSection>

      <TeilSection
        title="Teil 3 — Pressetexte"
        chip="6 Aufgaben · richtig/falsch + a/b/c"
        anweisung={teil3.anweisung}
      >
        <div className="space-y-8">
          {teil3.texts.map((text, index) => (
            <SplitTeil
              key={index}
              materialLabel={text.titel}
              material={
                <ReadingText title={text.titel}>
                  <MultilineText text={text.text} />
                </ReadingText>
              }
            >
              <QuestionItem>{truth(itemKey('l3.', index), text.statement.text)}</QuestionItem>
              <QuestionItem>
                {choice(itemKey('l3m.', index), text.question.frage, text.question.options)}
              </QuestionItem>
            </SplitTeil>
          ))}
        </div>
      </TeilSection>

      <TeilSection title="Teil 4 — Broschüre" chip="3 Aufgaben · richtig/falsch" anweisung={teil4.anweisung}>
        <SplitTeil
          materialLabel={teil4.titel}
          material={
            <ReadingText title={teil4.titel}>
              <MultilineText text={teil4.text} />
            </ReadingText>
          }
        >
          {teil4.statements.map((statement, index) => (
            <QuestionItem key={index}>{truth(itemKey('l4.', index), statement.text)}</QuestionItem>
          ))}
        </SplitTeil>
      </TeilSection>

      <TeilSection title="Teil 5 — Brief" chip="6 Aufgaben · a/b/c" anweisung={teil5.anweisung}>
        <GapFillText
          text={teil5.text}
          renderGap={(gapIndex, label) => (
            <InlineGapSelect
              label={label}
              options={teil5.gaps[gapIndex]?.options ?? []}
              value={numberAnswer(answers, itemKey('l5.', gapIndex))}
              onChange={value => {
                setAnswer(itemKey('l5.', gapIndex), value);
              }}
            />
          )}
        />
      </TeilSection>
    </>
  );
};

export default DtzLesenModule;

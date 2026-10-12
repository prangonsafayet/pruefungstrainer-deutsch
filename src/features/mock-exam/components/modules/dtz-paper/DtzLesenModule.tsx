import {
  GapFillText,
  InlineGapSelect,
  LetterSelect,
  MatchingOptionCards,
  MultilineText,
  MultipleChoice,
  QuestionItem,
  QuestionText,
  ReadingText,
  RichtigFalsch,
  TeilSection
} from '@shared/components';
import { booleanAnswer, itemKey, numberAnswer } from '@shared/lib/answers.ts';

import { dtzItemNumbers } from '@features/mock-exam/lib/formats/dtz-paper/items.ts';
import { type DtzModuleProps } from '@features/mock-exam/types/moduleProps.ts';

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
        value={booleanAnswer(answers, key)}
        onChange={value => {
          setAnswer(key, value);
        }}
      />
    </>
  );

  return (
    <div lang="de">
      <TeilSection title="Teil 1 — Verzeichnis" chip="5 Aufgaben · a/b/c" anweisung={teil1.anweisung}>
        <ReadingText title={teil1.titel}>
          <MultilineText text={teil1.verzeichnis} />
        </ReadingText>
        {teil1.questions.map((question, index) => (
          <QuestionItem key={index}>
            {choice(itemKey('l1.', index), question.frage, question.options)}
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection title="Teil 2 — Anzeigen" chip="5 Aufgaben · a–h oder X" anweisung={teil2.anweisung}>
        <MatchingOptionCards items={teil2.ads} />
        {teil2.situations.map((situation, index) => {
          const key = itemKey('l2.', index);
          return (
            <QuestionItem key={index}>
              <QuestionText>
                {numbers[key]}. {situation}
              </QuestionText>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Anzeige:
                <LetterSelect
                  count={teil2.ads.length}
                  label={`Anzeige für Aufgabe ${String(numbers[key] ?? index + 1)}`}
                  noMatchLabel="X"
                  value={numberAnswer(answers, key)}
                  onChange={value => {
                    setAnswer(key, value);
                  }}
                />
              </div>
            </QuestionItem>
          );
        })}
      </TeilSection>

      <TeilSection
        title="Teil 3 — Pressetexte"
        chip="6 Aufgaben · richtig/falsch + a/b/c"
        anweisung={teil3.anweisung}
      >
        {teil3.texts.map((text, index) => (
          <QuestionItem key={index}>
            <ReadingText title={text.titel}>
              <MultilineText text={text.text} />
            </ReadingText>
            {truth(itemKey('l3.', index), text.statement.text)}
            {choice(itemKey('l3m.', index), text.question.frage, text.question.options)}
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection title="Teil 4 — Broschüre" chip="3 Aufgaben · richtig/falsch" anweisung={teil4.anweisung}>
        <ReadingText title={teil4.titel}>
          <MultilineText text={teil4.text} />
        </ReadingText>
        {teil4.statements.map((statement, index) => (
          <QuestionItem key={index}>{truth(itemKey('l4.', index), statement.text)}</QuestionItem>
        ))}
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
    </div>
  );
};

export default DtzLesenModule;

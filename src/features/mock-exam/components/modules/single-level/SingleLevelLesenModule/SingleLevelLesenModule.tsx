import LetterSelect from '@shared/components/exam-ui/inputs/LetterSelect/LetterSelect.tsx';
import MultipleChoice from '@shared/components/exam-ui/inputs/MultipleChoice/MultipleChoice.tsx';
import QuestionItem from '@shared/components/exam-ui/layout/QuestionItem/QuestionItem.tsx';
import QuestionText from '@shared/components/exam-ui/layout/QuestionText/QuestionText.tsx';
import ReadingText from '@shared/components/exam-ui/layout/ReadingText/ReadingText.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import MatchingOptionCards from '@shared/components/exam-ui/MatchingOptionCards/MatchingOptionCards.tsx';
import MultilineText from '@shared/components/MultilineText/MultilineText.tsx';
import { itemKey, numberAnswer } from '@shared/lib/answers.ts';

import { type SingleLevelModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const SingleLevelLesenModule = ({ exam, answers, setAnswer }: SingleLevelModuleProps) => {
  const { lesen } = exam;

  return (
    <>
      <TeilSection
        title="Teil 1 — Überschriften zuordnen"
        chip="5 Items · je 5 Punkte"
        anweisung={lesen.teil1.anweisung}
      >
        <MatchingOptionCards items={lesen.teil1.headlines} />
        {lesen.teil1.texts.map((text, index) => (
          <QuestionItem key={index}>
            <QuestionText>Text {index + 1}</QuestionText>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <MultilineText text={text} />
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Überschrift:
              <LetterSelect
                count={lesen.teil1.headlines.length}
                value={numberAnswer(answers, itemKey('l1.', index))}
                onChange={value => {
                  setAnswer(itemKey('l1.', index), value);
                }}
              />
            </div>
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection
        title="Teil 2 — Detailverstehen"
        chip="5 Items · je 5 Punkte"
        anweisung={lesen.teil2.anweisung}
      >
        <ReadingText title={lesen.teil2.titel}>
          <MultilineText text={lesen.teil2.text} />
        </ReadingText>
        {lesen.teil2.questions.map((question, index) => (
          <QuestionItem key={index}>
            <QuestionText>
              {index + 1}. {question.frage}
            </QuestionText>
            <MultipleChoice
              name={itemKey('l2.', index)}
              options={question.options}
              value={numberAnswer(answers, itemKey('l2.', index))}
              onChange={value => {
                setAnswer(itemKey('l2.', index), value);
              }}
            />
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection
        title="Teil 3 — Anzeigen zuordnen"
        chip="10 Items · je 2,5 Punkte"
        anweisung={lesen.teil3.anweisung}
      >
        <MatchingOptionCards items={lesen.teil3.ads} />
        {lesen.teil3.situations.map((situation, index) => (
          <QuestionItem key={index}>
            <QuestionText>
              {index + 1}. {situation}
            </QuestionText>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Anzeige:
              <LetterSelect
                count={lesen.teil3.ads.length}
                value={numberAnswer(answers, itemKey('l3.', index))}
                onChange={value => {
                  setAnswer(itemKey('l3.', index), value);
                }}
              />
            </div>
          </QuestionItem>
        ))}
      </TeilSection>
    </>
  );
};

export default SingleLevelLesenModule;

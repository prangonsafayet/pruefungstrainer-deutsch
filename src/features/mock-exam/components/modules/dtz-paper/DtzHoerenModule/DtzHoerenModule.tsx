import { Headphones } from 'lucide-react';

import AudioPlayButton from '@shared/components/exam-ui/AudioPlayButton/AudioPlayButton.tsx';
import LetterSelect from '@shared/components/exam-ui/inputs/LetterSelect/LetterSelect.tsx';
import MultipleChoice from '@shared/components/exam-ui/inputs/MultipleChoice/MultipleChoice.tsx';
import RichtigFalsch from '@shared/components/exam-ui/inputs/RichtigFalsch/RichtigFalsch.tsx';
import ExamCallout from '@shared/components/exam-ui/layout/ExamCallout/ExamCallout.tsx';
import QuestionItem from '@shared/components/exam-ui/layout/QuestionItem/QuestionItem.tsx';
import QuestionText from '@shared/components/exam-ui/layout/QuestionText/QuestionText.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import MatchingOptionCards from '@shared/components/exam-ui/MatchingOptionCards/MatchingOptionCards.tsx';
import { booleanAnswer, itemKey, numberAnswer } from '@shared/lib/answers.ts';
import { LETTERS } from '@shared/lib/format.ts';
import { listeningRate } from '@shared/lib/paper.ts';
import { useSettings } from '@shared/progress-store/hooks/useProgress.tsx';

import { dtzItemNumbers } from '@features/mock-exam/lib/formats/dtz-paper/items.ts';
import { type DtzModuleProps } from '@features/mock-exam/types/moduleProps.ts';

import { DTZ_BEISPIEL_AUDIO_KEY, dtzAudioForKey } from './audio.ts';

const DtzHoerenModule = ({
  exam,
  paper,
  answers,
  setAnswer,
  settings,
  plays,
  onConsumePlay
}: DtzModuleProps) => {
  const { teil1, teil2, teil3, teil4 } = exam.hoeren;
  const numbers = dtzItemNumbers(exam);
  /* Voice and speed are the global speech settings, shared across every trainer. */
  const { ttsRate, voiceName } = useSettings();

  const playButton = (key: string) => (
    <AudioPlayButton
      script={dtzAudioForKey(exam, key)}
      rate={listeningRate(paper, ttsRate)}
      voiceName={voiceName}
      itemKey={key}
      playsLeft={plays[key] ?? settings.playsAllowed}
      onConsumePlay={onConsumePlay}
    />
  );

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

  return (
    <>
      <ExamCallout className="flex items-start gap-2">
        <Headphones aria-hidden className="mt-0.5 size-4 shrink-0" />
        <span>
          Each audio can be played <b>{settings.playsAllowed}×</b> — your setting; the DTZ material this
          trainer follows does not say how often the real exam plays a text. Read the items first, then press
          Play. Transcripts appear in the review.
        </span>
      </ExamCallout>

      <TeilSection title="Teil 1 — Ansagen" chip="4 Aufgaben · a/b/c" anweisung={teil1.anweisung}>
        {teil1.items.map((item, index) => (
          <QuestionItem key={index}>
            {playButton(itemKey('h1.', index))}
            {choice(itemKey('h1.', index), item.frage, item.options)}
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection title="Teil 2 — Radio" chip="5 Aufgaben · a/b/c" anweisung={teil2.anweisung}>
        {teil2.items.map((item, index) => (
          <QuestionItem key={index}>
            {playButton(itemKey('h2.', index))}
            {choice(itemKey('h2.', index), item.frage, item.options)}
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection
        title="Teil 3 — Gespräche"
        chip="8 Aufgaben · richtig/falsch + a/b/c"
        anweisung={teil3.anweisung}
      >
        {teil3.gespraeche.map((gespraech, index) => (
          <QuestionItem key={index}>
            {playButton(itemKey('h3.', index))}
            <QuestionText>
              {numbers[itemKey('h3.', index)]}. {gespraech.statement.text}
            </QuestionText>
            <RichtigFalsch
              name={itemKey('h3.', index)}
              label={gespraech.statement.text}
              value={booleanAnswer(answers, itemKey('h3.', index))}
              onChange={value => {
                setAnswer(itemKey('h3.', index), value);
              }}
            />
            {choice(itemKey('h3m.', index), gespraech.question.frage, gespraech.question.options)}
          </QuestionItem>
        ))}
      </TeilSection>

      <TeilSection
        title={`Teil 4 — Meinungen: ${teil4.thema}`}
        chip="3 Aufgaben · a–f"
        anweisung={teil4.anweisung}
      >
        <MatchingOptionCards items={teil4.sentences} />
        <QuestionItem>
          {playButton(DTZ_BEISPIEL_AUDIO_KEY)}
          <QuestionText>Beispiel → {LETTERS[teil4.beispiel.answer] ?? ''}</QuestionText>
        </QuestionItem>
        {teil4.aussagen.map((_, index) => {
          const key = itemKey('h4.', index);
          return (
            <QuestionItem key={index}>
              {playButton(key)}
              <div className="flex flex-wrap items-center gap-3">
                <QuestionText>
                  {numbers[key]}. Aussage {index + 1}
                </QuestionText>
                <LetterSelect
                  count={teil4.sentences.length}
                  label={`Aufgabe ${String(numbers[key] ?? index + 1)}`}
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
    </>
  );
};

export default DtzHoerenModule;

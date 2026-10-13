import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import WritingField from '@shared/components/exam-ui/WritingField/WritingField.tsx';
import MultilineText from '@shared/components/MultilineText/MultilineText.tsx';
import { textAnswer, WRITING_ANSWER_KEY } from '@shared/lib/answers.ts';
import { describeWordCount } from '@shared/lib/writingFeedback.ts';

import { type A2b1ModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const DualLevelSchreibenModule = ({ exam, paper, answers, setAnswer }: A2b1ModuleProps) => {
  const { schreiben } = exam;
  const text = textAnswer(answers, WRITING_ANSWER_KEY);
  const { count, hint, inRange } = describeWordCount(text, paper.writingTarget);

  return (
    <TeilSection title={paper.writingTitle} chip="60 Punkte" anweisung={schreiben.anweisung}>
      <p className="mb-4 max-w-3xl leading-relaxed">{schreiben.situation}</p>

      <div className="my-4 max-w-3xl overflow-hidden rounded-xl bg-muted">
        <div className="border-b border-border px-4 py-2.5 text-sm text-muted-foreground">
          Von: {schreiben.incomingEmail.von} · Betreff:{' '}
          <b className="text-foreground">{schreiben.incomingEmail.betreff}</b>
        </div>
        <div className="p-4 leading-relaxed">
          <MultilineText text={schreiben.incomingEmail.text} />
        </div>
      </div>

      <p className="mb-2 font-heading font-bold">Schreiben Sie zu diesen Punkten:</p>
      <ol className="mb-5 list-decimal space-y-1 pl-5 leading-relaxed">
        {schreiben.points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ol>

      <WritingField
        label="Ihre E-Mail"
        placeholder={paper.writingPlaceholder}
        value={text}
        onChange={next => {
          setAnswer(WRITING_ANSWER_KEY, next);
        }}
        countText={`${String(count)} Wörter — ${hint}`}
        inRange={inRange}
      />
    </TeilSection>
  );
};

export default DualLevelSchreibenModule;

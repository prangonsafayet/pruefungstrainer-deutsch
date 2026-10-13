import ChoiceOption from '@shared/components/exam-ui/inputs/ChoiceOption/ChoiceOption.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import WritingField from '@shared/components/exam-ui/WritingField/WritingField.tsx';
import WritingTaskBrief from '@shared/components/exam-ui/WritingTaskBrief/WritingTaskBrief.tsx';
import {
  itemKey,
  numberAnswer,
  textAnswer,
  WRITING_ANSWER_KEY,
  WRITING_TASK_KEY
} from '@shared/lib/answers.ts';
import { describeWordCount } from '@shared/lib/writingFeedback.ts';
import { RadioGroup } from '@shared/ui/radio-group.tsx';

import { type SingleLevelModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const SingleLevelSchreibenModule = ({ exam, paper, answers, setAnswer }: SingleLevelModuleProps) => {
  const { schreiben } = exam;
  const hasChoice = schreiben.tasks.length > 1;
  const chosen = numberAnswer(answers, WRITING_TASK_KEY) ?? 0;
  const task = schreiben.tasks[chosen] ?? schreiben.tasks[0];
  const text = textAnswer(answers, WRITING_ANSWER_KEY);
  const { count, hint, inRange } = describeWordCount(text, paper.writingTarget);

  if (!task) return null;

  return (
    <TeilSection title={paper.writingTitle} chip="45 Punkte" anweisung={schreiben.anweisung}>
      {hasChoice ? (
        <RadioGroup
          aria-label="Thema wählen"
          className="mb-5 gap-2 sm:grid-cols-2"
          value={String(chosen)}
          onValueChange={next => {
            setAnswer(WRITING_TASK_KEY, Number(next));
          }}
        >
          {schreiben.tasks.map((candidate, index) => (
            <ChoiceOption
              key={index}
              id={itemKey('w.task-', index)}
              value={String(index)}
              selected={chosen === index}
            >
              <b className="font-heading">Thema {String.fromCharCode(65 + index)}:</b> {candidate.titel}
            </ChoiceOption>
          ))}
        </RadioGroup>
      ) : null}

      <WritingTaskBrief task={task} />

      <WritingField
        label="Ihr Brief"
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

export default SingleLevelSchreibenModule;

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
import { LETTERS, wordCount } from '@shared/lib/format.ts';
import { RadioGroup } from '@shared/ui/radio-group.tsx';

import { type DtzModuleProps } from '@features/mock-exam/types/moduleProps.ts';

/* No word target: the DTZ states none ("Schreiben Sie möglichst viel"), so the count is bare. */
const DtzSchreibenModule = ({ exam, paper, answers, setAnswer }: DtzModuleProps) => {
  const { schreiben } = exam;
  const chosen = numberAnswer(answers, WRITING_TASK_KEY) ?? 0;
  const task = schreiben.tasks[chosen] ?? schreiben.tasks[0];
  const text = textAnswer(answers, WRITING_ANSWER_KEY);

  if (!task) return null;

  return (
    <TeilSection title={paper.writingTitle} chip="20 Punkte" anweisung={schreiben.anweisung}>
      <RadioGroup
        aria-label="Aufgabe wählen"
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
            {/* The authored titles already name their task ("Aufgabe A: …"); only a bare one gets the prefix. */}
            {candidate.titel.startsWith('Aufgabe')
              ? candidate.titel
              : `Aufgabe ${(LETTERS[index] ?? String(index + 1)).toUpperCase()}: ${candidate.titel}`}
          </ChoiceOption>
        ))}
      </RadioGroup>

      <WritingTaskBrief task={task} />

      <WritingField
        label="Ihr Text"
        placeholder={paper.writingPlaceholder}
        value={text}
        onChange={next => {
          setAnswer(WRITING_ANSWER_KEY, next);
        }}
        countText={`${String(wordCount(text))} Wörter`}
        inRange={false}
      />
    </TeilSection>
  );
};

export default DtzSchreibenModule;

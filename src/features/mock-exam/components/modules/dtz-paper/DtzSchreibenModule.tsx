import { TeilSection, WritingTaskBrief } from '@shared/components';
import {
  itemKey,
  numberAnswer,
  textAnswer,
  WRITING_ANSWER_KEY,
  WRITING_TASK_KEY
} from '@shared/lib/answers.ts';
import { cn } from '@shared/lib/cn.ts';
import { LETTERS, wordCount } from '@shared/lib/format.ts';
import { Label, RadioGroup, RadioGroupItem, Textarea } from '@shared/ui';

import { type DtzModuleProps } from '@features/mock-exam/types/moduleProps.ts';

/* No word target: the DTZ states none ("Schreiben Sie möglichst viel"), so the count is bare. */
const DtzSchreibenModule = ({ exam, paper, answers, setAnswer }: DtzModuleProps) => {
  const { schreiben } = exam;
  const chosen = numberAnswer(answers, WRITING_TASK_KEY) ?? 0;
  const task = schreiben.tasks[chosen] ?? schreiben.tasks[0];
  const text = textAnswer(answers, WRITING_ANSWER_KEY);

  if (!task) return null;

  return (
    <div lang="de">
      <TeilSection title={paper.writingTitle} chip="20 Punkte" anweisung={schreiben.anweisung}>
        <RadioGroup
          aria-label="Aufgabe wählen"
          className="mb-4 grid gap-2 sm:grid-cols-2"
          value={String(chosen)}
          onValueChange={next => {
            setAnswer(WRITING_TASK_KEY, Number(next));
          }}
        >
          {schreiben.tasks.map((candidate, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-2 rounded-lg border p-3 transition-colors',
                chosen === index && 'border-primary bg-accent/40'
              )}
            >
              <RadioGroupItem value={String(index)} id={itemKey('w.task-', index)} className="mt-1" />
              <Label htmlFor={itemKey('w.task-', index)} className="cursor-pointer font-normal">
                <b>Aufgabe {(LETTERS[index] ?? String(index + 1)).toUpperCase()}:</b> {candidate.titel}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <WritingTaskBrief task={task} />

        <Textarea
          className="min-h-64 leading-relaxed"
          placeholder={paper.writingPlaceholder}
          aria-label="Ihr Text"
          spellCheck={false}
          value={text}
          onChange={event => {
            setAnswer(WRITING_ANSWER_KEY, event.target.value);
          }}
        />
        <div className="mt-2 text-right text-sm text-muted-foreground">{wordCount(text)} Wörter</div>
      </TeilSection>
    </div>
  );
};

export default DtzSchreibenModule;

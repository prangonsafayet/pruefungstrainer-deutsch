import { ArrowRight, Check, X } from 'lucide-react';

import { cn } from '@shared/lib/cn.ts';
import { LETTERS } from '@shared/lib/format.ts';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';
import { Progress } from '@shared/ui/progress.tsx';

import PracticeSessionSummary from '@features/vocab-practice/components/session/PracticeSessionSummary/PracticeSessionSummary.tsx';
import { type QuizSession as QuizSessionState } from '@features/vocab-practice/lib/practiceStore.ts';

interface VocabQuizSessionProps {
  readonly session: QuizSessionState;
  readonly done: boolean;
  readonly onChoose: (option: number) => void;
  readonly onNext: () => void;
  readonly onRestart: () => void;
  readonly onClose: () => void;
}

/* A stable callback ref: runs when its element mounts, not on every render. */
const focusOnMount = (node: HTMLElement | null): void => {
  node?.focus({ preventScroll: true });
};

/** The quiz run: one question at a time with instant feedback and an explanation. */
const VocabQuizSession = ({ session, done, onChoose, onNext, onRestart, onClose }: VocabQuizSessionProps) => {
  if (done) {
    return (
      <PracticeSessionSummary
        kind="quiz"
        correct={session.correct}
        wrong={session.wrong}
        onRestart={onRestart}
        onClose={onClose}
      />
    );
  }

  const question = session.questions[session.index];
  if (!question) return null;
  const answered = session.chosen !== null;
  const correct = session.chosen === question.answer;
  const answerLetter = LETTERS[question.answer] ?? String(question.answer + 1);

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <Progress
          value={(session.index / session.questions.length) * 100}
          className="h-1.5"
          aria-label="Quiz progress"
          aria-valuetext={`Question ${String(session.index + 1)} of ${String(session.questions.length)}`}
        />
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {session.index + 1}/{session.questions.length}
        </span>
      </div>

      {/* Re-keying restarts the entrance animation for every new question. */}
      <Card key={question.id} className="animate-pop-in">
        <CardContent className="space-y-4">
          <div>
            {/* Each question mounts afresh, so focus lands on it and a screen reader reads it. */}
            <p
              ref={focusOnMount}
              tabIndex={-1}
              lang="de"
              className="font-heading text-lg font-bold leading-relaxed outline-none"
            >
              {question.prompt}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{question.hint}</p>
          </div>

          <div className="grid gap-2">
            {question.options.map((option, index) => {
              const isAnswer = index === question.answer;
              const isChosen = index === session.chosen;
              return (
                <Button
                  key={index}
                  variant="outline"
                  disabled={answered}
                  onClick={() => {
                    onChoose(index);
                  }}
                  className={cn(
                    'h-auto min-h-12 justify-start whitespace-normal py-2.5 text-left font-sans font-medium leading-relaxed transition-transform',
                    !answered && 'hover:scale-[1.01]',
                    answered && 'disabled:opacity-100',
                    answered &&
                      isAnswer &&
                      'border-[color:var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]',
                    answered && isChosen && !isAnswer && 'border-destructive bg-destructive/10'
                  )}
                >
                  <span className="mr-1 text-muted-foreground">{LETTERS[index] ?? String(index + 1)})</span>
                  <span className="min-w-0 flex-1">{option}</span>
                  {answered && isAnswer ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-success-foreground">
                      <Check className="size-4" aria-hidden /> Correct answer
                    </span>
                  ) : null}
                  {answered && isChosen && !isAnswer ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-destructive-on-tint">
                      <X className="size-4" aria-hidden /> Your answer
                    </span>
                  ) : null}
                </Button>
              );
            })}
          </div>

          {answered ? (
            <div className="animate-fade-up space-y-3">
              {/* Focus moves here once an answer is in: the verdict is said in words, never
                  by the colour of the option alone. */}
              <p
                ref={focusOnMount}
                tabIndex={-1}
                className={cn(
                  'rounded-xl border-l-4 p-3 text-sm leading-relaxed outline-none',
                  correct
                    ? 'border-[color:var(--success)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)]'
                    : 'border-destructive bg-destructive/10'
                )}
              >
                <strong
                  className={cn(
                    'block font-heading',
                    correct ? 'text-success-foreground' : 'text-destructive-on-tint'
                  )}
                >
                  {correct ? 'Richtig — well done.' : `Not quite — the answer is ${answerLetter}).`}
                </strong>
                {question.explanation}
              </p>
              <div className="flex justify-end">
                <Button onClick={onNext}>
                  Next <ArrowRight />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabQuizSession;

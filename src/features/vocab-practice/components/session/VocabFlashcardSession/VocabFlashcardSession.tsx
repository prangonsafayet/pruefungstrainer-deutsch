import { Check, RotateCw, X } from 'lucide-react';

import { Button } from '@shared/ui/button.tsx';
import { Progress } from '@shared/ui/progress.tsx';

import PracticeSessionSummary from '@features/vocab-practice/components/session/PracticeSessionSummary/PracticeSessionSummary.tsx';
import VocabFlashcard from '@features/vocab-practice/components/session/VocabFlashcard/VocabFlashcard.tsx';
import { type FlashcardSession as FlashcardSessionState } from '@features/vocab-practice/lib/practiceStore.ts';

interface VocabFlashcardSessionProps {
  readonly session: FlashcardSessionState;
  readonly done: boolean;
  readonly onFlip: () => void;
  readonly onGrade: (knewIt: boolean) => void;
  readonly onRestart: () => void;
  readonly onClose: () => void;
}

/** The flashcard run: progress, the flipping card, and honest self-grading. */
const VocabFlashcardSession = ({
  session,
  done,
  onFlip,
  onGrade,
  onRestart,
  onClose
}: VocabFlashcardSessionProps) => {
  if (done) {
    return (
      <PracticeSessionSummary
        kind="flashcards"
        correct={session.correct}
        wrong={session.wrong}
        onRestart={onRestart}
        onClose={onClose}
      />
    );
  }

  const card = session.cards[session.index];
  if (!card) return null;

  return (
    <div className="space-y-5">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <Progress value={(session.index / session.cards.length) * 100} className="h-1.5" />
        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {session.index + 1}/{session.cards.length}
        </span>
      </div>

      {/* Re-keying restarts the entrance animation for every new card. */}
      <div key={card.id} className="animate-pop-in">
        <VocabFlashcard card={card} flipped={session.flipped} onFlip={onFlip} />
      </div>

      {/* The flip button stays put when the grades appear, so keyboard focus is never dropped
          onto the page; the grades follow it in tab order. */}
      <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:flex sm:justify-center">
        <Button
          variant={session.flipped ? 'ghost' : 'secondary'}
          size="lg"
          className="col-span-2 justify-self-center"
          onClick={onFlip}
        >
          <RotateCw /> {session.flipped ? 'Show German' : 'Flip card'}
        </Button>
        {session.flipped ? (
          <>
            <Button
              variant="outline"
              size="lg"
              className="border-destructive/40 text-destructive-on-tint hover:bg-destructive/10 hover:text-destructive-on-tint"
              onClick={() => {
                onGrade(false);
              }}
            >
              <X /> Didn&apos;t know
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => {
                onGrade(true);
              }}
            >
              <Check /> Knew it
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default VocabFlashcardSession;

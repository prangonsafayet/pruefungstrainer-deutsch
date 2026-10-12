import { CATEGORY_META } from '@shared/config/studyCategories.ts';
import { cn } from '@shared/lib/cn.ts';
import { type StudyCard } from '@shared/types/vocab.ts';
import { Pressable } from '@shared/ui/pressable.tsx';

interface VocabFlashcardProps {
  readonly card: StudyCard;
  readonly flipped: boolean;
  readonly onFlip: () => void;
}

/* Each new card mounts afresh (the session keys it by id), so a keyboard learner who just
   graded one lands on the next and can flip it with Space or Enter straight away. A stable
   callback ref, so it runs on mount only. */
const focusOnMount = (node: HTMLButtonElement | null): void => {
  node?.focus({ preventScroll: true });
};

/**
 * One card with a 3D flip: German (and forms) on the front, English + example behind. The
 * card is a real button, so Space and Enter flip it; its name is the side facing the reader
 * (the hidden face is `aria-hidden`), never a generic "flip" label that hides the word.
 */
const VocabFlashcard = ({ card, flipped, onFlip }: VocabFlashcardProps) => (
  <div className="flip-scene mx-auto w-full max-w-xl">
    <Pressable
      ref={focusOnMount}
      onClick={onFlip}
      aria-pressed={flipped}
      aria-describedby="flashcard-hint"
      className={cn('flip-card h-64 w-full rounded-2xl sm:h-72', flipped && 'is-flipped')}
    >
      <span
        aria-hidden={flipped}
        className="flip-face flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center shadow-lift"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" lang="de">
          {CATEGORY_META[card.category].labelDe}
        </span>
        <span
          className="font-heading text-3xl font-extrabold tracking-tight [overflow-wrap:anywhere]"
          lang="de"
        >
          {card.front}
        </span>
        {card.frontDetail ? (
          <span className="text-sm text-muted-foreground" lang="de">
            {card.frontDetail}
          </span>
        ) : null}
      </span>

      <span
        aria-hidden={!flipped}
        className="flip-face flip-face-back flex flex-col items-center justify-center gap-3 rounded-2xl border border-primary/40 bg-accent p-6 text-center shadow-lift"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">English</span>
        <span className="font-heading text-2xl font-extrabold tracking-tight">{card.back}</span>
        <span className="mt-1 text-sm italic leading-relaxed" lang="de">
          „{card.example.de}“
        </span>
        <span className="text-sm text-accent-foreground">{card.example.en}</span>
      </span>
    </Pressable>
    <p id="flashcard-hint" className="mt-3 text-center text-xs text-muted-foreground">
      Tap the card, or press Space or Enter, to flip it.
    </p>
  </div>
);

export default VocabFlashcard;

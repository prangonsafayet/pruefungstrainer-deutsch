import { Check, X } from 'lucide-react';

import ListeningTranscript from '@shared/components/exam-ui/ListeningTranscript/ListeningTranscript.tsx';
import MultilineText from '@shared/components/MultilineText/MultilineText.tsx';
import { type ReviewRow } from '@shared/exam-run/types/examFormat.ts';
import { cn } from '@shared/lib/cn.ts';

interface AttemptReviewRowCardProps {
  readonly row: ReviewRow;
}

/**
 * One reviewed item. Right or wrong is said in words — the badge, and the row's accessible name
 * ("Teil 2 · 3, incorrect") — with colour and icon only repeating it.
 */
const AttemptReviewRowCard = ({ row }: AttemptReviewRowCardProps) => {
  const { correct } = row;

  return (
    <li>
      {/* One string, not a heading plus a hidden span: Chromium joins those with a stray space. */}
      <article
        aria-label={`${row.label}, ${correct ? 'correct' : 'incorrect'}`}
        className={cn(
          'rounded-xl border-l-4 bg-card p-4 shadow-soft',
          correct ? 'border-l-success' : 'border-l-destructive'
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{row.label}</h3>
          <span
            aria-hidden
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-heading text-xs font-bold',
              correct
                ? 'bg-[color-mix(in_oklab,var(--success)_16%,var(--card))] text-success-foreground'
                : 'bg-[color-mix(in_oklab,var(--destructive)_14%,var(--card))] text-destructive-on-tint'
            )}
          >
            {correct ? <Check className="size-3.5" /> : <X className="size-3.5" />}
            {correct ? 'Correct' : 'Incorrect'}
          </span>
        </div>
        {row.prompt ? (
          <p lang="de" className="mt-2 font-semibold leading-relaxed [overflow-wrap:anywhere]">
            <MultilineText text={row.prompt} />
          </p>
        ) : null}
        <p className={cn('mt-1.5 text-sm', correct ? 'text-muted-foreground' : 'text-destructive-on-tint')}>
          Your answer: <span lang="de">{row.given ?? '—'}</span>
        </p>
        {correct ? null : (
          <p className="text-sm font-semibold text-success-foreground">
            Correct: <span lang="de">{row.expected}</span>
          </p>
        )}
        {row.audio ? <ListeningTranscript audio={row.audio} /> : null}
      </article>
    </li>
  );
};

export default AttemptReviewRowCard;

import { LETTERS } from '@shared/lib/format.ts';

interface MatchingOptionCardsProps {
  /** The lettered ads or headlines the items match against. */
  readonly items: readonly string[];
}

/** The a)–l) option list of a matching Teil; two columns once its own box is wide enough. */
const MatchingOptionCards = ({ items }: MatchingOptionCardsProps) => (
  <div className="@container">
    <ul className="grid gap-2 @xl:grid-cols-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 rounded-xl bg-muted p-3 text-[0.9375rem] leading-relaxed">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card font-heading text-sm font-extrabold text-primary shadow-soft">
            {LETTERS[index] ?? String(index + 1)}
          </span>
          <span className="min-w-0 [overflow-wrap:anywhere]">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default MatchingOptionCards;

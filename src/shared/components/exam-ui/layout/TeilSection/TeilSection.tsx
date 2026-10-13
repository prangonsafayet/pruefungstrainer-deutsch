import { type ReactNode } from 'react';

import { Badge } from '@shared/ui/badge.tsx';

interface TeilSectionProps {
  readonly title: string;
  readonly chip?: string;
  /** The German task instruction, shown in italics above the items. */
  readonly anweisung?: string;
  readonly children: ReactNode;
}

/**
 * One "Teil 1 — …" block of a module. Everything inside is exam content, so the section is
 * German; English chrome placed inside (play buttons, the recorder) says `lang="en"` itself.
 */
const TeilSection = ({ title, chip, anweisung, children }: TeilSectionProps) => (
  <section
    lang="de"
    /* clip, not hidden: `overflow: hidden` would make the section the scroll container of the
       sticky reading pane inside it, pinning the pane to the section instead of the viewport. */
    className="animate-fade-up relative mb-6 overflow-clip rounded-2xl bg-card p-5 shadow-soft sm:p-6"
  >
    <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-lg font-extrabold leading-snug sm:text-xl">{title}</h2>
      {chip ? (
        <Badge variant="secondary" className="whitespace-normal">
          {chip}
        </Badge>
      ) : null}
    </div>
    {anweisung ? <p className="mb-4 max-w-3xl italic text-muted-foreground">{anweisung}</p> : null}
    {children}
  </section>
);

export default TeilSection;

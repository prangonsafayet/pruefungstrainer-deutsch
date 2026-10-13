import { type GuideTocEntry } from '@features/exam-guide/pages/ExamGuidePage/guideParts.ts';

interface GuideTocProps {
  readonly toc: readonly GuideTocEntry[];
}

const TOC_LINK =
  'block rounded-lg px-3 py-2 font-heading text-sm font-semibold text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring';

/** The guide's table of contents: one link per section. */
const GuideToc = ({ toc }: GuideTocProps) => (
  <ul className="space-y-0.5">
    {toc.map(entry => (
      <li key={entry.href}>
        {/* Authored label (it carries entities like &amp;), injected like the rest of the guide. */}
        <a className={TOC_LINK} href={entry.href} dangerouslySetInnerHTML={{ __html: entry.label }} />
      </li>
    ))}
  </ul>
);

export default GuideToc;

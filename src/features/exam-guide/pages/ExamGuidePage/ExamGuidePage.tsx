import { ListTree } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import { TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { type TrainerId } from '@shared/types/trainer.ts';

import GuideToc from '@features/exam-guide/components/GuideToc/GuideToc.tsx';

import { splitGuide } from './guideParts.ts';
import { useHashScroll } from './useHashScroll.tsx';

interface ExamGuidePageProps {
  readonly trainer: TrainerId;
}

/**
 * The exam guide of one trainer: authored HTML from its content. Its title and lead become the
 * page's heading (one `<h1>` per screen), its table of contents a sticky side nav on a wide
 * screen and a collapsible list above the text on a narrow one. A trainer with no guide has no
 * Guide route, so the redirect is only a safeguard for a hand-typed URL.
 */
const ExamGuidePage = ({ trainer }: ExamGuidePageProps) => {
  useHashScroll();
  const guide = useTrainerContent(trainer).guide;

  if (guide === null) return <Navigate to={trainerHome(trainer)} replace />;
  const parts = splitGuide(guide);

  return (
    <>
      <PageTitle
        lead={parts.lead === null ? undefined : <span dangerouslySetInnerHTML={{ __html: parts.lead }} />}
      >
        {parts.title === null ? (
          `Exam Guide · ${TRAINERS[trainer].short}`
        ) : (
          <span dangerouslySetInnerHTML={{ __html: parts.title }} />
        )}
      </PageTitle>

      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-10">
        {parts.toc.length > 0 ? (
          <>
            <nav aria-label="Guide contents" className="mb-6 lg:hidden">
              <details className="group rounded-2xl bg-card shadow-soft">
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-2xl px-4 font-heading font-bold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <ListTree className="size-4 text-primary" aria-hidden />
                  On this page
                  <span className="ml-auto text-sm font-semibold text-muted-foreground group-open:hidden">
                    {parts.toc.length} sections
                  </span>
                </summary>
                <div className="px-2 pb-3">
                  <GuideToc toc={parts.toc} />
                </div>
              </details>
            </nav>
            <nav
              aria-label="Guide contents"
              className="sticky top-[calc(var(--header-h,4rem)+1.5rem)] hidden max-h-[calc(100dvh-var(--header-h,4rem)-3rem)] overflow-y-auto lg:block"
            >
              <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                On this page
              </p>
              <GuideToc toc={parts.toc} />
            </nav>
          </>
        ) : null}

        <article
          className="prose min-w-0 max-w-[68ch] prose-headings:scroll-mt-[calc(var(--header-h,4rem)+1rem)] prose-h2:text-2xl prose-h3:text-lg"
          dangerouslySetInnerHTML={{ __html: parts.body }}
        />
      </div>
    </>
  );
};

export default ExamGuidePage;

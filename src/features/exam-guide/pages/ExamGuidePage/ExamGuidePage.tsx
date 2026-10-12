import { Navigate } from 'react-router-dom';

import { trainerHome } from '@shared/config/trainers.ts';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { type TrainerId } from '@shared/types/trainer.ts';

import { useHashScroll } from './useHashScroll.tsx';

interface ExamGuidePageProps {
  readonly trainer: TrainerId;
}

/**
 * The exam guide of one trainer: authored HTML from its content, injected into a prose
 * container. A trainer with no guide has no Guide route, so the redirect is only a
 * safeguard for a hand-typed URL.
 */
const ExamGuidePage = ({ trainer }: ExamGuidePageProps) => {
  useHashScroll();
  const guide = useTrainerContent(trainer).guide;

  if (guide === null) return <Navigate to={trainerHome(trainer)} replace />;

  return (
    <article
      className="prose max-w-none prose-headings:scroll-mt-24 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-base"
      dangerouslySetInnerHTML={{ __html: guide }}
    />
  );
};

export default ExamGuidePage;

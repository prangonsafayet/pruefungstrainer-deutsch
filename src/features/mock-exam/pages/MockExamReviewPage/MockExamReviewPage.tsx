import { Navigate, useParams } from 'react-router-dom';

import { TRAINERS } from '@shared/config/trainers.ts';
import { useStartAttempt } from '@shared/exam-run/hooks/useStartAttempt.tsx';
import { findPaper } from '@shared/lib/examLookup.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import AttemptReview from '@features/mock-exam/components/review/AttemptReview/AttemptReview.tsx';
import { useExamBinding } from '@features/mock-exam/hooks/useExamBinding.tsx';
import { findAttempt } from '@features/mock-exam/lib/attempts.ts';
import { withBinding } from '@features/mock-exam/lib/examBinding.ts';

interface MockExamReviewPageProps {
  readonly trainer: TrainerId;
}

/** Every item of an attempt with the given and the correct answer, plus transcripts. */
const MockExamReviewPage = ({ trainer }: MockExamReviewPageProps) => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const binding = useExamBinding(trainer);
  const retry = useStartAttempt(trainer);
  const history = `${TRAINERS[trainer].basePath}/history`;

  return withBinding(binding, ({ format, papers, store }) => {
    const attempt = findAttempt(store.attempts, attemptId);
    const exam = attempt ? findPaper(papers, attempt.examId) : undefined;
    if (!attempt || !exam) return <Navigate to={history} replace />;
    return <AttemptReview trainer={trainer} format={format} exam={exam} attempt={attempt} onRetry={retry} />;
  });
};

export default MockExamReviewPage;

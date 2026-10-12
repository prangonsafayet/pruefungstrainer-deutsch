import { Navigate, useParams } from 'react-router-dom';

import { TRAINERS } from '@shared/config/trainers.ts';
import { findPaper } from '@shared/lib/examLookup.ts';
import { type TrainerId } from '@shared/types';

import AttemptResults from '@features/mock-exam/components/results/AttemptResults.tsx';
import { useExamBinding } from '@features/mock-exam/hooks/useExamBinding.ts';
import { useStartAttempt } from '@features/mock-exam/hooks/useStartAttempt.ts';
import { findAttempt } from '@features/mock-exam/lib/attempts.ts';
import { withBinding } from '@features/mock-exam/lib/examBinding.ts';

interface ResultsPageProps {
  readonly trainer: TrainerId;
}

/** What one finished attempt scored. */
const ResultsPage = ({ trainer }: ResultsPageProps) => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const binding = useExamBinding(trainer);
  const retry = useStartAttempt(trainer);
  const history = `${TRAINERS[trainer].basePath}/history`;

  return withBinding(binding, ({ format, papers, store }) => {
    const attempt = findAttempt(store.attempts, attemptId);
    const exam = attempt ? findPaper(papers, attempt.examId) : undefined;
    if (!attempt || !exam) return <Navigate to={history} replace />;
    return (
      <AttemptResults
        trainer={trainer}
        format={format}
        exam={exam}
        attempt={attempt}
        settings={store.settings}
        onRetry={retry}
      />
    );
  });
};

export default ResultsPage;

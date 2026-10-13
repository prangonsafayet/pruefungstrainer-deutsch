import { Navigate, useParams } from 'react-router-dom';

import { trainerHome } from '@shared/config/trainers.ts';
import { findPaper } from '@shared/lib/examLookup.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import ExamRunnerView from '@features/mock-exam/components/runner/ExamRunnerView/ExamRunnerView.tsx';
import { useExamBinding } from '@features/mock-exam/hooks/useExamBinding.tsx';
import { isAttemptMode } from '@features/mock-exam/lib/attemptMode.ts';
import { withBinding } from '@features/mock-exam/lib/examBinding.ts';

interface MockExamRunnerPageProps {
  readonly trainer: TrainerId;
}

/** Drives one attempt: briefing → module → optional self-scoring → results. */
const MockExamRunnerPage = ({ trainer }: MockExamRunnerPageProps) => {
  const { examId, mode } = useParams<{ examId: string; mode: string }>();
  const binding = useExamBinding(trainer);
  const home = trainerHome(trainer);

  return withBinding(binding, ({ format, papers, store }) => {
    const exam = findPaper(papers, examId);
    /* An unknown exam or mode is a bad URL, not a state worth rendering. */
    if (!exam || !isAttemptMode(format, mode)) return <Navigate to={home} replace />;
    return <ExamRunnerView trainer={trainer} format={format} exam={exam} mode={mode} store={store} />;
  });
};

export default MockExamRunnerPage;

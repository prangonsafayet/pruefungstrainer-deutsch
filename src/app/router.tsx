import { lazy, Suspense, type ReactElement } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import RouteFallback from '@shared/components/RouteFallback/RouteFallback.tsx';
import { hasGuide, ROOT_TRAINER, TRAINER_ORDER, trainerHome } from '@shared/config/trainers.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import AppLayout from '@features/app-shell/components/AppLayout/AppLayout.tsx';
import NotFoundPage from '@features/app-shell/pages/NotFoundPage/NotFoundPage.tsx';
import DashboardPage from '@features/dashboard/pages/DashboardPage/DashboardPage.tsx';

/**
 * The dashboard is the landing page and ships in the main bundle; every other screen
 * loads on demand, so a first visit does not pay for the exam runner or the guide.
 */
const CurriculumPage = lazy(() => import('@features/curriculum/pages/CurriculumPage/CurriculumPage.tsx'));
const ExamGuidePage = lazy(() => import('@features/exam-guide/pages/ExamGuidePage/ExamGuidePage.tsx'));
const AttemptHistoryPage = lazy(
  () => import('@features/attempt-history/pages/AttemptHistoryPage/AttemptHistoryPage.tsx')
);
const SettingsPage = lazy(() => import('@features/settings/pages/SettingsPage/SettingsPage.tsx'));
const VocabPracticePage = lazy(
  () => import('@features/vocab-practice/pages/VocabPracticePage/VocabPracticePage.tsx')
);

/* One mock-exam feature serves every trainer; the screens take the trainer as a prop. */
const MockExamRunnerPage = lazy(
  () => import('@features/mock-exam/pages/MockExamRunnerPage/MockExamRunnerPage.tsx')
);
const MockExamResultsPage = lazy(
  () => import('@features/mock-exam/pages/MockExamResultsPage/MockExamResultsPage.tsx')
);
const MockExamReviewPage = lazy(
  () => import('@features/mock-exam/pages/MockExamReviewPage/MockExamReviewPage.tsx')
);

/** The guide screen, mounted only for a trainer whose descriptor ships one. */
const guideRoutes = (trainer: TrainerId): readonly ReactElement[] =>
  hasGuide(trainer) ? [<Route key="guide" path="guide" element={<ExamGuidePage trainer={trainer} />} />] : [];

/**
 * The three exam screens, mounted relative to whichever trainer's base path they sit
 * under. Every trainer sets a paper, so every trainer gets the same three URLs.
 */
const examRoutes = (trainer: TrainerId): readonly ReactElement[] => [
  <Route key="exam" path="exam/:examId/:mode" element={<MockExamRunnerPage trainer={trainer} />} />,
  <Route key="results" path="results/:attemptId" element={<MockExamResultsPage trainer={trainer} />} />,
  <Route key="review" path="review/:attemptId" element={<MockExamReviewPage trainer={trainer} />} />
];

/**
 * One trainer's whole URL space, mounted under its own base path — and the trainer the
 * registry puts at the root owns everything unclaimed. Nothing here names a trainer, so a
 * fourth one gets all of these screens from its registry entry alone.
 */
const trainerRoutes = (trainer: TrainerId): ReactElement => (
  <Route key={trainer} path={trainerHome(trainer)}>
    <Route index element={<DashboardPage trainer={trainer} />} />
    <Route path="learn" element={<CurriculumPage trainer={trainer} />} />
    {guideRoutes(trainer)}
    <Route path="practice" element={<VocabPracticePage trainer={trainer} />} />
    <Route path="history" element={<AttemptHistoryPage trainer={trainer} />} />
    {examRoutes(trainer)}
  </Route>
);

export const AppRouter = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route element={<AppLayout />}>
        {TRAINER_ORDER.map(trainerRoutes)}

        {/* Settings covers every trainer, so it sits beside them rather than inside one. */}
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/dashboard" element={<Navigate to={trainerHome(ROOT_TRAINER)} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);

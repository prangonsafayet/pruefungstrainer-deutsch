import { useCallback } from 'react';

import { Navigate } from 'react-router-dom';

import ExamModuleToolbar from '@shared/components/exam-ui/ExamModuleToolbar/ExamModuleToolbar.tsx';
import ModuleBriefingCard from '@shared/components/exam-ui/ModuleBriefingCard/ModuleBriefingCard.tsx';
import { TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { UNTIMED_MODULES } from '@shared/exam-run/config/run.ts';
import { type ExamFormat, type RunSettings, type StoredAttempt } from '@shared/exam-run/types/examFormat.ts';
import { useConfirm } from '@shared/providers/useConfirm.tsx';
import { type AttemptMode, type ExamPaper } from '@shared/types/exam.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Button } from '@shared/ui/button.tsx';

import SelfRatingCard from '@features/mock-exam/components/rating/SelfRatingCard/SelfRatingCard.tsx';
import { withTrainer } from '@features/mock-exam/lib/withTrainer.ts';
import { type ExamStore } from '@features/mock-exam/types/examBinding.ts';

import { timeUpMessage } from './timerAnnouncements.ts';
import { useExamRun } from './useExamRun.tsx';
import { useHeadingFocus } from './useHeadingFocus.tsx';
import { useTimerAnnouncements } from './useTimerAnnouncements.tsx';

interface ExamRunnerViewProps<
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
> {
  readonly trainer: TrainerId;
  readonly format: ExamFormat<TExam, TSettings, TAttempt>;
  readonly exam: TExam;
  readonly mode: AttemptMode;
  readonly store: ExamStore<TSettings, TAttempt>;
}

/** One attempt after the route params are known good: briefing → module → rating. */
const ExamRunnerView = <
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
>({
  trainer,
  format,
  exam,
  mode,
  store
}: ExamRunnerViewProps<TExam, TSettings, TAttempt>) => {
  const confirm = useConfirm();
  const run = useExamRun({
    trainer,
    format,
    exam,
    mode,
    settings: store.settings,
    saveAttempt: store.saveAttempt
  });
  const moduleShort = format.moduleShort(run.module);
  const guidelineOnly = UNTIMED_MODULES.includes(run.module);
  const politeTimer = useTimerAnnouncements(run.secondsRemaining, run.run.phase === 'module');
  useHeadingFocus(`${run.run.phase}-${String(run.run.index)}`);

  /* Submitting is final, and on a phone the button sits under the thumb: it always asks. */
  const handleSubmit = useCallback(async () => {
    const missing = run.requestSubmit();
    const ok = await confirm(
      missing > 0
        ? {
            title: `${String(missing)} item${missing === 1 ? '' : 's'} still unanswered`,
            description:
              'In the real exam a blank is a guaranteed zero — a guess costs nothing. Submit anyway?',
            confirmText: 'Submit anyway',
            cancelText: 'Keep working'
          }
        : {
            title: `Submit ${moduleShort}?`,
            description: 'You cannot change your answers after this.',
            confirmText: 'Submit now',
            cancelText: 'Keep working'
          }
    );
    if (ok) run.submit();
  }, [run, confirm, moduleShort]);

  const handleAbort = useCallback(async () => {
    const ok = await confirm({
      title: 'Abort this attempt?',
      description: 'Nothing from this attempt will be saved.',
      confirmText: 'Abort attempt',
      destructive: true
    });
    if (ok) run.abort();
  }, [run, confirm]);

  const step = run.run.mode === 'full' ? { index: run.run.index + 1, total: run.run.queue.length } : null;
  const kicker = `${withTrainer(format.examLabel(exam), TRAINERS[trainer].short)}${
    step ? ` · Module ${String(step.index)} of ${String(step.total)}` : ' · Single-module practice'
  }`;
  const ModuleComponent = format.moduleComponents[run.module];

  const screen = (() => {
    if (run.run.phase === 'brief') {
      return (
        <ModuleBriefingCard
          kicker={kicker}
          title={format.moduleName(run.module)}
          briefing={format.briefing(run.module, exam)}
          minutes={run.minutes}
          guidelineOnly={guidelineOnly}
          startLabel={`Start ${moduleShort}`}
          onBegin={run.beginModule}
          onAbort={() => void handleAbort()}
        />
      );
    }

    if (run.run.phase === 'rating' && (run.module === 'schreiben' || run.module === 'sprechen')) {
      return (
        <SelfRatingCard
          key={run.module}
          format={format}
          module={run.module}
          exam={exam}
          answers={run.run.answers}
          recordings={run.recordings}
          onConfirm={run.confirmRating}
        />
      );
    }

    /* A paper without this module (the DTZ has no Sprachbausteine) has no renderer for it, and
       the module ultimately comes out of localStorage: rendering `undefined` as a component is
       a blank screen with a stack trace, so a run naming one goes home instead. */
    if (!ModuleComponent) return <Navigate to={trainerHome(trainer)} replace />;

    return (
      <>
        <h1 className="mb-4 flex flex-col-reverse gap-0.5">
          <span className="text-2xl font-extrabold sm:text-3xl">{format.moduleName(run.module)}</span>
          <span className="sr-only"> · </span>
          <span className="text-sm font-semibold text-muted-foreground">{kicker}</span>
        </h1>

        <ExamModuleToolbar
          secondsRemaining={run.secondsRemaining}
          totalSeconds={run.totalSeconds}
          guidelineOnly={guidelineOnly}
          answered={run.itemsAnswered}
          total={run.itemsTotal}
          submitLabel={`Submit ${moduleShort}`}
          onSubmit={() => void handleSubmit()}
        />

        <ModuleComponent
          exam={exam}
          paper={TRAINERS[trainer].paper}
          answers={run.run.answers}
          setAnswer={run.setAnswer}
          settings={store.settings}
          plays={run.run.plays}
          onConsumePlay={run.consumePlay}
          recordings={run.recordings}
          onRecorded={run.setRecording}
        />

        <div className="mt-8 flex justify-center border-t border-border pt-6 sm:justify-start">
          <Button variant="ghost" onClick={() => void handleAbort()}>
            Abort attempt
          </Button>
        </div>
      </>
    );
  })();

  return (
    <>
      {/* Spoken clock: polite at 10, 5 and 1 minutes, assertive at zero — never every second.
          Both regions outlive the phase switch at time-up, so the warning is still heard. */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {politeTimer}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {run.timeUp
          ? timeUpMessage(format.moduleShort(run.timeUp), UNTIMED_MODULES.includes(run.timeUp))
          : ''}
      </div>
      {screen}
    </>
  );
};

export default ExamRunnerView;

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
import { type ExamStore } from '@features/mock-exam/types/examBinding.ts';

import { useExamRun } from './useExamRun.tsx';

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
  const handleSubmit = useCallback(async () => {
    const missing = run.requestSubmit();
    if (missing > 0) {
      const ok = await confirm({
        title: `${String(missing)} item${missing === 1 ? '' : 's'} still unanswered`,
        description: 'In the real exam a blank is a guaranteed zero — a guess costs nothing. Submit anyway?',
        confirmText: 'Submit anyway'
      });
      if (!ok) return;
    }
    run.submit();
  }, [run, confirm]);

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
  const label = format.examLabel(exam);

  if (run.run.phase === 'brief') {
    return (
      <ModuleBriefingCard
        kicker={`${label}${step ? ` · Module ${String(step.index)} of ${String(step.total)}` : ' · Single-module practice'}`}
        title={format.moduleName(run.module)}
        briefing={format.briefing(run.module, exam)}
        minutes={run.minutes}
        guidelineOnly={UNTIMED_MODULES.includes(run.module)}
        startLabel={`Start ${format.moduleShort(run.module)}`}
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

  const ModuleComponent = format.moduleComponents[run.module];
  /* A paper without this module (the DTZ has no Sprachbausteine) has no renderer for it, and
     the module ultimately comes out of localStorage: rendering `undefined` as a component is
     a blank screen with a stack trace, so a run naming one goes home instead. */
  if (!ModuleComponent) return <Navigate to={trainerHome(trainer)} replace />;

  return (
    <>
      <ExamModuleToolbar
        title={format.moduleName(run.module)}
        subtitle={`${label}${step ? ` · module ${String(step.index)}/${String(step.total)}` : ''}`}
        secondsRemaining={run.secondsRemaining}
        totalSeconds={run.totalSeconds}
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

      <div className="mt-6 flex flex-wrap gap-2">
        <Button size="lg" onClick={() => void handleSubmit()}>
          Submit {format.moduleShort(run.module)} ✓
        </Button>
        <Button variant="ghost" size="lg" onClick={() => void handleAbort()}>
          Abort attempt
        </Button>
      </div>
    </>
  );
};

export default ExamRunnerView;

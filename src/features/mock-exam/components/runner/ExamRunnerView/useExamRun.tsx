import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { TRAINERS } from '@shared/config/trainers.ts';
import {
  HEARTBEAT_MS,
  MS_PER_SECOND,
  SECONDS_PER_MINUTE,
  UNTIMED_MODULES
} from '@shared/exam-run/config/run.ts';
import { createRun, currentModule, queueForMode, secondsLeft } from '@shared/exam-run/lib/runStore.ts';
import { type ExamFormat, type RunSettings, type StoredAttempt } from '@shared/exam-run/types/examFormat.ts';
import { type ExamRun, type RatedModule } from '@shared/exam-run/types/run.ts';
import { stopSpeech } from '@shared/lib/speech.ts';
import { type AttemptMode, type ExamModule, type ExamPaper } from '@shared/types/exam.ts';
import { type RecordingMap, type SpeakingPart } from '@shared/types/examRun.ts';
import { type AnswerValue } from '@shared/types/progress.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

export interface ExamRunController {
  readonly run: ExamRun;
  readonly module: ExamModule;
  readonly minutes: number;
  readonly secondsRemaining: number;
  readonly totalSeconds: number;
  readonly recordings: RecordingMap;
  /** How many marked items the open module has (0 for a self-rated one), and how many are answered. */
  readonly itemsTotal: number;
  readonly itemsAnswered: number;
  /**
   * The module whose time ran out while it was open — set as the clock hits zero, cleared when
   * the next module begins. The runner says it out loud; nothing else depends on it.
   */
  readonly timeUp: ExamModule | null;
  readonly setAnswer: (key: string, value: AnswerValue) => void;
  readonly consumePlay: (key: string) => void;
  readonly setRecording: (part: SpeakingPart, url: string) => void;
  readonly beginModule: () => void;
  /** How many items are still blank — the page confirms before submitting past them. */
  readonly requestSubmit: () => number;
  readonly submit: () => void;
  readonly confirmRating: (score: number) => void;
  readonly abort: () => void;
}

interface ExamRunOptions<
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
> {
  /** Whose run this is: it decides the route prefix and which stored run resumes. */
  readonly trainer: TrainerId;
  readonly format: ExamFormat<TExam, TSettings, TAttempt>;
  readonly exam: TExam;
  readonly mode: AttemptMode;
  readonly settings: TSettings;
  /** Appends the finished attempt to whichever document this trainer stores. */
  readonly saveAttempt: (attempt: TAttempt) => void;
}

const isRated = (module: ExamModule | undefined): module is RatedModule =>
  module === 'schreiben' || module === 'sprechen';

/**
 * Owns the whole attempt: which module is open, the answers, the clock, and turning a
 * finished run into a stored attempt. Every transition writes through to localStorage, so
 * a reload resumes exactly where the candidate was.
 *
 * Nothing here knows which paper is being sat — the format descriptor answers that.
 */
export const useExamRun = <
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
>({
  trainer,
  format,
  exam,
  mode,
  settings,
  saveAttempt
}: ExamRunOptions<TExam, TSettings, TAttempt>): ExamRunController => {
  const navigate = useNavigate();
  const store = format.runStore;
  const basePath = TRAINERS[trainer].basePath;
  const examId = exam.id;

  const [run, setRun] = useState<ExamRun>(() => {
    /* The store hands back this trainer's run only. The trainer is re-checked all the same:
       resuming another trainer's run would mark it against the wrong paper, which is a worse
       failure than starting fresh, so it is asserted where it is relied on. */
    const saved = store.load(trainer);
    /* A stored queue naming a module this paper lacks (the DTZ has no Sprachbausteine) has no
       renderer: resuming it bounced home and left the run behind, so every Resume did it again. */
    if (
      saved !== null &&
      saved.trainer === trainer &&
      saved.examId === examId &&
      saved.mode === mode &&
      saved.queue.every(module => format.modules.includes(module))
    ) {
      return saved;
    }
    const fresh = createRun({ trainer, examId, mode, queue: queueForMode(format.modules, mode) });
    store.save(fresh);
    return fresh;
  });
  const [recordings, setRecordings] = useState<RecordingMap>({});
  const [, forceTick] = useState(0);
  const [timeUp, setTimeUp] = useState<ExamModule | null>(null);
  const finishedRef = useRef(false);

  /* The live run, readable outside render. Every transition writes here first, so a
     transition can decide what to do next without a state updater — putting the "finish"
     side effects (a stored attempt, a toast, a navigation) inside one would run them
     while React is rendering. */
  const runRef = useRef(run);

  /* The queue is never empty, so there is always a current module; fall back to the
     first entry rather than asserting non-null. */
  const module = currentModule(run) ?? format.modules[0] ?? 'lesen';
  const minutes = format.minutes(module, exam, settings);

  const write = useCallback(
    (next: ExamRun) => {
      runRef.current = next;
      store.save(next);
      setRun(next);
    },
    [store]
  );

  const patch = useCallback(
    (recipe: (current: ExamRun) => ExamRun) => {
      write(recipe(runRef.current));
    },
    [write]
  );

  const setAnswer = useCallback(
    (key: string, value: AnswerValue) => {
      patch(current => ({ ...current, answers: { ...current.answers, [key]: value } }));
    },
    [patch]
  );

  const playsAllowed = settings.playsAllowed;
  const consumePlay = useCallback(
    (key: string) => {
      patch(current => ({
        ...current,
        plays: { ...current.plays, [key]: (current.plays[key] ?? playsAllowed) - 1 }
      }));
    },
    [patch, playsAllowed]
  );

  const setRecording = useCallback((part: SpeakingPart, url: string) => {
    setRecordings(current => ({ ...current, [part]: url }));
  }, []);

  /** Turns a finished run into a stored attempt and navigates to its results. */
  const finish = useCallback(
    (finalRun: ExamRun) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      const attempt = format.scoring.buildAttempt({
        exam,
        mode: finalRun.mode,
        queue: finalRun.queue,
        answers: finalRun.answers,
        ratings: finalRun.ratings,
        times: finalRun.times
      });

      saveAttempt(attempt);
      store.clear(trainer);
      stopSpeech();

      const copy = format.scoring.completionToast(exam, attempt);
      toast[copy.tone](copy.title, { description: copy.description });

      void navigate(`${basePath}/results/${String(attempt.id)}`, { replace: true });
    },
    [format, exam, saveAttempt, store, trainer, navigate, basePath]
  );

  /** Records the time spent, then moves to the next module, the rating screen, or the end. */
  const submit = useCallback(() => {
    const current = runRef.current;
    const finishedModule = currentModule(current);
    if (!finishedModule || current.phase !== 'module') return;

    stopSpeech();
    const times = {
      ...current.times,
      [finishedModule]: Math.round((Date.now() - (current.moduleStart ?? Date.now())) / MS_PER_SECOND)
    };

    if (isRated(finishedModule)) {
      write({ ...current, times, phase: 'rating', deadline: null });
      return;
    }

    const nextIndex = current.index + 1;
    const upcoming = current.queue[nextIndex];
    if (!upcoming) {
      finish({ ...current, times });
      return;
    }

    write({ ...current, times, index: nextIndex, phase: 'brief', deadline: null, moduleStart: null });
    toast.success(`${format.moduleShort(finishedModule)} submitted`, {
      description: `Next up: ${format.moduleName(upcoming)}.`
    });
  }, [finish, write, format]);

  /* Counting the blanks of an empty answer sheet gives the module's item count. */
  const itemsTotal = useMemo(() => format.scoring.countUnanswered(exam, module, {}), [format, exam, module]);
  const itemsAnswered = itemsTotal - format.scoring.countUnanswered(exam, module, run.answers);

  const requestSubmit = useCallback(
    () => format.scoring.countUnanswered(exam, module, run.answers),
    [format, exam, module, run.answers]
  );

  const confirmRating = useCallback(
    (score: number) => {
      const current = runRef.current;
      const rated = currentModule(current);
      if (!isRated(rated)) return;

      const withRating: ExamRun = { ...current, ratings: { ...current.ratings, [rated]: score } };
      const nextIndex = current.index + 1;
      const upcoming = current.queue[nextIndex];

      if (!upcoming) {
        finish(withRating);
        return;
      }
      write({ ...withRating, index: nextIndex, phase: 'brief', deadline: null, moduleStart: null });
    },
    [finish, write]
  );

  const beginModule = useCallback(() => {
    setTimeUp(null);
    patch(current => ({
      ...current,
      phase: 'module',
      moduleStart: Date.now(),
      deadline: Date.now() + minutes * SECONDS_PER_MINUTE * MS_PER_SECOND
    }));
    window.scrollTo(0, 0);
  }, [patch, minutes]);

  const abort = useCallback(() => {
    store.clear(trainer);
    stopSpeech();
    toast.info('Attempt aborted', {
      description: 'Nothing was saved. Start again whenever you are ready.'
    });
    void navigate(basePath || '/');
  }, [store, trainer, navigate, basePath]);

  /*
   * One-second heartbeat while a timed module is open. It must not depend on `run`
   * itself: that object changes on every keystroke, which would restart the interval
   * before it ever fired and stall the clock. Live values are read through refs.
   */
  const submitRef = useRef(submit);
  useEffect(() => {
    submitRef.current = submit;
  }, [submit]);

  useEffect(() => {
    if (run.phase !== 'module') return undefined;
    const interval = setInterval(() => {
      forceTick(tick => tick + 1);
      const live = runRef.current;
      const open = currentModule(live);
      if (secondsLeft(live) <= 0 && open && UNTIMED_MODULES.includes(open)) {
        /* A guideline clock: nothing is submitted, but the candidate hears that it is over. */
        setTimeUp(open);
      } else if (secondsLeft(live) <= 0) {
        clearInterval(interval);
        setTimeUp(open ?? null);
        toast.warning('⏱ Time is up — the module was submitted automatically.');
        submitRef.current();
      }
    }, HEARTBEAT_MS);
    return () => {
      clearInterval(interval);
    };
  }, [run.phase, run.index]);

  const secondsRemaining = run.phase === 'module' ? secondsLeft(run) : 0;

  return useMemo(
    () => ({
      run,
      module,
      minutes,
      secondsRemaining,
      totalSeconds: minutes * SECONDS_PER_MINUTE,
      recordings,
      itemsTotal,
      itemsAnswered,
      timeUp,
      setAnswer,
      consumePlay,
      setRecording,
      beginModule,
      requestSubmit,
      submit,
      confirmRating,
      abort
    }),
    [
      itemsTotal,
      itemsAnswered,
      timeUp,
      run,
      module,
      minutes,
      secondsRemaining,
      recordings,
      setAnswer,
      consumePlay,
      setRecording,
      beginModule,
      requestSubmit,
      submit,
      confirmRating,
      abort
    ]
  );
};

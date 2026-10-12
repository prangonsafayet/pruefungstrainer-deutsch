import { DTZ_MODULE_META, DTZ_PART_LINES } from '@shared/config/dtzExam.ts';
import {
  type CompletionToast,
  type FinishedRun,
  type WritingSample
} from '@shared/exam-run/types/examFormat.ts';
import { numberAnswer, WRITING_TASK_KEY } from '@shared/lib/answers.ts';
import { type DtzAttempt, type DtzExam, type DtzSectionScores } from '@shared/types/dtzExam.ts';
import { type ExamModule } from '@shared/types/exam.ts';
import { type AnswerMap } from '@shared/types/progress.ts';

import { gradeFullExam, scoreModule } from './scoring.ts';

/** Marks a finished run and returns the attempt to store on the DTZ document. */
export const buildAttempt = ({
  exam,
  mode,
  queue,
  answers,
  ratings,
  times
}: FinishedRun<DtzExam>): DtzAttempt => {
  const includes = (candidate: ExamModule): boolean => queue.includes(candidate);
  const scores: DtzSectionScores = {};

  if (includes('hoeren')) scores.hoeren = scoreModule(exam, 'hoeren', answers);
  if (includes('lesen')) scores.lesen = scoreModule(exam, 'lesen', answers);
  if (includes('schreiben')) scores.schreiben = ratings.schreiben ?? 0;
  if (includes('sprechen')) scores.sprechen = ratings.sprechen ?? 0;

  const writingTask = numberAnswer(answers, WRITING_TASK_KEY);

  return {
    id: Date.now(),
    examId: exam.id,
    mode,
    date: new Date().toISOString(),
    times,
    scores,
    answers,
    ratings,
    ...(writingTask !== undefined ? { writingTask } : {}),
    /* Part levels are derived from `scores` whenever they are shown, never stored. */
    ...(mode === 'full' ? { result: gradeFullExam(scores).result } : {})
  };
};

export const completionToast = (exam: DtzExam, attempt: DtzAttempt): CompletionToast => {
  if (attempt.result != null) {
    const { scores } = attempt;
    const hoerenLesen = (scores.hoeren ?? 0) + (scores.lesen ?? 0);
    return {
      tone: attempt.result === 'unter A2' ? 'info' : 'success',
      title: `${exam.title} finished — ${attempt.result}`,
      description: `Hören + Lesen ${String(hoerenLesen)}/${String(DTZ_PART_LINES.hoerenLesen.max)} · Schreiben ${String(scores.schreiben ?? 0)}/${String(DTZ_PART_LINES.schreiben.max)} · Sprechen ${String(scores.sprechen ?? 0)}/${String(DTZ_PART_LINES.sprechen.max)}. Review every red item before your next test.`
    };
  }
  const module: ExamModule | null = attempt.mode === 'full' ? null : attempt.mode;
  return {
    tone: 'success',
    title: `${module ? DTZ_MODULE_META[module].short : exam.title} practice saved`,
    description: 'Open the review to see the correct answers and transcripts.'
  };
};

/** The Musterlösung of whichever task — Aufgabe A or B — was chosen. */
export const writingSample = (exam: DtzExam, answers: AnswerMap): WritingSample | null => {
  const chosen = numberAnswer(answers, WRITING_TASK_KEY) ?? 0;
  const task = exam.schreiben.tasks[chosen] ?? exam.schreiben.tasks[0];
  if (!task) return null;
  return { musterloesung: task.musterloesung, tipps: exam.schreiben.tipps, points: task.leitpunkte };
};

import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { TRAINERS } from '@shared/config/trainers.ts';
import { runFormatFor } from '@shared/exam-run/lib/runFormats.ts';
import { createRun, queueForMode } from '@shared/exam-run/lib/runStore.ts';
import { useConfirm } from '@shared/providers/useConfirm.tsx';
import { type AttemptMode } from '@shared/types/exam.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

export interface StartOptions {
  /**
   * When the run in progress is this very exam and mode, open it as it is rather than start
   * over — what a "Go to Lesen · Modelltest 3" link means. A "Start"/"Retry" button leaves it
   * off: it starts fresh, after asking.
   */
  readonly resumeIfSame?: boolean;
}

export type StartAttempt = (examId: number, mode: AttemptMode, options?: StartOptions) => void;

/**
 * Starts a fresh run of an exam and mode for one trainer and opens the runner. Used by every
 * "start", "retry" and curriculum "Go →" in the app.
 *
 * A trainer keeps one run in progress, so starting another replaces it — answers, clock and
 * typed text. That is never done silently: the candidate is asked first, and the run is only
 * replaced once they say so.
 */
export const useStartAttempt = (trainer: TrainerId): StartAttempt => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  return useCallback(
    (examId, mode, options = {}) => {
      const format = runFormatFor(trainer);
      const runnerPath = `${TRAINERS[trainer].basePath}/exam/${String(examId)}/${mode}`;
      const current = format.runStore.load(trainer);

      const begin = (): void => {
        format.runStore.save(createRun({ trainer, examId, mode, queue: queueForMode(format.modules, mode) }));
        void navigate(runnerPath);
      };

      if (current === null) {
        begin();
        return;
      }
      if (options.resumeIfSame === true && current.examId === examId && current.mode === mode) {
        void navigate(runnerPath);
        return;
      }

      const what = current.mode === 'full' ? 'a full exam' : format.moduleShort(current.mode);
      void confirm({
        title: `You have ${what} in progress for Modelltest ${String(current.examId)} — discard it?`,
        description: 'Starting this one replaces it, and its answers are lost.',
        confirmText: 'Discard and start',
        cancelText: 'Keep it',
        destructive: true
      }).then(ok => {
        if (ok) begin();
      });
    },
    [navigate, confirm, trainer]
  );
};

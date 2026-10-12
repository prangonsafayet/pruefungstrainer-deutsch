import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { appError, type AppError } from '@shared/lib/appError.ts';
import { logger } from '@shared/lib/logger.ts';

export type RecorderStatus = 'idle' | 'recording' | 'done' | 'unavailable';

export interface RecorderState {
  readonly status: RecorderStatus;
  readonly message: string;
  readonly supported: boolean;
  readonly start: () => Promise<void>;
  readonly stop: () => void;
}

interface RecorderOptions {
  /** Called with a blob URL once a recording finishes. */
  readonly onRecorded: (url: string) => void;
}

/** What `getUserMedia` / `MediaRecorder` threw, as something the learner can act on. */
export const micError = (error: unknown): AppError => {
  const name = error instanceof Error || error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return appError('mic-denied', { cause: error });
  if (name === 'NotFoundError' || name === 'OverconstrainedError')
    return appError('mic-missing', { cause: error });
  if (name === 'NotSupportedError') return appError('mic-unsupported', { cause: error });
  return appError('mic-failed', { cause: error });
};

const UNSUPPORTED = appError('mic-unsupported').message;

/**
 * Microphone capture for the speaking module. Recordings stay in memory as blob URLs:
 * they are never uploaded or written to disk, and so do not survive a reload.
 */
export const useRecorder = ({ onRecorded }: RecorderOptions): RecorderState => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [message, setMessage] = useState('');
  const activeRef = useRef<{ stream: MediaStream | null; recorder: MediaRecorder | null }>({
    stream: null,
    recorder: null
  });

  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    typeof window !== 'undefined' &&
    'MediaRecorder' in window;

  useEffect(
    () => () => {
      const { stream, recorder } = activeRef.current;
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      stream?.getTracks().forEach(track => {
        track.stop();
      });
    },
    []
  );

  const start = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = event => chunks.push(event.data);
      recorder.onstop = () => {
        onRecorded(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })));
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStatus('done');
        setMessage('recorded ✓ — listen below');
      };

      recorder.start();
      activeRef.current = { stream, recorder };
      setStatus('recording');
      setMessage('recording…');
    } catch (error) {
      const failure = micError(error);
      logger.warn('recorder', 'Recording could not start', failure);
      setStatus('unavailable');
      setMessage('Microphone not available — practise out loud and rate yourself.');
      toast.error(failure.code === 'mic-denied' ? 'Microphone access is blocked' : 'Microphone unavailable', {
        description: failure.message
      });
    }
  }, [onRecorded]);

  const stop = useCallback(() => {
    const { recorder } = activeRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }, []);

  /* A browser without recording says so up front, not only through a disabled button. */
  return { status, message: supported ? message : UNSUPPORTED, supported, start, stop };
};

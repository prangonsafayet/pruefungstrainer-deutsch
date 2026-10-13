import { useCallback, useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

const FEEDBACK_MS = 1500;

export type CopyStatus = 'idle' | 'copied' | 'failed';

export interface CopyToClipboard {
  readonly status: CopyStatus;
  readonly copy: (text: string) => void;
}

/**
 * Copies text and shows a short "copied" — or "could not copy" — confirmation. The clipboard
 * rejects when the page lacks focus or permission, and is missing outright outside a secure
 * context; both end in the failure state and a toast, never an unhandled rejection.
 */
export const useCopyToClipboard = (): CopyToClipboard => {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    []
  );

  /* "Copied" fades; "failed" stays until the next try, so a screen can keep the text on show
     for the learner to copy by hand, as the toast tells them to. */
  const show = useCallback((next: CopyStatus) => {
    setStatus(next);
    clearTimeout(timerRef.current);
    if (next !== 'copied') return;
    timerRef.current = setTimeout(() => {
      setStatus('idle');
    }, FEEDBACK_MS);
  }, []);

  const copy = useCallback(
    (text: string) => {
      /* Inside `then` so a missing `navigator.clipboard` rejects instead of throwing. */
      Promise.resolve()
        .then(() => navigator.clipboard.writeText(text))
        .then(
          () => {
            show('copied');
          },
          () => {
            show('failed');
            toast.error('Could not copy to the clipboard — select the text and copy it by hand.');
          }
        );
    },
    [show]
  );

  return { status, copy };
};

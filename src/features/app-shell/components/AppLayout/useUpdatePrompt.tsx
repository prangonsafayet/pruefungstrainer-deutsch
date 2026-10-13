import { useEffect } from 'react';

import { toast } from 'sonner';

import { useServiceWorkerUpdate } from '@shared/hooks/useServiceWorkerUpdate.tsx';

/** One toast, however often the effect runs: sonner replaces a toast with the same id. */
export const UPDATE_TOAST_ID = 'app-update';

/**
 * Offers a waiting new version as a toast with a Reload action — never during an exam
 * sitting, where a reload would pull the page from under the candidate. The toast goes away
 * when a sitting starts and comes back when it ends.
 */
export const useUpdatePrompt = (examMode: boolean): void => {
  const { needRefresh, update } = useServiceWorkerUpdate();

  useEffect(() => {
    if (!needRefresh || examMode) return undefined;
    toast('A new version is ready', {
      id: UPDATE_TOAST_ID,
      description: 'Reload to start using it. Your progress is saved.',
      duration: Number.POSITIVE_INFINITY,
      action: {
        label: 'Reload',
        onClick: () => {
          void update();
        }
      }
    });
    /* A sitting starting (or the shell unmounting) takes the offer away again. */
    return () => {
      toast.dismiss(UPDATE_TOAST_ID);
    };
  }, [needRefresh, examMode, update]);
};

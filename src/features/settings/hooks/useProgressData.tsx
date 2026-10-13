import { useCallback } from 'react';

import { toast } from 'sonner';

import { useSync } from '@shared/account-sync/hooks/useSync.tsx';
import { DEFAULT_SETTINGS } from '@shared/config/exam.ts';
import { clearAllRuns } from '@shared/exam-run/lib/runFormats.ts';
import { removeLocal } from '@shared/lib/storage.ts';
import { useProgress } from '@shared/progress-store/hooks/useProgress.tsx';
import { useProgressBackup } from '@shared/progress-store/hooks/useProgressBackup.tsx';
import { RECOVERED_TOAST } from '@shared/progress-store/hooks/useProgressNotices.tsx';
import {
  EMPTY_DATABASE,
  PROGRESS_RECOVERY_KEY,
  releaseDamaged,
  stamp
} from '@shared/progress-store/lib/progressDb.ts';
import { useConfirm } from '@shared/providers/useConfirm.tsx';

import { describeDelete } from '@features/settings/lib/describeDelete.ts';

export interface ProgressDataState {
  /** Writes the whole progress document to a JSON file. */
  readonly exportToFile: () => void;
  /** Replaces the whole progress document from a JSON file. */
  readonly importFromFile: () => void;
  /** Asks first, then empties the document of every trainer. */
  readonly deleteAllProgress: () => Promise<void>;
}

/**
 * The three things that act on the stored document as a whole. They are grouped because the
 * page groups them: the backup pair is the answer to the delete, so both are offered in the
 * same place rather than a browser tab apart.
 */
export const useProgressData = (): ProgressDataState => {
  const { dbRef, replaceLocal } = useProgress();
  const { exportToFile, importFromFile } = useProgressBackup();
  const { user, clearRemote } = useSync();
  const confirm = useConfirm();

  const deleteAllProgress = useCallback(async () => {
    const signedIn = user !== null;
    const confirmed = await confirm({
      title: 'Delete all progress?',
      description: describeDelete(signedIn),
      confirmText: 'Delete all progress',
      destructive: true
    });
    if (!confirmed) return;

    const empty = stamp({ ...EMPTY_DATABASE, settings: DEFAULT_SETTINGS });

    /* The cloud copy first: if it cannot be cleared, nothing is deleted, so the next sync cannot
       merge the old copy back into an emptied browser behind the learner's back. The browser
       cannot remove the row (no delete policy), so it is overwritten with this same document. */
    if (signedIn) {
      const cleared = await clearRemote(empty);
      if (!cleared.ok) {
        /* The write may have landed even though the clear failed (a lost response, a failed
           read-back). The cleared row would then be the newer side, and the next merge would
           take its default settings. Re-stamping makes this browser newer: the debounced push
           puts the whole document back, which is what the message promises. */
        replaceLocal(stamp(dbRef.current));
        toast.error('Nothing was deleted in this browser', { description: cleared.error.message });
        return;
      }
    }

    /* The run in progress is stored under its own key, so emptying the document left a
       half-finished attempt — answers and typed text included — behind it. */
    clearAllRuns();
    /* So is a damaged document once set aside for download: "everything in this browser" goes. */
    removeLocal(PROGRESS_RECOVERY_KEY);
    /* A damaged document that could not be set aside holds every write back; deleting is the
       learner discarding it, so release the hold — or the empty document is refused, the
       damaged text stays, and the "deleted" data is back on reload. Only after the cloud clear
       succeeded: a failed clear returns above with the hold intact. */
    releaseDamaged();
    toast.dismiss(RECOVERED_TOAST);
    replaceLocal(empty);

    toast.success(
      'All progress deleted.',
      signedIn
        ? {
            description:
              'The cloud copy is cleared too. Other signed-in devices keep their own copy until you delete there too.'
          }
        : {}
    );
  }, [confirm, dbRef, replaceLocal, user, clearRemote]);

  return { exportToFile, importFromFile, deleteAllProgress };
};

import { useCallback } from 'react';

import { toast } from 'sonner';

import { toAppError, tryCatchAsync } from '@shared/lib/appError.ts';
import { downloadText } from '@shared/lib/download.ts';
import { logger } from '@shared/lib/logger.ts';
import { describeImport, readBackup } from '@shared/progress-store/lib/importProgress.ts';
import { stamp } from '@shared/progress-store/lib/progressDb.ts';
import { useConfirm } from '@shared/providers/useConfirm.tsx';

import { useProgress } from './useProgress.tsx';
import { BACKUP_FILENAME } from './useProgressNotices.tsx';

export interface ProgressBackup {
  readonly exportToFile: () => void;
  readonly importFromFile: () => void;
}

/**
 * Export and import of the whole progress document, for backup or moving between
 * browsers. It belongs to the progress-store feature because the document does: both Settings and
 * a trainer's History offer the pair, and neither owns the file format.
 * The file input is created on demand rather than rendered hidden: a hidden
 * input is still reachable by assistive technology, and a ref would have to cross the
 * hook boundary for no benefit.
 */
export const useProgressBackup = (): ProgressBackup => {
  const { db, dbRef, replaceLocal } = useProgress();
  const confirm = useConfirm();

  const exportToFile = useCallback(() => {
    downloadText(BACKUP_FILENAME, JSON.stringify(db, null, 2));
    toast.success('Progress exported.');
  }, [db]);

  const importFromFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';

    input.addEventListener('change', () => {
      void (async () => {
        const file = input.files?.[0];
        if (!file) return;

        const text = await tryCatchAsync(() => file.text());
        /* Read against the live document, not a render's closure: what the file leaves alone
           has to be this browser's current progress. */
        const read = text.ok ? readBackup(text.value, dbRef.current) : text;
        if (!read.ok) {
          logger.warn('import', 'Backup refused', read.error);
          toast.error('Nothing was imported', { description: read.error.message });
          return;
        }
        const plan = read.value;

        /* Asked before anything is written: an import replaces stored work, cannot be
           undone, and — once signed in — reaches the cloud and every other device. */
        const confirmed = await confirm({
          title: 'Import this backup?',
          description: describeImport(plan),
          confirmText: 'Import the backup',
          destructive: true
        });
        if (!confirmed) return;

        replaceLocal(stamp(plan.database));
        toast.success('Progress imported.');
      })().catch((error: unknown) => {
        logger.error('import', 'Import failed', toAppError(error));
        toast.error('Nothing was imported', { description: toAppError(error).message });
      });
    });

    input.click();
  }, [dbRef, replaceLocal, confirm]);

  return { exportToFile, importFromFile };
};

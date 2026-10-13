import { useEffect, type RefObject } from 'react';

import { toast } from 'sonner';

import { downloadText } from '@shared/lib/download.ts';
import { subscribeToStorageFailures } from '@shared/lib/storage.ts';
import {
  persistDatabase,
  releaseDamaged,
  type LoadedProgress
} from '@shared/progress-store/lib/progressDb.ts';
import { type ProgressDatabase } from '@shared/types/progress.ts';

/** Fixed ids: StrictMode mounts twice and every failed write reports, but one notice shows. */
export const RECOVERED_TOAST = 'progress-recovered';
const STORAGE_TOAST = 'storage-failure';

export const DAMAGED_FILENAME = 'telc-trainer-damaged-progress.txt';
export const BACKUP_FILENAME = 'telc-trainer-progress.json';

/**
 * The things about the stored document a learner has to hear about: it could not be read
 * on load (so the app started fresh and set the original aside), or it can no longer be
 * written (full or blocked storage). Each notice carries the one action that saves the data.
 */
export const useProgressNotices = (
  { damaged, setAside }: LoadedProgress,
  dbRef: RefObject<ProgressDatabase>
): void => {
  useEffect(() => {
    if (damaged === null) return;
    const downloadDamaged = (): void => {
      downloadText(DAMAGED_FILENAME, damaged, 'text/plain');
    };
    if (setAside) {
      toast.warning('Your saved progress could not be read', {
        id: RECOVERED_TOAST,
        description:
          'The trainer started fresh so you can keep working. The damaged copy is kept in this browser — download it and keep it safe.',
        duration: Infinity,
        action: { label: 'Download the damaged data', onClick: downloadDamaged }
      });
      return;
    }
    /* The copy could not be kept (storage full): the damaged original is still on disk and
       nothing writes over it until the learner chooses. Either choice releases the hold and
       saves what they have done since. */
    const release = (): void => {
      releaseDamaged();
      persistDatabase(dbRef.current);
    };
    toast.error('Your saved progress could not be read — download it now', {
      id: RECOVERED_TOAST,
      description:
        'There was no room to keep a copy, so the damaged data is still where it was. Download it, or discard it and start fresh. Until you choose, new progress is kept only in this tab.',
      duration: Infinity,
      dismissible: false,
      action: {
        label: 'Download the damaged data',
        onClick: () => {
          downloadDamaged();
          release();
        }
      },
      cancel: { label: 'Discard it and start fresh', onClick: release }
    });
  }, [damaged, setAside, dbRef]);

  useEffect(
    () =>
      subscribeToStorageFailures(error => {
        toast.error(error.code === 'storage-full' ? 'Storage is full' : 'Progress is not being saved', {
          id: STORAGE_TOAST,
          description: error.message,
          duration: Infinity,
          action: {
            label: 'Export a backup',
            onClick: () => {
              downloadText(BACKUP_FILENAME, JSON.stringify(dbRef.current, null, 2));
            }
          }
        });
      }),
    [dbRef]
  );
};

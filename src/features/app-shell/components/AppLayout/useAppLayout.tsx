import { useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { useCloudSync } from '@shared/account-sync/hooks/useCloudSync.tsx';
import { stopSpeech } from '@shared/lib/speech.ts';
import { useProgress } from '@shared/progress-store/hooks/useProgress.tsx';
import { useTrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';

import { useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';

import { isExamRunPath } from './examMode.ts';
import { isSyncOffline } from './syncStatus.ts';
import { useHeaderHeight } from './useHeaderHeight.tsx';
import { usePageFocus } from './usePageFocus.tsx';

/**
 * Everything the app layout needs that is not markup: the cloud-sync state it puts on the
 * context, the header's measured height, the active trainer and its exam date, whether an
 * exam sitting is on screen — and the reset every navigation gets.
 */
export const useAppLayout = () => {
  const { db, dbRef, replaceLocal } = useProgress();
  const sync = useCloudSync({ dbRef, replaceLocal, updatedAt: db._updatedAt });
  const { pathname } = useLocation();
  const headerRef = useHeaderHeight<HTMLElement>();
  const mainRef = useRef<HTMLElement | null>(null);

  /* The header follows the active trainer: name, countdown and nav all switch with it. */
  const { trainer, home } = useActiveTrainer();
  const { settings } = useTrainerSlice(trainer.id);

  /* Every navigation starts at the top and with the speaker silent. */
  useEffect(() => {
    stopSpeech();
    window.scrollTo(0, 0);
  }, [pathname]);

  usePageFocus(pathname, mainRef, trainer.name);

  return {
    sync,
    offline: isSyncOffline(sync.chip),
    pathname,
    headerRef,
    mainRef,
    trainer,
    home,
    examDate: settings.examDate,
    examMode: isExamRunPath(pathname)
  };
};

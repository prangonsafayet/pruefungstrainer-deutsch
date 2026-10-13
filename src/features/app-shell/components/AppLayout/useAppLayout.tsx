import { useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { useCloudSync } from '@shared/account-sync/hooks/useCloudSync.tsx';
import { isExamRunPath } from '@shared/exam-run/lib/examMode.ts';
import { stopSpeech } from '@shared/lib/speech.ts';
import { useProgress } from '@shared/progress-store/hooks/useProgress.tsx';
import { useTrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';

import { useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';

import { isSyncOffline } from './syncStatus.ts';
import { useHeaderHeight } from './useHeaderHeight.tsx';
import { useOnline } from './useOnline.tsx';
import { usePageFocus } from './usePageFocus.tsx';
import { useUpdatePrompt } from './useUpdatePrompt.tsx';

/**
 * Everything the app layout needs that is not markup: the cloud-sync state it puts on the
 * context, the header's measured height, the active trainer and its exam date, whether an
 * exam sitting is on screen, whether the device is offline — and the reset every navigation
 * gets. It also offers a waiting new version, outside exam sittings.
 */
export const useAppLayout = () => {
  const { db, dbRef, replaceLocal } = useProgress();
  const sync = useCloudSync({ dbRef, replaceLocal, updatedAt: db._updatedAt });
  const { pathname, hash } = useLocation();
  const headerRef = useHeaderHeight<HTMLElement>();
  const mainRef = useRef<HTMLElement | null>(null);

  /* The header follows the active trainer: name, countdown and nav all switch with it. */
  const { trainer, home } = useActiveTrainer();
  const { settings } = useTrainerSlice(trainer.id);

  /* Every navigation starts at the top and with the speaker silent — except at a `#section`:
     this effect runs after the page's own, so it used to cancel the guide's hash scroll. */
  useEffect(() => {
    stopSpeech();
    if (!hash) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- per page, not per in-page anchor (the skip link changes the hash mid-exam)
  }, [pathname]);

  usePageFocus(pathname, mainRef, trainer.name);

  const examMode = isExamRunPath(pathname);
  useUpdatePrompt(examMode);
  const online = useOnline();

  return {
    sync,
    /* The browser's own signal, or a sync that failed for want of a network. */
    offline: !online || isSyncOffline(sync.chip),
    pathname,
    headerRef,
    mainRef,
    trainer,
    home,
    examDate: settings.examDate,
    examMode
  };
};

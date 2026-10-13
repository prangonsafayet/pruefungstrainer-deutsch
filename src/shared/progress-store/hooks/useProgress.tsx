import { useContext } from 'react';

import {
  ProgressContext,
  type ProgressContextValue
} from '@shared/progress-store/providers/ProgressProvider.tsx';
import { type Settings } from '@shared/types/progress.ts';

export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used inside <ProgressProvider>');
  return context;
};

export const useSettings = (): Settings => useProgress().db.settings;

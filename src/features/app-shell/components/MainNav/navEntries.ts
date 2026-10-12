import {
  BookOpen,
  GraduationCap,
  History,
  Layers,
  LayoutDashboard,
  Settings2,
  type LucideIcon
} from 'lucide-react';

import { hasGuide, TRAINER_ORDER, TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { recordFrom } from '@shared/lib/records.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

export interface NavEntry {
  readonly to: string;
  readonly label: string;
  readonly icon: LucideIcon;
  /** `end` on a base path, so the dashboard tab is not active on every child route. */
  readonly exact: boolean;
}

/**
 * The active trainer's tabs, generated from its descriptor: it gets a Guide tab if it ships
 * a guide, and Settings is shared by every trainer. Nothing here names a trainer.
 */
const entriesFor = (trainer: TrainerId): readonly NavEntry[] => {
  const base = TRAINERS[trainer].basePath;
  return [
    { to: trainerHome(trainer), label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: `${base}/learn`, label: 'Learn', icon: GraduationCap, exact: false },
    ...(hasGuide(trainer)
      ? [{ to: `${base}/guide`, label: 'Exam Guide', icon: BookOpen, exact: false }]
      : []),
    { to: `${base}/practice`, label: 'Practice', icon: Layers, exact: false },
    { to: `${base}/history`, label: 'History', icon: History, exact: false },
    { to: '/settings', label: 'Settings', icon: Settings2, exact: false }
  ];
};

/** Every trainer's main-nav tabs, keyed by trainer. */
export const NAV_ENTRIES = recordFrom(TRAINER_ORDER, entriesFor);

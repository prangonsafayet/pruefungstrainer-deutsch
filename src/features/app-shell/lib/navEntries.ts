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
  /** A daily tab, kept in the phone tab bar; the rest (reference, settings) go behind "More". */
  readonly daily: boolean;
}

/**
 * The active trainer's tabs, generated from its descriptor: it gets a Guide tab if it ships
 * a guide, and Settings is shared by every trainer. Nothing here names a trainer.
 */
const entriesFor = (trainer: TrainerId): readonly NavEntry[] => {
  const base = TRAINERS[trainer].basePath;
  return [
    { to: trainerHome(trainer), label: 'Dashboard', icon: LayoutDashboard, exact: true, daily: true },
    { to: `${base}/learn`, label: 'Learn', icon: GraduationCap, exact: false, daily: true },
    ...(hasGuide(trainer)
      ? [{ to: `${base}/guide`, label: 'Exam Guide', icon: BookOpen, exact: false, daily: false }]
      : []),
    { to: `${base}/practice`, label: 'Practice', icon: Layers, exact: false, daily: true },
    { to: `${base}/history`, label: 'History', icon: History, exact: false, daily: true },
    { to: '/settings', label: 'Settings', icon: Settings2, exact: false, daily: false }
  ];
};

/** Every trainer's main-nav tabs, keyed by trainer. */
export const NAV_ENTRIES = recordFrom(TRAINER_ORDER, entriesFor);

/** The phone tab bar holds at most this many slots, "More" included (MASTER: ≤ 5). */
export const TAB_BAR_SLOTS = 5;

export interface TabBarSplit {
  /** Tabs shown directly in the bar. */
  readonly tabs: readonly NavEntry[];
  /** Tabs behind the "More" slot; empty when every tab fits. */
  readonly more: readonly NavEntry[];
  /** Whether the current page is one of the tabs behind "More", so that slot reads as current. */
  readonly moreActive: boolean;
}

/**
 * Splits a trainer's tabs for the phone bar: all of them if they fit; otherwise the daily
 * tabs first, up to four, and everything else behind "More" — in nav order both ways.
 */
export const splitTabBar = (entries: readonly NavEntry[], pathname: string): TabBarSplit => {
  const fits = entries.length <= TAB_BAR_SLOTS;
  const ranked = [...entries.filter(entry => entry.daily), ...entries.filter(entry => !entry.daily)];
  const tabs = fits ? entries : ranked.slice(0, TAB_BAR_SLOTS - 1);
  const more = entries.filter(entry => !tabs.includes(entry));
  return {
    tabs,
    more,
    moreActive: more.some(({ to }) => pathname === to || pathname.startsWith(`${to}/`))
  };
};

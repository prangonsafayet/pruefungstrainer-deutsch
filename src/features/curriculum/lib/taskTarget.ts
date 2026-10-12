/** Turns a curriculum task's target into what its "Go to …" affordance does and says. */

import { MODULE_META } from '@shared/config/exam.ts';
import { CATEGORY_META } from '@shared/config/studyCategories.ts';
import { type Cheatsheet, type LearnTaskTarget } from '@shared/types/learn.ts';

export type ResolvedTaskTarget =
  /** A route in this trainer, opened with a router link. */
  | { readonly kind: 'link'; readonly to: string; readonly label: string }
  /** One of this trainer's cheatsheets, opened beside the plan rather than navigated to. */
  | { readonly kind: 'cheatsheet'; readonly id: string; readonly label: string };

/**
 * `basePath` is the trainer's route namespace ('' for the root trainer). The label names the
 * destination in words, so the link reads as "Go to Lesen Teil 1 · Modelltest 1" on its own.
 */
export const resolveTaskTarget = (
  target: LearnTaskTarget,
  basePath: string,
  cheatsheets: Readonly<Record<string, Cheatsheet>>
): ResolvedTaskTarget => {
  switch (target.kind) {
    case 'module': {
      const teil = target.teil === undefined ? '' : ` Teil ${target.teil}`;
      return {
        kind: 'link',
        to: `${basePath}/exam/${String(target.exam)}/${target.module}`,
        label: `${MODULE_META[target.module].short}${teil} · Modelltest ${String(target.exam)}`
      };
    }
    case 'practice':
      return target.tab === 'tables'
        ? { kind: 'link', to: `${basePath}/practice?tab=tables`, label: 'Reference tables' }
        : { kind: 'link', to: `${basePath}/practice`, label: 'Practice hub' };
    case 'quiz':
      return {
        kind: 'link',
        to: `${basePath}/practice?tab=quiz&category=${target.category}`,
        label: `Quiz · ${CATEGORY_META[target.category].label}`
      };
    case 'guide':
      return { kind: 'link', to: `${basePath}/guide#${target.anchor}`, label: 'Exam Guide' };
    case 'cheatsheet':
      return { kind: 'cheatsheet', id: target.id, label: cheatsheets[target.id]?.title ?? target.id };
    default:
      return unreachableTarget(target);
  }
};

const unreachableTarget = (target: never): never => {
  throw new Error(`Unknown task target: ${JSON.stringify(target)}`);
};

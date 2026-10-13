/** The 28-day study plan authored in `src/content/<id>/curriculum.ts`. */

import { type ExamModule } from './exam.ts';
import { type StudyCategory } from './vocab.ts';

export interface LearnAiPrompt {
  /** Short title, e.g. "Error debrief". */
  readonly t: string;
  /** The prompt body, offered as copy-to-clipboard. Plain text. */
  readonly p: string;
  /** This prompt's language, where it differs from the plan's `aiPromptLang`. */
  readonly lang?: AiPromptLang;
}

/** The language an AI prompt is written in — said on the page so a screen reader voices it right. */
export type AiPromptLang = 'en' | 'de';

/**
 * Where a curriculum task is done, when the task names one place. Rendered as a "Go to …"
 * link beside the checkbox. A target only labels and links — the runner opens the whole
 * module (`teil` is named in the label, not jumped to).
 */
export type LearnTaskTarget =
  | {
      readonly kind: 'module';
      /** A Modelltest id of the same trainer. */
      readonly exam: number;
      readonly module: ExamModule;
      /** The Teil the task is about, e.g. "1" or "2A" — said in the link label only. */
      readonly teil?: string;
    }
  | { readonly kind: 'practice'; readonly tab?: 'tables' }
  | { readonly kind: 'quiz'; readonly category: StudyCategory }
  /** An anchor id in the trainer's exam guide, without the `#`. */
  | { readonly kind: 'guide'; readonly anchor: string }
  /** A key into `LearnPlan.cheatsheets`; opens the sheet beside the plan. */
  | { readonly kind: 'cheatsheet'; readonly id: string };

/** A task that says where it is done. */
export interface TargetedLearnTask {
  readonly text: string;
  readonly target: LearnTaskTarget;
}

/**
 * One checkbox of a day. A plain string is still the common case; a task may be annotated
 * with a target IN PLACE — its index is its persisted `learnDone` key (`d<day>t<index>`), so
 * tasks are never added, removed or reordered.
 */
export type LearnTask = string | TargetedLearnTask;

export interface LearnDay {
  readonly day: number;
  /**
   * 'core' days (1–14) carry the essential curriculum and are always scheduled,
   * compressed if necessary. 'extension' days (15–28) deepen to full B1 and are
   * only scheduled when the plan has room for them.
   */
  readonly tier: 'core' | 'extension';
  readonly title: string;
  readonly focus: string;
  readonly tasks: readonly LearnTask[];
  /** Keys into `LearnPlan.cheatsheets`. */
  readonly cheats: readonly string[];
  readonly ai: readonly LearnAiPrompt[];
}

export interface Cheatsheet {
  readonly title: string;
  /** Authored HTML, injected into a .prose container. */
  readonly html: string;
}

export interface LearnPlan {
  /** The language its AI prompts are written in; English when absent (the UI's own). */
  readonly aiPromptLang?: AiPromptLang;
  /** Authored HTML (bolds a few phrases), injected rather than rendered as text. */
  readonly intro: string;
  readonly cheatsheets: Readonly<Record<string, Cheatsheet>>;
  readonly days: readonly LearnDay[];
}

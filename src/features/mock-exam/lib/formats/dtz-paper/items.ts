/**
 * Every objectively-marked item of a DTZ paper as one flat list, in exam order: Hören 1–20,
 * Lesen 21–45, numbered the way the Übungssatz numbers them. Scoring, the unanswered count
 * and the review all walk this list, so the three cannot disagree on which key an item
 * reads or what it expects.
 *
 * Answer keys (persisted — never change them): h1.0–3, h2.0–4 a/b/c · h3.0–3 richtig/falsch
 * and h3m.0–3 a/b/c per Gespräch · h4.0–2 sentence a–f · l1.0–4 a/b/c · l2.0–4 ad a–h or
 * `NO_MATCH_ANSWER` · l3.0–2 richtig/falsch and l3m.0–2 a/b/c per text · l4.0–2
 * richtig/falsch · l5.0–5 gap a/b/c.
 */

import { itemKey } from '@shared/lib/answers.ts';
import { type AudioScript, type DtzExam } from '@shared/types';

/** The module an item belongs to. Only the two objectively-marked ones have items. */
export type DtzMarkedModule = 'hoeren' | 'lesen';

export interface DtzItem {
  readonly key: string;
  /** The item's number on the paper, 1–45. */
  readonly number: number;
  readonly teil: number;
  readonly prompt: string;
  /** An option index (a/b/c, a–f, a–h, or `NO_MATCH_ANSWER`), or richtig/falsch. */
  readonly expected: number | boolean;
  /** What the option indices name; null for a richtig/falsch item. */
  readonly options: readonly string[] | null;
  /** Whether this item may be answered X (no matching option). */
  readonly allowsNoMatch: boolean;
  readonly audio?: AudioScript;
}

type Draft = Omit<DtzItem, 'number'>;

const choice = (
  key: string,
  teil: number,
  prompt: string,
  options: readonly string[],
  expected: number,
  audio?: AudioScript
): Draft => ({
  key,
  teil,
  prompt,
  expected,
  options,
  allowsNoMatch: false,
  ...(audio === undefined ? {} : { audio })
});

const truth = (key: string, teil: number, prompt: string, expected: boolean, audio?: AudioScript): Draft => ({
  key,
  teil,
  prompt,
  expected,
  options: null,
  allowsNoMatch: false,
  ...(audio === undefined ? {} : { audio })
});

const hoerenDrafts = ({ hoeren }: DtzExam): readonly Draft[] => [
  ...hoeren.teil1.items.map((item, index) =>
    choice(itemKey('h1.', index), 1, item.frage, item.options, item.answer, item.audio)
  ),
  ...hoeren.teil2.items.map((item, index) =>
    choice(itemKey('h2.', index), 2, item.frage, item.options, item.answer, item.audio)
  ),
  ...hoeren.teil3.gespraeche.flatMap((gespraech, index) => [
    truth(itemKey('h3.', index), 3, gespraech.statement.text, gespraech.statement.answer, gespraech.audio),
    choice(
      itemKey('h3m.', index),
      3,
      gespraech.question.frage,
      gespraech.question.options,
      gespraech.question.answer
    )
  ]),
  ...hoeren.teil4.aussagen.map((aussage, index) =>
    choice(
      itemKey('h4.', index),
      4,
      `Aussage ${String(index + 1)}`,
      hoeren.teil4.sentences,
      aussage.answer,
      aussage.audio
    )
  )
];

const lesenDrafts = ({ lesen }: DtzExam): readonly Draft[] => [
  ...lesen.teil1.questions.map((question, index) =>
    choice(itemKey('l1.', index), 1, question.frage, question.options, question.answer)
  ),
  /* A missing key (the validator refuses one) marks NaN, which no answer equals. */
  ...lesen.teil2.situations.map((situation, index) => ({
    ...choice(itemKey('l2.', index), 2, situation, lesen.teil2.ads, lesen.teil2.answers[index] ?? Number.NaN),
    allowsNoMatch: true
  })),
  ...lesen.teil3.texts.flatMap((text, index) => [
    truth(itemKey('l3.', index), 3, text.statement.text, text.statement.answer),
    choice(itemKey('l3m.', index), 3, text.question.frage, text.question.options, text.question.answer)
  ]),
  ...lesen.teil4.statements.map((statement, index) =>
    truth(itemKey('l4.', index), 4, statement.text, statement.answer)
  ),
  ...lesen.teil5.gaps.map((gap, index) =>
    choice(itemKey('l5.', index), 5, `Lücke ${String(index + 1)}`, gap.options, gap.answer)
  )
];

const numbered = (drafts: readonly Draft[], first: number): readonly DtzItem[] =>
  drafts.map((draft, index) => ({ ...draft, number: first + index }));

/** The items of one marked module, numbered as on the paper (Lesen continues after Hören). */
export const dtzItems = (exam: DtzExam, module: DtzMarkedModule): readonly DtzItem[] => {
  const hoeren = hoerenDrafts(exam);
  return module === 'hoeren' ? numbered(hoeren, 1) : numbered(lesenDrafts(exam), hoeren.length + 1);
};

/** Each item's paper number by answer key, for the renderers' item labels. */
export const dtzItemNumbers = (exam: DtzExam): Readonly<Partial<Record<string, number>>> =>
  Object.fromEntries(
    [...dtzItems(exam, 'hoeren'), ...dtzItems(exam, 'lesen')].map(item => [item.key, item.number])
  );

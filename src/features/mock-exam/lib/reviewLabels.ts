/** Labels every paper's review rows share. */

/** A Richtig/Falsch item's value as the review prints it. */
export const richtigFalsch = (value: boolean): string => (value ? 'richtig' : 'falsch');

/** A given Richtig/Falsch answer, or null when the item was left blank. */
export const boolLabel = (value: boolean | undefined): string | null =>
  value == null ? null : richtigFalsch(value);

/** `Teil 2 · 3` — the Teil and the 1-based item within it. */
export const teilLabel = (teil: number, index: number): string =>
  `Teil ${String(teil)} · ${String(index + 1)}`;

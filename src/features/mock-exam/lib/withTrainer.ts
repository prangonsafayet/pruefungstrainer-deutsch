/**
 * "Modelltest 3 · A2 · leicht" plus the trainer, so a tab title says which exam it is — unless
 * the label already ends with it ("Modelltest 3 · B1" on the B1 trainer).
 */
export const withTrainer = (examLabel: string, trainerShort: string): string =>
  examLabel.endsWith(trainerShort) ? examLabel : `${examLabel} · ${trainerShort}`;

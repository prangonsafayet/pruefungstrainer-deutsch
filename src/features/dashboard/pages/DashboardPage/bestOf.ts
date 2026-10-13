/** The highest of the scores that exist, or null when none does. */
export const bestOf = (values: readonly (number | null | undefined)[]): number | null => {
  const scored = values.filter((value): value is number => typeof value === 'number');
  return scored.length > 0 ? Math.max(...scored) : null;
};

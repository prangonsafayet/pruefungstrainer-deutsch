/**
 * The fill class of a score bar. A status bar (results) is green at or above its pass line,
 * amber from 40% and red below — MASTER: "Green/amber/red carry status only". A bar that
 * carries no status (dashboard averages) stays in the primary brand colour.
 */
export const meterTone = (pct: number, thresholdPercent: number, colorByScore: boolean): string => {
  if (!colorByScore) return 'bg-primary';
  if (pct >= thresholdPercent) return 'bg-success';
  return pct >= 40 ? 'bg-warning-foreground' : 'bg-destructive';
};

import { describe, expect, it } from 'vitest';

import { meterTone } from '@shared/components/data-display/ScoreMeter/meterTone.ts';

/* Regression: a results bar at or above its pass line was filled with the brand primary,
   not the success green — status colours are green/amber/red only (MASTER). */
describe('meterTone', () => {
  it.each([
    [60, 60, 'bg-success'],
    [100, 60, 'bg-success'],
    [70, 70, 'bg-success'],
    [69, 70, 'bg-warning-foreground'],
    [40, 60, 'bg-warning-foreground'],
    [39, 60, 'bg-destructive'],
    [0, 60, 'bg-destructive']
  ])('a status bar at %i%% against a %i%% pass line is %s', (pct, line, tone) => {
    expect(meterTone(pct, line, true)).toBe(tone);
  });

  it('a bar that carries no status stays primary at any score', () => {
    for (const pct of [0, 39, 60, 100]) expect(meterTone(pct, 60, false)).toBe('bg-primary');
  });
});

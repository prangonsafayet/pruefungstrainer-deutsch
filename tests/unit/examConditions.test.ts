import { describe, expect, it } from 'vitest';

import {
  DEFAULT_PLAYS_ALLOWED,
  PASS_PERCENT,
  PASS_RULES,
  passLineLabel,
  PLAYS_ALLOWED_CHOICES,
  PLAYS_ALLOWED_HINTS,
  WRITING_MINUTE_CHOICES,
  writingTimeHint
} from '@shared/config/examConditions.ts';

/* Which of these numbers telc publishes and which are the app's own is not a detail: this
   branch shipped five invented telc facts into twenty papers, two guides, two curricula and
   the validator. `docs/level-trainers.local.md` records that the single-level paper's
   Uebungstests publish only its weighting table — no per-part pass percentage — and give no
   A2·B1 Schreiben duration. Both figures still drive the app; the copy around them may not
   call them telc's. Prose is unreviewed by the type system, so it is asserted here. */

describe('the pass line the single-level paper is marked at', () => {
  it('still marks at 60%, unchanged', () => {
    expect(PASS_PERCENT['single-level']).toBe(60);
    expect(PASS_PERCENT['dual-level']).toBe(70);
  });

  it('names the trainer as the source of the 60%, not telc', () => {
    const rule = PASS_RULES['single-level'];
    expect(rule).toContain('135/225');
    expect(rule).toContain('this trainer');
    expect(rule.toLowerCase()).not.toContain('official');
    expect(rule.toLowerCase()).not.toContain('pass rule');
  });

  it('leaves the A2·B1 rule stating the thresholds telc publishes for it', () => {
    expect(PASS_RULES['dual-level']).toContain('168/240');
  });
});

describe('the writing-time hint', () => {
  it('calls the single-level paper 30 minutes official, because telc publishes it', () => {
    expect(writingTimeHint('single-level', 30)).toBe('Official: 30 minutes.');
  });

  it('does not call the A2·B1 Schreiben slot official, because no source gives it', () => {
    const hint = writingTimeHint('dual-level', 10);
    expect(hint).toContain('10 minutes');
    expect(hint.toLowerCase()).not.toContain('official');
  });

  it('says the same in the choice labels', () => {
    const labels = WRITING_MINUTE_CHOICES['dual-level'].map(choice => choice.label.toLowerCase());
    expect(labels.some(label => label.includes('official'))).toBe(false);
    expect(WRITING_MINUTE_CHOICES['single-level'][0]?.label).toContain('official');
  });
});

/* The DTZ source (docs/dtz-format.local.md) states the written exam's 30 minutes of Schreiben
   but NOT how often a Hören text plays. So the writing time may be called official and no
   play count may be — the default of two is this trainer's choice and must say so. */
describe('the DTZ exam conditions', () => {
  it('calls its 30-minute Schreiben official, because the Übungssatz states it', () => {
    expect(writingTimeHint('dtz-paper', 30)).toBe('Official: 30 minutes.');
    expect(WRITING_MINUTE_CHOICES['dtz-paper'][0]).toEqual({ value: 30, label: '30 minutes (official)' });
  });

  it('never calls a play count official', () => {
    for (const choice of PLAYS_ALLOWED_CHOICES['dtz-paper']) {
      expect(choice.label.toLowerCase()).not.toContain('official');
    }
    expect(PLAYS_ALLOWED_HINTS['dtz-paper'].toLowerCase()).not.toContain('official');
    expect(PLAYS_ALLOWED_HINTS['dtz-paper']).toContain("this trainer's choice");
    expect(PLAYS_ALLOWED_HINTS['dtz-paper']).not.toMatch(/once|twice/);
  });

  it("labels the default it plays at as the trainer's own", () => {
    const fallback = PLAYS_ALLOWED_CHOICES['dtz-paper'].find(
      choice => choice.value === DEFAULT_PLAYS_ALLOWED['dtz-paper']
    );
    expect(fallback?.label).toContain("this trainer's default");
  });

  it('states the certificate rule with the spec lines', () => {
    const rule = PASS_RULES['dtz-paper'];
    for (const figure of ['75/100', '33/45', '15/20', '≥ 35', '≥ 20', '≥ 7']) expect(rule).toContain(figure);
    expect(passLineLabel('dtz-paper')).toBe('B1 line (75%)');
  });
});

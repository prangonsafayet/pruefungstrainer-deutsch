import { describe, expect, it } from 'vitest';

import { type DtzAttempt, type DualLevelAttempt, type SingleLevelAttempt } from '@shared/types';

import { summarizeAttempt as summarizeDtz } from '@features/mock-exam/lib/formats/dtz-paper/summary.ts';
import { summarizeAttempt as summarizeDualLevel } from '@features/mock-exam/lib/formats/dual-level/summary.ts';
import { summarizeAttempt as summarizeSingleLevel } from '@features/mock-exam/lib/formats/single-level/summary.ts';

/*
 * The results screen marks a pass line on every score bar, and the bar primitive used to
 * default that line to the A2·B1 paper's 70% because nothing carried it. A single-level
 * sitting therefore showed "B1 threshold (70%)" over sections whose pass line is 60%, and
 * tinted a passing section red. The summary now names the line, so both papers are asserted
 * here.
 */

const dualLevelAttempt: DualLevelAttempt = {
  id: 1,
  examId: 1,
  mode: 'full',
  date: '2026-01-01T00:00:00.000Z',
  times: { lesen: 60 },
  scores: { lesen: 42, hoeren: 42, schreiben: 42, sprechen: 42 },
  sb: { correct: 15, of: 22, percent: 68 },
  answers: {},
  ratings: {},
  total: 168,
  result: 'B1'
};

const singleLevelAttempt: SingleLevelAttempt = {
  id: 2,
  examId: 1,
  mode: 'full',
  date: '2026-01-01T00:00:00.000Z',
  times: { lesen: 60 },
  scores: { lesen: 45, sprachbausteine: 18, hoeren: 45, schreiben: 27, sprechen: 45 },
  answers: {},
  ratings: {},
  written: 135,
  oral: 45,
  total: 180,
  result: 'Bestanden'
};

describe('summarizeAttempt — the pass line the score bars mark', () => {
  it('marks the A2·B1 paper at its own 70% B1 line', () => {
    const summary = summarizeDualLevel(dualLevelAttempt);
    expect(summary.thresholdPercent).toBe(70);
    expect(summary.thresholdLabel).toBe('B1 threshold (70%)');
  });

  it('marks the telc B1/B2 paper at its own 60% pass line, not the A2·B1 one', () => {
    const summary = summarizeSingleLevel(singleLevelAttempt);
    expect(summary.thresholdPercent).toBe(60);
    expect(summary.thresholdLabel).toBe('Pass line (60%)');
  });

  it('scores every section of a single-level sitting at or above its own line', () => {
    const summary = summarizeSingleLevel(singleLevelAttempt);
    expect(summary.bars.length).toBe(5);
    for (const bar of summary.bars) {
      expect(Math.round((bar.value / bar.of) * 100)).toBeGreaterThanOrEqual(summary.thresholdPercent);
    }
  });
});

/* A DTZ attempt with Hören + Lesen 30/45 (A2), Schreiben 14/20 (A2: one below the B1 line)
   and Sprechen 80/100 (B1). Neither written part reaches B1, so the certificate is A2 — a
   fixture where a summed or averaged verdict would say otherwise. */
const dtzAttempt: DtzAttempt = {
  id: 3,
  examId: 1,
  mode: 'full',
  date: '2026-01-01T00:00:00.000Z',
  times: { hoeren: 60 },
  scores: { hoeren: 12, lesen: 18, schreiben: 14, sprechen: 80 },
  answers: {},
  ratings: { schreiben: 14, sprechen: 80 },
  result: 'Zertifikat A2'
};

describe('summarizeAttempt — the DTZ paper', () => {
  const summary = summarizeDtz(dtzAttempt);

  it('shows the certificate, not a points total', () => {
    expect(summary.grade?.label).toBe('Zertifikat A2');
    expect(summary.grade?.tone).toBe('warning');
    expect(summary.grade?.points).toBeNull();
  });

  it('notes the three Teilergebnisse with their levels and lines, then the rule', () => {
    expect(summary.grade?.notes).toEqual([
      'Hören + Lesen: 30/45 → A2 (B1 ab 33, A2 ab 20)',
      'Schreiben: 14/20 → A2 (B1 ab 15, A2 ab 7)',
      'Sprechen: 80/100 → B1 (B1 ab 75, A2 ab 35)',
      expect.stringContaining('Zertifikat B1')
    ]);
  });

  it("marks each bar at its own part's line, Hören + Lesen at 33 of 45", () => {
    const line = (label: string) => summary.bars.find(bar => bar.label === label)?.thresholdPercent;
    expect(summary.bars.map(bar => bar.label)).toEqual([
      'Hören',
      'Lesen',
      'Hören + Lesen',
      'Schreiben (self)',
      'Sprechen (self)'
    ]);
    expect(line('Hören + Lesen')).toBeCloseTo((33 / 45) * 100);
    expect(line('Schreiben (self)')).toBe(75);
    expect(line('Sprechen (self)')).toBe(75);
    /* Hören alone has no official line: its mark is labelled as this trainer's target. */
    expect(summary.bars[0]?.thresholdLabel).toContain("this trainer's target");
  });
});

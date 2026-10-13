import { describe, expect, it } from 'vitest';

import { type DtzAttempt } from '@shared/types/dtzExam.ts';
import { type DualLevelAttempt } from '@shared/types/progress.ts';
import { type SingleLevelAttempt } from '@shared/types/singleLevelExam.ts';

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

/*
 * What the card leads with and how it is tinted, per paper and per outcome: a full sitting
 * takes the verdict's colour, a practice run the neutral primary and no grade, and the
 * headline is the first score the attempt actually has — never a stale or invented one.
 */

/** A practice run: the attempt as changed, without the verdict only a full sitting stores. */
const practice = <T extends object>(attempt: T, changes: Partial<T>): T => {
  const copy = { ...attempt, ...changes };
  for (const key of ['total', 'result', 'written', 'oral']) Reflect.deleteProperty(copy, key);
  return copy;
};

describe('summarizeAttempt — accent, headline and practice runs', () => {
  it.each([
    ['B1', 'var(--success)', 'success'],
    ['A2', 'var(--warning)', 'warning'],
    ['Nicht bestanden', 'var(--destructive)', 'destructive']
  ] as const)('A2·B1 %s is tinted %s', (result, accent, tone) => {
    const summary = summarizeDualLevel({ ...dualLevelAttempt, result });
    expect(summary.accentColor).toBe(accent);
    expect(summary.grade).toMatchObject({ label: result, tone, points: { total: 168, of: 240 } });
    expect(summary.headlineScore).toBe('42');
    expect(summary.headlineSuffix).toBe('/60');
    expect(summary.totalSeconds).toBe(60);
  });

  it('an A2·B1 Sprachbausteine-only practice leads with its percentage and has no grade', () => {
    const summary = summarizeDualLevel(
      practice(dualLevelAttempt, { mode: 'sprachbausteine', scores: {}, times: {} })
    );
    expect(summary).toMatchObject({
      accentColor: 'var(--primary)',
      grade: null,
      headlineScore: '68%',
      headlineSuffix: ''
    });
    expect(summary.bars.map(bar => bar.label)).toEqual(['Sprachbausteine']);
    expect(summary.totalSeconds).toBe(0);
  });

  it('an A2·B1 practice with no score at all shows a dash', () => {
    const summary = summarizeDualLevel({ ...dualLevelAttempt, mode: 'lesen', scores: {}, sb: null });
    expect(summary.headlineScore).toBe('–');
    expect(summary.grade).toBeNull();
  });

  it('a failed single-level sitting is red, with both written and oral in the note', () => {
    const summary = summarizeSingleLevel({
      ...singleLevelAttempt,
      result: 'Nicht bestanden',
      written: 120,
      oral: 30
    });
    expect(summary.accentColor).toBe('var(--destructive)');
    expect(summary.grade?.tone).toBe('destructive');
    expect(summary.grade?.notes[0]).toMatch(/^Written: 120\/225 \(pass ≥ 135\) · Oral: 30\/75 \(pass ≥ 45\)/);
    expect(summarizeSingleLevel(singleLevelAttempt).accentColor).toBe('var(--success)');
  });

  it('a single-level practice run is neutral, ungraded and leads with its one section', () => {
    const summary = summarizeSingleLevel(
      practice(singleLevelAttempt, { mode: 'hoeren', scores: { hoeren: 50 } })
    );
    expect(summary).toMatchObject({
      accentColor: 'var(--primary)',
      grade: null,
      headlineScore: '50',
      headlineSuffix: '/75'
    });
    const empty = summarizeSingleLevel({ ...singleLevelAttempt, mode: 'lesen', scores: {} });
    expect(empty.headlineScore).toBe('–');
    expect(empty.headlineSuffix).toBe('');
  });

  it.each([
    ['Zertifikat B1', 'var(--success)'],
    ['Zertifikat A2', 'var(--warning)'],
    ['unter A2', 'var(--destructive)']
  ] as const)('DTZ %s is tinted %s', (result, accent) => {
    expect(summarizeDtz({ ...dtzAttempt, result }).accentColor).toBe(accent);
  });

  it('a DTZ practice run has no Hören + Lesen bar unless both parts were sat, and no grade', () => {
    const summary = summarizeDtz(practice(dtzAttempt, { mode: 'schreiben', scores: { schreiben: 9 } }));
    expect(summary.bars.map(bar => bar.label)).toEqual(['Schreiben (self)']);
    expect(summary).toMatchObject({
      accentColor: 'var(--primary)',
      grade: null,
      headlineScore: '9',
      headlineSuffix: '/20'
    });
    const blank = summarizeDtz(practice(dtzAttempt, { mode: 'lesen', scores: {} }));
    expect(blank.headlineScore).toBe('–');
  });
});

import { describe, expect, it } from 'vitest';

import { buildScoreChart, describeGridlines, summarizeScoreChart } from '@shared/lib/scoreChart.ts';
import { type DtzAttempt, type DtzResult } from '@shared/types/dtzExam.ts';
import { type AttemptMode, type ExamGrade } from '@shared/types/exam.ts';
import { type DualLevelAttempt } from '@shared/types/progress.ts';
import { type SingleLevelAttempt, type SingleLevelResult } from '@shared/types/singleLevelExam.ts';

/*
 * The history chart, per paper: which sittings become bars (full and scored only, the last
 * twelve), what each bar's height and colour are, and the one sentence a screen reader hears.
 */

const BASE = { date: '2026-01-01T00:00:00.000Z', times: {}, answers: {}, ratings: {} } as const;

const dual = (id: number, mode: AttemptMode, total?: number, result?: ExamGrade): DualLevelAttempt => ({
  ...BASE,
  id,
  examId: id,
  mode,
  scores: {},
  sb: null,
  ...(total === undefined ? {} : { total }),
  ...(result === undefined ? {} : { result })
});

const single = (id: number, total: number, result: SingleLevelResult): SingleLevelAttempt => ({
  ...BASE,
  id,
  examId: id,
  mode: 'full',
  scores: {},
  total,
  result
});

const dtz = (
  id: number,
  scores: DtzAttempt['scores'],
  result?: DtzResult,
  mode: AttemptMode = 'full'
): DtzAttempt => ({
  ...BASE,
  id,
  examId: id,
  mode,
  scores,
  ...(result === undefined ? {} : { result })
});

describe('buildScoreChart — the A2·B1 paper', () => {
  it('draws full, scored sittings only, coloured by grade, and an unscored grade reads as failed', () => {
    const model = buildScoreChart({
      format: 'dual-level',
      attempts: [
        dual(1, 'full', 200, 'B1'),
        dual(2, 'lesen', 40),
        dual(3, 'full', 130, 'A2'),
        dual(4, 'full'),
        dual(5, 'full', 50)
      ]
    });

    expect(model.max).toBe(240);
    expect(model.bars.map(bar => [bar.id, bar.total, bar.result, bar.color])).toEqual([
      [1, 200, 'B1', 'var(--success)'],
      [3, 130, 'A2', 'var(--warning)'],
      [5, 50, 'Nicht bestanden', 'var(--destructive)']
    ]);
    expect(describeGridlines(model)).toBe('240, 168 · B1, 96 · A2');
  });

  it('keeps only the twelve most recent sittings', () => {
    const attempts = Array.from({ length: 15 }, (_, index) => dual(index + 1, 'full', 100 + index, 'A2'));
    const model = buildScoreChart({ format: 'dual-level', attempts });

    expect(model.bars).toHaveLength(12);
    expect(model.bars[0]?.id).toBe(4);
    expect(model.bars.at(-1)?.id).toBe(15);
  });
});

describe('buildScoreChart — the telc B1/B2 paper', () => {
  it('colours a pass green and anything else red, with one gridline at the lowest pass', () => {
    const model = buildScoreChart({
      format: 'single-level',
      attempts: [single(1, 250, 'Bestanden'), single(2, 260, 'Nicht bestanden')]
    });

    expect(model.bars.map(bar => bar.color)).toEqual(['var(--success)', 'var(--destructive)']);
    expect(model.gridlines.map(line => line.value)).toEqual([180]);
    expect(model.max).toBe(300);
  });
});

describe('buildScoreChart — the DTZ', () => {
  it('draws Hören + Lesen per full sitting with a certificate, coloured by the certificate', () => {
    const model = buildScoreChart({
      format: 'dtz-paper',
      attempts: [
        dtz(1, { hoeren: 18, lesen: 22 }, 'Zertifikat B1'),
        dtz(2, { hoeren: 10, lesen: 12 }, 'Zertifikat A2'),
        dtz(3, { hoeren: 2, lesen: 3 }, 'unter A2'),
        dtz(4, { hoeren: 20 }, undefined, 'hoeren'),
        dtz(5, { sprechen: 90 }, 'Zertifikat A2'),
        dtz(6, { hoeren: 20, lesen: 25 })
      ]
    });

    expect(model.bars.map(bar => [bar.id, bar.total, bar.result, bar.color])).toEqual([
      [1, 40, 'Zertifikat B1', 'var(--success)'],
      [2, 22, 'Zertifikat A2', 'var(--warning)'],
      [3, 5, 'unter A2', 'var(--destructive)'],
      /* A sitting with no Hören + Lesen recorded draws at zero rather than vanishing. */
      [5, 0, 'Zertifikat A2', 'var(--warning)']
    ]);
    expect(describeGridlines(model)).toBe('45, 33 · B1, 20 · A2');
  });
});

describe('summarizeScoreChart', () => {
  it('says there is nothing yet', () => {
    expect(summarizeScoreChart(buildScoreChart({ format: 'dual-level', attempts: [] }))).toBe(
      'Score history: no full exams yet.'
    );
  });

  it('names the count, the latest with its result, the best and the lines', () => {
    const model = buildScoreChart({
      format: 'dual-level',
      attempts: [dual(1, 'full', 200, 'B1'), dual(2, 'full', 130, 'A2')]
    });

    expect(summarizeScoreChart(model)).toBe(
      'Score history: 2 full exams, scored out of 240. Latest: Test 2, 130 of 240 (A2). Best: 200 of 240. Lines at 240, 168 · B1, 96 · A2.'
    );
  });

  it('uses the singular for one sitting and leaves out a missing result', () => {
    const model = buildScoreChart({ format: 'single-level', attempts: [single(7, 190, 'Bestanden')] });
    const withoutResult = { ...model, bars: model.bars.map(bar => ({ ...bar, result: '' })) };

    expect(summarizeScoreChart(model)).toMatch(/^Score history: 1 full exam, /);
    expect(summarizeScoreChart(withoutResult)).toMatch(/Latest: Test 7, 190 of 300\. Best/);
  });
});

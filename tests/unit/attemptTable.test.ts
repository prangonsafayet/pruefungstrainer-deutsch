import { describe, expect, it } from 'vitest';

import { buildAttemptTable } from '@features/attempt-history/lib/attemptRows.ts';
import {
  type DtzAttempt,
  type DualLevelAttempt,
  type ScoredAttempts,
  type SingleLevelAttempt
} from '@shared/types';

/*
 * The attempts table lays out whatever the model hands it, so a mismatch between the header
 * count and the cell count is invisible until a column silently shifts. Both lists used to
 * end in `''` for the Review link — an unnamed `<TableHead>`, i.e. a column with no
 * accessible name — while the component appended that cell itself. The model now names only
 * the data columns and the component appends header and cell together.
 */

const dualLevel: DualLevelAttempt = {
  id: 1,
  examId: 3,
  mode: 'full',
  date: '2026-08-20T10:00:00.000Z',
  times: { lesen: 1200 },
  scores: { lesen: 48, hoeren: 44, schreiben: 40, sprechen: 42 },
  sb: { correct: 8, of: 10, percent: 80 },
  answers: {},
  ratings: {},
  total: 174,
  result: 'B1'
};

const singleLevel: SingleLevelAttempt = {
  id: 2,
  examId: 4,
  mode: 'full',
  date: '2026-08-20T10:00:00.000Z',
  times: { lesen: 1200 },
  scores: { lesen: 60 },
  answers: {},
  ratings: {},
  written: 180,
  oral: 60,
  total: 240,
  result: 'Bestanden'
};

const dtz: DtzAttempt = {
  id: 5,
  examId: 2,
  mode: 'full',
  date: '2026-08-20T10:00:00.000Z',
  times: { hoeren: 1200 },
  scores: { hoeren: 15, lesen: 20, schreiben: 15, sprechen: 75 },
  answers: {},
  ratings: {},
  result: 'Zertifikat B1'
};

const dtzPractice: DtzAttempt = {
  id: 6,
  examId: 2,
  mode: 'hoeren',
  date: '2026-08-21T10:00:00.000Z',
  times: { hoeren: 900 },
  scores: { hoeren: 12 },
  answers: {},
  ratings: {}
};

const SOURCES: readonly ScoredAttempts[] = [
  { format: 'dtz-paper', attempts: [dtz, dtzPractice] },
  { format: 'dual-level', attempts: [dualLevel] },
  { format: 'single-level', attempts: [singleLevel] }
];

describe.each(SOURCES)('the attempts table on the $format paper', source => {
  const model = buildAttemptTable(source, '');

  it('names every column it declares', () => {
    for (const column of model.columns) expect(column.trim()).not.toBe('');
  });

  it('declares exactly one column per cell, so no column can shift', () => {
    for (const row of model.rows) expect(row.cells).toHaveLength(model.columns.length);
  });

  it('leaves the review link out of the column list — the table appends it', () => {
    expect(model.columns).not.toContain('Review');
    for (const row of model.rows) expect(row.reviewTo).toMatch(/\/review\/\d+$/);
  });
});

describe('the attempts table on the DTZ paper', () => {
  const model = buildAttemptTable({ format: 'dtz-paper', attempts: [dtz, dtzPractice] }, '/dtz');

  it('reports the three Teilergebnisse and the certificate, not a total', () => {
    expect(model.columns).toEqual([
      'Date',
      'Test',
      'Mode',
      'Hören + Lesen',
      'Schreiben',
      'Sprechen',
      'Result',
      'Time'
    ]);
    const full = model.rows.find(row => row.id === 5);
    expect(full?.cells.slice(3, 7).map(cell => cell.text)).toEqual([
      '35/45',
      '15/20',
      '75/100',
      'Zertifikat B1'
    ]);
    expect(full?.cells[6]?.badge).toBe('success');
  });

  it('names the one module a practice run sat, out of its own maximum', () => {
    const practice = model.rows.find(row => row.id === 6);
    expect(practice?.cells[3]?.text).toBe('12/20 (Hören)');
    expect(practice?.cells[6]?.text).toBe('practice');
  });
});

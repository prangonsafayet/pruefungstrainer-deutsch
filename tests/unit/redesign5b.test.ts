import { describe, expect, it } from 'vitest';

import { TRAINER_CONTENT } from '@content/trainerContent.ts';

import { PASS_RULE_SUMMARY, PASS_RULES } from '@shared/config/examConditions.ts';
import { examsRampInDifficulty, TRAINER_ORDER } from '@shared/config/trainers.ts';
import { buildScoreChart, summarizeScoreChart } from '@shared/lib/scoreChart.ts';
import { describeMockLead } from '@shared/study-schedule/lib/describeSchedule.ts';
import { type ExamFormatId } from '@shared/types/trainer.ts';

import { resolveTaskTarget } from '@features/curriculum/lib/taskTarget.ts';
import { splitGuide } from '@features/exam-guide/pages/ExamGuidePage/guideParts.ts';

/* Pass 5B: the copy and structure the redesigned non-exam screens derive. */

describe('the dashboard lead', () => {
  it('says "easiest first" only for a trainer whose papers ramp', () => {
    const ramps = TRAINER_ORDER.filter(id => examsRampInDifficulty(TRAINER_CONTENT[id]));
    /* Only the dual-level papers carry a difficulty, graded easy → B1. */
    expect(ramps).toEqual(['a2b1']);
  });

  it('never claims an order for papers at one level', () => {
    const lead = describeMockLead(null, 10, false);
    expect(lead).toBe('10 Modelltests, all at exam level. Take them under real timing, in any order.');
    expect(lead).not.toMatch(/easiest/);
    expect(describeMockLead(null, 15, true)).toMatch(/^15 Modelltests, easiest first\./);
  });
});

describe('the pass rule callout', () => {
  /* The rows are the sentence laid out; every figure in a row must be one the sentence states. */
  it.each(Object.keys(PASS_RULE_SUMMARY) as ExamFormatId[])('%s rows match its sentence', format => {
    const figures = PASS_RULE_SUMMARY[format].rows.flatMap(row => row.line.match(/\d+\/\d+|≥ \d+/g) ?? []);
    expect(figures.length).toBeGreaterThan(0);
    for (const figure of figures) {
      const bare = figure.replace(/\/\d+$/, '');
      expect(PASS_RULES[format]).toContain(bare);
    }
  });

  it('gives the DTZ its three conditions as rows', () => {
    expect(PASS_RULE_SUMMARY['dtz-paper'].rows.map(row => row.part)).toEqual([
      'Sprechen',
      'Hören + Lesen',
      'Schreiben'
    ]);
    expect(PASS_RULE_SUMMARY['dtz-paper'].rows[0]?.line).toBe('B1 ≥ 75/100 · A2 ≥ 35/100');
  });
});

describe('a task target', () => {
  const sheets = { vocab: { title: 'Theme vocabulary', html: '<p>x</p>' } };

  it('links a module under the trainer namespace, naming the Teil', () => {
    expect(
      resolveTaskTarget({ kind: 'module', exam: 4, module: 'hoeren', teil: '1' }, '/dtz', sheets)
    ).toEqual({
      kind: 'link',
      to: '/dtz/exam/4/hoeren',
      label: 'Hören Teil 1 · Modelltest 4'
    });
    expect(resolveTaskTarget({ kind: 'module', exam: 1, module: 'lesen' }, '', sheets)).toMatchObject({
      to: '/exam/1/lesen',
      label: 'Lesen · Modelltest 1'
    });
  });

  it('deep-links a quiz, the tables and a guide anchor', () => {
    expect(resolveTaskTarget({ kind: 'quiz', category: 'verbs' }, '/b1', sheets)).toMatchObject({
      to: '/b1/practice?tab=quiz&category=verbs'
    });
    expect(resolveTaskTarget({ kind: 'practice', tab: 'tables' }, '', sheets)).toMatchObject({
      to: '/practice?tab=tables'
    });
    expect(resolveTaskTarget({ kind: 'guide', anchor: 'g-lesen' }, '/b2', sheets)).toMatchObject({
      to: '/b2/guide#g-lesen'
    });
  });

  it('opens a cheatsheet in place instead of navigating', () => {
    expect(resolveTaskTarget({ kind: 'cheatsheet', id: 'vocab' }, '', sheets)).toEqual({
      kind: 'cheatsheet',
      id: 'vocab',
      label: 'Theme vocabulary'
    });
  });
});

describe('the guide split', () => {
  it.each(TRAINER_ORDER)('%s: title, lead and contents leave the body', id => {
    const guide = TRAINER_CONTENT[id].guide ?? '';
    const parts = splitGuide(guide);
    expect(parts.title).toMatch(/^Exam Guide — /);
    expect(parts.lead?.length).toBeGreaterThan(20);
    expect(parts.toc.length).toBeGreaterThan(4);
    for (const entry of parts.toc) expect(parts.body).toContain(`id="${entry.href.slice(1)}"`);
    /* One <h1> per screen: the page renders the title, so the body must not repeat it. */
    expect(parts.body).not.toMatch(/<h1\b/);
    expect(parts.body).not.toMatch(/guide-toc|class="lead"/);
  });

  it('keeps a guide it cannot split whole', () => {
    expect(splitGuide('<h2>Only</h2>')).toEqual({ title: null, lead: null, toc: [], body: '<h2>Only</h2>' });
  });
});

describe('the score chart summary', () => {
  it('names the latest, the best and the lines', () => {
    const chart = buildScoreChart({
      format: 'dual-level',
      attempts: [
        {
          id: 1,
          examId: 2,
          mode: 'full',
          date: '2026-10-01T10:00:00.000Z',
          times: {},
          scores: {},
          sb: null,
          answers: {},
          ratings: {},
          total: 181,
          result: 'B1'
        },
        {
          id: 2,
          examId: 3,
          mode: 'full',
          date: '2026-10-02T10:00:00.000Z',
          times: {},
          scores: {},
          sb: null,
          answers: {},
          ratings: {},
          total: 150,
          result: 'A2'
        }
      ]
    });
    expect(summarizeScoreChart(chart)).toBe(
      'Score history: 2 full exams, scored out of 240. Latest: Test 3, 150 of 240 (A2). Best: 181 of 240. Lines at 240, 168 · B1, 96 · A2.'
    );
  });

  it('says there is nothing yet', () => {
    expect(summarizeScoreChart(buildScoreChart({ format: 'dtz-paper', attempts: [] }))).toMatch(
      /no full exams yet/
    );
  });
});

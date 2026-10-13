import { describe, expect, it } from 'vitest';

import { TRAINER_CONTENT } from '@content/trainerContent.ts';
import { TRAINERS } from '@shared/config/trainers.ts';
import { buildExamCards } from '@features/dashboard/pages/DashboardPage/examCards.ts';
import type { TrainerSlice } from '@shared/progress-store/hooks/useTrainerSlice.tsx';
import type { DtzAttempt } from '@shared/types/dtzExam.ts';
import type { DualLevelAttempt, Settings } from '@shared/types/progress.ts';
import type { SingleLevelAttempt } from '@shared/types/singleLevelExam.ts';
import type { LevelTrainerSettings } from '@shared/types/trainer.ts';

/*
 * One dashboard card per mock exam. The single-level branch read its best total and last
 * verdict from every attempt, so a module practice taken after a passed sitting — which has
 * no verdict — hid the "Bestanden" badge. The other two papers already read full sittings.
 */

const SETTINGS: Settings = {
  examDate: '2026-09-19',
  writingMinutes: 10,
  playsAllowed: 2,
  ttsRate: 1,
  voiceName: ''
};

const LEVEL_SETTINGS: LevelTrainerSettings = { examDate: '2026-09-19', writingMinutes: 30, playsAllowed: 1 };

const base = {
  learnDone: {},
  srs: {},
  activity: {},
  attemptedExamIds: new Set<number>(),
  update: () => undefined,
  setSetting: () => undefined,
  saveAttempt: () => undefined
};

const noSchedule = (): string | null => null;

const firstCard = (slice: TrainerSlice, schedule: typeof noSchedule = noSchedule) =>
  buildExamCards(slice, TRAINERS[slice.trainer], TRAINER_CONTENT[slice.trainer].exams, schedule)[0];

describe('buildExamCards — single-level', () => {
  const passed: SingleLevelAttempt = {
    id: 1,
    examId: 1,
    mode: 'full',
    date: '2026-08-20T10:00:00.000Z',
    times: {},
    scores: {},
    answers: {},
    ratings: {},
    written: 150,
    oral: 60,
    total: 210,
    result: 'Bestanden'
  };
  const practice: SingleLevelAttempt = { ...passed, id: 2, mode: 'lesen' };
  for (const key of ['written', 'oral', 'total', 'result'] as const) Reflect.deleteProperty(practice, key);

  const slice = (attempts: readonly SingleLevelAttempt[]): TrainerSlice => ({
    ...base,
    trainer: 'b1',
    format: 'single-level',
    settings: LEVEL_SETTINGS,
    attempts
  });

  it('keeps the verdict of the last full sitting when a module practice came after it', () => {
    const card = firstCard(slice([passed, practice]));
    expect(card?.resultLabel).toBe('Bestanden');
    expect(card?.resultTone).toBe('success');
    expect(card?.bestText).toBe('210/300');
    expect(card?.attemptCount).toBe(2);
  });

  it('shows practice runs only as a count, with no best and no verdict', () => {
    const card = firstCard(slice([practice]));
    expect(card?.bestText).toBeNull();
    expect(card?.resultLabel).toBeNull();
    expect(card?.attempted).toBe(true);
  });
});

describe('buildExamCards — the other papers', () => {
  it('a DTZ card leads with the best Hören + Lesen of a full sitting and its last verdict', () => {
    const full: DtzAttempt = {
      id: 1,
      examId: 1,
      mode: 'full',
      date: '2026-08-20T10:00:00.000Z',
      times: {},
      scores: { hoeren: 15, lesen: 20, schreiben: 15, sprechen: 80 },
      answers: {},
      ratings: {},
      result: 'Zertifikat B1'
    };
    const card = firstCard({
      ...base,
      trainer: 'dtz',
      format: 'dtz-paper',
      settings: LEVEL_SETTINGS,
      attempts: [full, { ...full, id: 2, mode: 'hoeren', scores: { hoeren: 20 } }]
    });
    expect(card?.bestText).toBe('35/45');
    expect(card?.resultLabel).toBe('Zertifikat B1');
  });

  it('an A2·B1 card takes the best full sitting', () => {
    const attempt = (id: number, total: number): DualLevelAttempt => ({
      id,
      examId: 1,
      mode: 'full',
      date: '2026-08-20T10:00:00.000Z',
      times: {},
      scores: {},
      sb: null,
      answers: {},
      ratings: {},
      total,
      result: 'B1'
    });
    const card = firstCard({
      ...base,
      trainer: 'a2b1',
      format: 'dual-level',
      settings: SETTINGS,
      attempts: [attempt(1, 150), attempt(2, 200)]
    });
    expect(card?.bestText).toBe('200/240');
  });
});

describe('buildExamCards — where the plan puts the exam', () => {
  const slice: TrainerSlice = {
    ...base,
    trainer: 'b1',
    format: 'single-level',
    settings: LEVEL_SETTINGS,
    attempts: []
  };

  it.each([
    ['today', 'default'],
    ['tomorrow', 'info'],
    ['optional', 'outline'],
    ['planned Do, 28. Aug', 'secondary']
  ] as const)('%s → %s', (label, tone) => {
    const card = firstCard(slice, () => label);
    expect(card?.scheduleLabel).toBe(label);
    expect(card?.scheduleTone).toBe(tone);
  });

  it('no slot, no badge', () => {
    expect(firstCard(slice)?.scheduleTone).toBeNull();
  });
});

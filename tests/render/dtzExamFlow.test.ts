import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DTZ_PAPER_EXAMS } from '@content/trainerContent.ts';
import { NO_MATCH_ANSWER } from '@shared/lib/answers.ts';
import { TRAINER_ORDER, TRAINERS } from '@shared/config/trainers.ts';
import { type DtzAttempt } from '@shared/types/dtzExam.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { runFormatFor } from '@shared/exam-run/lib/runFormats.ts';
import { PROGRESS_STORAGE_KEY } from '@shared/progress-store/lib/progressDb.ts';

import { captureErrors, click, findByText, mount, seedProgress, waitFor } from './harness.ts';

/*
 * A full DTZ sitting through the mounted app: Hören → Lesen → Schreiben → Sprechen, answering
 * only Lesen Teil 2's X item and leaving every self-rating slider where it starts (3 of 5).
 * That pins the verdict: Hören + Lesen 1/45 is unter A2, Schreiben 4 × 3 = 12/20 is A2 and
 * Sprechen 3 × 20 = 60/100 is A2 — Sprechen at A2 with one written part at A2 is Zertifikat A2.
 * A paper summed into one total, or one that ignored X, would say something else.
 */

const dtz = TRAINER_ORDER.find((trainer): trainer is TrainerId => TRAINERS[trainer].format === 'dtz-paper');
if (dtz === undefined) throw new Error('the registry has no DTZ trainer');
const info = TRAINERS[dtz];
const docKey = info.docKey;
if (docKey === null) throw new Error('the DTZ trainer keeps its own document');
const runStore = runFormatFor(dtz).runStore;

const paper = DTZ_PAPER_EXAMS[0];
if (!paper) throw new Error('the DTZ trainer ships no exams');
const xIndex = paper.lesen.teil2.answers.indexOf(NO_MATCH_ANSWER);
/* Lesen Teil 2 is items 26–30 on the paper. */
const xNumber = 26 + xIndex;

const storedAttempts = (key: string): readonly DtzAttempt[] => {
  const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return [];
  const db = JSON.parse(raw) as Partial<Record<string, { attempts?: DtzAttempt[] }>>;
  return db[key]?.attempts ?? [];
};

/** Submits the open module, confirming past any blanks. */
const submit = async (module: string): Promise<void> => {
  await click(findByText(new RegExp(`^Submit ${module}`)));
  const anyway = findByText(/^Submit (anyway|now)$/);
  if (anyway) await click(anyway);
};

describe('a full DTZ sitting', () => {
  let errors: ReturnType<typeof captureErrors>;

  beforeEach(() => {
    localStorage.clear();
    runStore.clear(dtz);
    seedProgress({ daysUntilExam: 30 });
    errors = captureErrors();
  });

  afterEach(() => {
    errors.restore();
  });

  it('accepts X in Lesen Teil 2 and ends on a certificate verdict', async () => {
    expect(xIndex).toBeGreaterThanOrEqual(0);
    const view = await mount(`${info.basePath}/exam/1/full`);
    expect(view.text()).toMatch(/Module 1 of 4/);

    await click(findByText(/^Start Hören/));
    await submit('Hören');

    await click(findByText(/^Start Lesen/));
    expect(view.text()).toMatch(/Teil 2 — Anzeigen/);
    await click(document.querySelector(`[aria-label="Anzeige für Aufgabe ${String(xNumber)}"]`) ?? undefined);
    await click(findByText(/^X$/, '[role="option"]'));
    expect(runStore.load(dtz)?.answers[`l2.${String(xIndex)}`]).toBe(NO_MATCH_ANSWER);
    await submit('Lesen');

    await click(findByText(/^Start Schreiben/));
    expect(view.text()).toMatch(/Aufgabe B:/);
    await submit('Schreiben');
    expect(view.text()).toMatch(/max 20/);
    await click(findByText(/^Confirm score/));

    await click(findByText(/^Start Sprechen/));
    await submit('Sprechen');
    expect(view.text()).toMatch(/max 100/);
    await click(findByText(/^Confirm score/));

    await waitFor(() => /time used/.test(view.text()));
    const text = view.text();
    expect(text).toMatch(/Zertifikat A2/);
    expect(text).toContain('Hören + Lesen: 1/45 → unter A2 (B1 ab 33, A2 ab 20)');
    expect(text).toContain('Schreiben: 12/20 → A2 (B1 ab 15, A2 ab 7)');
    expect(text).toContain('Sprechen: 60/100 → A2 (B1 ab 75, A2 ab 35)');
    /* No points total: the DTZ verdict is not a sum. */
    expect(text).not.toMatch(/\/ \d+ points/);

    const attempts = storedAttempts(docKey);
    expect(attempts).toHaveLength(1);
    expect(attempts[0]?.result).toBe('Zertifikat A2');
    expect(attempts[0]?.scores).toEqual({ hoeren: 0, lesen: 1, schreiben: 12, sprechen: 60 });
    expect(attempts[0]?.answers[`l2.${String(xIndex)}`]).toBe(NO_MATCH_ANSWER);
    expect(runStore.load(dtz)).toBeNull();

    expect(errors.real()).toEqual([]);
    await view.unmount();
  });

  it('sends a run naming a module the DTZ does not have back to the dashboard', async () => {
    const view = await mount(`${info.basePath}/exam/1/sprachbausteine`);
    expect(view.text()).toMatch(/Dashboard/);
    expect(view.text()).not.toMatch(/Start Sprachbausteine/);
    await view.unmount();
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROOT_TRAINER } from '@shared/config/trainers.ts';
import { runFormatFor } from '@shared/exam-run/lib/runFormats.ts';
import { createRun } from '@shared/exam-run/lib/runStore.ts';

import { click, findByText, mount, seedProgress, waitFor } from './harness.ts';

/*
 * A curriculum "Go →" link starts a run, and a trainer keeps one run in progress — so following
 * one used to replace a half-finished sitting without a word. It must ask first, through the
 * app's confirm dialog, and do nothing unless the candidate agrees.
 *
 * Day 2 of the root trainer's plan links Lesen Teil 1 of mock exam 3; the run in progress is
 * Hören of mock exam 2.
 */

const store = runFormatFor(ROOT_TRAINER).runStore;
const inProgress = createRun({ trainer: ROOT_TRAINER, examId: 2, mode: 'hoeren', queue: ['hoeren'] });

const goLink = (): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>('a')].find(anchor =>
    /Go to Lesen Teil 1 · Mock exam 3/.test(anchor.textContent)
  );

const dialogText = (): string => document.querySelector('[role="alertdialog"]')?.textContent ?? '';

beforeEach(() => {
  localStorage.clear();
  seedProgress({ daysUntilExam: 30, completedDays: [{ day: 1, tasks: 3 }] });
  store.save(inProgress);
});

afterEach(() => {
  store.clear(ROOT_TRAINER);
  vi.restoreAllMocks();
});

describe('a Go link that would replace a run in progress', () => {
  it('asks, and "Keep it" leaves the run and the page alone', async () => {
    const page = await mount('/learn');
    await click(goLink());

    expect(
      await waitFor(() => /You have Hören in progress for mock exam 2 — discard it\?/.test(dialogText()))
    ).toBe(true);
    await click(findByText(/^Keep it$/));

    expect(await waitFor(() => dialogText() === '')).toBe(true);
    expect(store.load(ROOT_TRAINER)).toEqual(inProgress);
    expect(page.text()).not.toMatch(/Start Lesen/);
    await page.unmount();
  });

  it('asks, and "Discard and start" replaces it and opens the module', async () => {
    const page = await mount('/learn');
    await click(goLink());
    expect(await waitFor(() => /discard it\?/.test(dialogText()))).toBe(true);
    await click(findByText(/^Discard and start$/));

    expect(await waitFor(() => /Start Lesen/.test(page.text()))).toBe(true);
    expect(store.load(ROOT_TRAINER)).toMatchObject({ examId: 3, mode: 'lesen', answers: {} });
    await page.unmount();
  });

  it('opens the run as it is, without asking, when it is that very module', async () => {
    const same = createRun({ trainer: ROOT_TRAINER, examId: 3, mode: 'lesen', queue: ['lesen'] });
    store.save({ ...same, answers: { 'l1.0': 2 } });
    const page = await mount('/learn');
    await click(goLink());

    expect(await waitFor(() => /Start Lesen/.test(page.text()))).toBe(true);
    expect(dialogText()).toBe('');
    expect(store.load(ROOT_TRAINER)?.answers).toEqual({ 'l1.0': 2 });
    await page.unmount();
  });
});

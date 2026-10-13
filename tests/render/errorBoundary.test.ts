import { act, createElement, Suspense } from 'react';

import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary.tsx';
import { TRAINER_ORDER, TRAINERS } from '@shared/config/trainers.ts';
import { useTrainerContent } from '@shared/hooks/useTrainerContent.tsx';
import { clearLog, getLogEntries } from '@shared/lib/logger.ts';

import { click, findByText, waitFor } from './harness.ts';

/* The boundary keeps one broken screen from taking the trainer down. It recovers two ways:
   "Try again", and a new `resetKey` — the route path, so navigating away clears the crash. */

let explode = true;
let crash: Error = new Error('kaputt');
const Screen = (): string => {
  if (explode) throw crash;
  return 'screen ok';
};

const renderAt = (root: Root, resetKey: string): Promise<void> =>
  act(async () => {
    root.render(createElement(ErrorBoundary, { resetKey, children: createElement(Screen) }));
  });

describe('ErrorBoundary', () => {
  let container: HTMLElement;
  let root: Root;

  beforeEach(() => {
    explode = true;
    crash = new Error('kaputt');
    clearLog();
    sessionStorage.clear();
    /* React and the boundary both log the caught error; keep the run quiet. */
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
  });

  it('shows a friendly fallback — never the raw message — logs it, and "Try again" re-renders', async () => {
    await renderAt(root, '/a');
    expect(container.textContent).toContain('Something went wrong');
    expect(container.textContent).not.toContain('kaputt');
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(getLogEntries().at(-1)).toMatchObject({ level: 'error', scope: 'render' });
    expect(getLogEntries().at(-1)?.message).toContain('kaputt');

    explode = false;
    await click(findByText(/Try again/));
    expect(container.textContent).toBe('screen ok');
  });

  it('clears the crash when the reset key (the route) changes', async () => {
    await renderAt(root, '/a');
    expect(container.textContent).toContain('Something went wrong');

    explode = false;
    await renderAt(root, '/a');
    expect(container.textContent).toContain('Something went wrong');

    await renderAt(root, '/b');
    expect(container.textContent).toBe('screen ok');
  });

  it('offers "Go to dashboard" as a full load of / at the app root', async () => {
    await renderAt(root, '/a');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/');
  });

  it("links to the trainer's own dashboard inside the router", async () => {
    await act(async () => {
      root.render(
        createElement(
          MemoryRouter,
          { initialEntries: ['/b1/learn'] },
          createElement(ErrorBoundary, {
            resetKey: '/b1/learn',
            homeHref: '/b1',
            children: createElement(Screen)
          })
        )
      );
    });
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/b1');
  });

  describe('a chunk that failed to load', () => {
    const reload = vi.fn();
    let original: Location;

    beforeEach(() => {
      original = window.location;
      reload.mockReset();
      crash = new TypeError(
        'Failed to fetch dynamically imported module: http://x.test/assets/SettingsPage.js'
      );
      /* happy-dom's reload is not spy-able in place; swap in a location that records it. */
      Object.defineProperty(window, 'location', {
        value: { ...original, pathname: '/settings', reload },
        configurable: true
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', { value: original, configurable: true });
    });

    it('reloads once, then offers Reload instead of a "Try again" that cannot work', async () => {
      await renderAt(root, '/a');
      expect(reload).toHaveBeenCalledTimes(1);
      expect(container.textContent).toContain('needs a fresh copy of the app');
      expect(findByText(/Try again/)).toBeUndefined();

      /* The reloaded page fails again: the guard holds, so the fallback stays — no loop. */
      await renderAt(root, '/b');
      expect(reload).toHaveBeenCalledTimes(1);

      await click(findByText(/Reload/));
      expect(reload).toHaveBeenCalledTimes(2);
    });

    it('never reloads by itself during an exam sitting', async () => {
      Object.defineProperty(window, 'location', {
        value: { ...original, pathname: '/b1/exam/3/full', reload },
        configurable: true
      });
      await renderAt(root, '/b1/exam/3/full');
      expect(reload).not.toHaveBeenCalled();
      expect(findByText(/Reload/)).toBeDefined();
    });
  });
});

/* Regression: a trainer's content load that failed once was cached as a rejected promise, so
   the boundary's "Try again" re-threw it forever — the learner had to reload to recover. */
describe('a failed content load', () => {
  it('is fetched afresh by "Try again"', async () => {
    const trainer = TRAINER_ORDER[1] ?? 'b1';
    const real = TRAINERS[trainer].loadContent;
    /* Rejects until restored: React re-renders once on an error before giving up, and with the
       failed promise forgotten that retry already asks again. */
    const loader = vi
      .spyOn(TRAINERS[trainer], 'loadContent')
      .mockImplementation(() => Promise.reject(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const Content = (): string => `${String(useTrainerContent(trainer).exams.length)} exams`;
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    await act(async () => {
      root.render(
        createElement(ErrorBoundary, {
          children: createElement(Suspense, { fallback: 'loading' }, createElement(Content))
        })
      );
    });
    await waitFor(() => (container.textContent ?? '').includes('Something went wrong'));
    expect(container.textContent).toContain('Something went wrong');

    const failedCalls = loader.mock.calls.length;
    loader.mockImplementation(real);
    await click(findByText(/Try again/));
    await waitFor(() => /\d+ exams/.test(container.textContent ?? ''));
    expect(container.textContent).toMatch(/^\d+ exams$/);
    expect(loader.mock.calls.length).toBe(failedCalls + 1);
    await act(async () => {
      root.unmount();
    });
  });
});

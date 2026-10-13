import { act, createElement } from 'react';

import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TRAINER_ORDER, TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { type ActiveTrainer, useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';

import { click, mount, seedProgress, settle, waitFor } from './harness.ts';

/* The shell's hooks: which trainer the header follows, how the switcher moves between them,
   and what every navigation resets. */

interface Probed {
  readonly current: () => ActiveTrainer;
  readonly pathname: () => string;
  readonly unmount: () => Promise<void>;
}

const probe = async (route: string): Promise<Probed> => {
  let active: ActiveTrainer | undefined;
  let pathname = '';
  const Probe = (): null => {
    active = useActiveTrainer();
    pathname = useLocation().pathname;
    return null;
  };

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(createElement(MemoryRouter, { initialEntries: [route] }, createElement(Probe)));
  });

  return {
    current: (): ActiveTrainer => {
      if (!active) throw new Error('the probe never rendered');
      return active;
    },
    pathname: (): string => pathname,
    unmount: async (): Promise<void> => {
      await act(async () => {
        root.unmount();
      });
    }
  };
};

describe('useActiveTrainer', () => {
  it.each(TRAINER_ORDER)('reads %s from any of its URLs', async trainer => {
    const probed = await probe(`${TRAINERS[trainer].basePath}/learn`);

    expect(probed.current().trainer.id).toBe(trainer);
    expect(probed.current().home).toBe(trainerHome(trainer));
    expect(probed.current().trainers.map(entry => entry.id)).toEqual(TRAINER_ORDER);
    await probed.unmount();
  });

  it.each(TRAINER_ORDER)('switches to %s by navigating to its dashboard', async trainer => {
    /* Start from a different trainer's deep URL, so the switch has somewhere to go. */
    const from = TRAINER_ORDER.find(other => other !== trainer) ?? trainer;
    const probed = await probe(`${TRAINERS[from].basePath}/history`);
    expect(probed.current().trainer.id).toBe(from);

    await act(async () => {
      probed.current().switchTo(trainer);
    });

    expect(probed.pathname()).toBe(trainerHome(trainer));
    expect(probed.current().trainer.id).toBe(trainer);
    await probed.unmount();
  });
});

describe('useAppLayout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("puts the active trainer's exam countdown in the header", async () => {
    seedProgress({ daysUntilExam: 10 });
    const page = await mount('/');

    expect(page.text()).toContain('10 days left');
    await page.unmount();
  });

  it('makes the skip link the first focusable element, aimed at main', async () => {
    const page = await mount('/');
    const first = page.container.querySelector(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    expect(first?.textContent).toBe('Skip to content');
    expect(first?.getAttribute('href')).toBe('#main');
    expect(page.container.querySelector('main#main')).not.toBeNull();
    /* Initial load leaves focus alone, so Tab reaches that link first. */
    expect(document.activeElement?.tagName).not.toBe('H1');
    await page.unmount();
  });

  it("moves focus to the new page's heading and names the tab after it", async () => {
    const page = await mount('/');
    expect(document.title).toMatch(/^Dashboard.* — Prüfungstrainer Deutsch$/);

    const learn = [...page.container.querySelectorAll('nav[aria-label="Main"] a')].find(link =>
      link.textContent.includes('Learn')
    );
    await click(learn);
    expect(await waitFor(() => document.activeElement?.tagName === 'H1')).toBe(true);

    const heading = document.activeElement?.textContent ?? '';
    expect(heading).not.toMatch(/^Dashboard/);
    expect(document.title).toBe(`${heading.replace(/\s+/g, ' ').trim()} — Prüfungstrainer Deutsch`);
    await page.unmount();
  });

  it('shows the offline badge when the browser goes offline, and drops it when it is back', async () => {
    const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const page = await mount('/');
    const badge = (): Element | null =>
      page.container.querySelector('[aria-label="Offline — what still works"]');
    expect(badge()).toBeNull();

    onLine.mockReturnValue(false);
    await act(async () => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(badge()).not.toBeNull();

    onLine.mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });
    expect(badge()).toBeNull();
    await page.unmount();
  });

  it('scrolls to the top on every navigation', async () => {
    const page = await mount('/');
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    const learn = [...page.container.querySelectorAll('nav[aria-label="Main"] a')].find(link =>
      link.textContent.includes('Learn')
    );
    expect(learn).toBeDefined();
    await click(learn);
    await settle();

    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    await page.unmount();
  });

  it('leaves a #section link to the page, which scrolls to it', async () => {
    /* The layout's reset runs after the page's own effect, so it used to undo the guide's
       hash scroll and land every TOC link at the top. */
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView');

    const page = await mount('/guide#g-scoring');

    expect(scrollTo).not.toHaveBeenCalledWith(0, 0);
    expect(
      scrollIntoView.mock.contexts.some(element => element instanceof Element && element.id === 'g-scoring')
    ).toBe(true);
    scrollIntoView.mockRestore();
    await page.unmount();
  });
});

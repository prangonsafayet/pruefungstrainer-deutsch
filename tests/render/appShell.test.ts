import { act, createElement } from 'react';

import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TRAINER_ORDER, TRAINERS, trainerHome } from '@shared/config/trainers.ts';
import { type ActiveTrainer, useActiveTrainer } from '@features/app-shell/hooks/useActiveTrainer.tsx';

import { click, mount, seedProgress, settle } from './harness.ts';

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
});

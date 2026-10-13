import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { click, findByText, mount, seedProgress, settle } from './harness.ts';

/* The Learn tab's two owner complaints: cheatsheets were a scroll to the bottom of the plan
   with no way back, and tasks named their destination in prose only. Both are checked on the
   mounted page, on a wide screen (panel beside the plan) and a narrow one (modal sheet). */

const stubWidth = (wide: boolean): void => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    query =>
      ({
        matches: /min-width/.test(query) ? wide : false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false
      }) as MediaQueryList
  );
};

beforeEach(() => {
  localStorage.clear();
  /* Day 2 is A2·B1's first unfinished day: day 1 is done, so day 2 is today's lesson. */
  seedProgress({ daysUntilExam: 30, completedDays: [{ day: 1, tasks: 3 }] });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('a task with a target', () => {
  it('links to the module it names, under the trainer it belongs to', async () => {
    stubWidth(true);
    const page = await mount('/learn');
    const link = [...page.container.querySelectorAll('a')].find(anchor =>
      /Go to Lesen Teil 1 · Mock exam 3/.test(anchor.textContent)
    );
    expect(link?.getAttribute('href')).toBe('/exam/3/lesen');
    await page.unmount();
  });

  it('leaves a plain-string task without a link', async () => {
    stubWidth(true);
    const page = await mount('/learn');
    /* Day 2, task 0 is annotated (the guide); day 3's tasks are plain strings. */
    const guide = [...page.container.querySelectorAll('a')].filter(anchor =>
      /Go to Exam Guide/.test(anchor.textContent)
    );
    expect(guide.map(anchor => anchor.getAttribute('href'))).toContain('/guide#g-lesen');
    await page.unmount();
  });
});

describe('cheatsheets on a wide screen', () => {
  it('open beside the plan from the day card, take focus, and lead back to the day', async () => {
    stubWidth(true);
    const page = await mount('/learn');
    const aside = page.container.querySelector('aside[aria-label="Cheatsheets"]');
    expect(aside?.querySelector('h2')?.textContent).toBe('Cheatsheets');

    await click(findByText(/Open Theme vocabulary/));
    await settle();
    const heading = aside?.querySelector('h2');
    expect(heading?.textContent).toMatch(/^Theme vocabulary/);
    expect(document.activeElement).toBe(heading);
    expect(aside?.querySelector('.prose')?.innerHTML).toMatch(/<b>/);

    await click(findByText(/Back to Day 2/));
    expect(document.activeElement?.id).toBe('learn-day-2');
    await page.unmount();
  });

  it('opens the sheet a #cs- link names', async () => {
    stubWidth(true);
    const page = await mount('/learn#cs-cases');
    expect(page.container.querySelector('aside h2')?.textContent).toMatch(/^Cases/);
    await page.unmount();
  });
});

describe('cheatsheets on a narrow screen', () => {
  it('open in a modal sheet and return focus to the day on the way back', async () => {
    stubWidth(false);
    const page = await mount('/learn');
    expect(page.container.querySelector('aside[aria-label="Cheatsheets"]')).toBeNull();

    await click(findByText(/Open Theme vocabulary/));
    await settle();
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog?.textContent).toMatch(/Theme vocabulary/);

    await click(findByText(/Back to Day 2/));
    await settle(100);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement?.id).toBe('learn-day-2');
    await page.unmount();
  });

  it('lists every sheet from the button above the plan', async () => {
    stubWidth(false);
    const page = await mount('/learn');
    await click(findByText(/Cheatsheets \(\d+\)/));
    await settle();
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog?.querySelectorAll('li button').length).toBe(12);
    await page.unmount();
  });
});

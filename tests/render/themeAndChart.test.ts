import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { syncThemeColor } from '@shared/hooks/useTheme.tsx';

import { bySelector, click, mount, seedProgress } from './harness.ts';

describe('theme-color', () => {
  let style: HTMLStyleElement;
  const metas: HTMLMetaElement[] = [];

  beforeEach(() => {
    style = document.createElement('style');
    style.textContent = ':root { --background: #f6f7fb; } .dark { --background: #12141c; }';
    document.head.appendChild(style);
    for (const media of ['(prefers-color-scheme: light)', '(prefers-color-scheme: dark)']) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.media = media;
      meta.content = 'unset';
      document.head.appendChild(meta);
      metas.push(meta);
    }
  });

  afterEach(() => {
    style.remove();
    for (const meta of metas.splice(0)) meta.remove();
    document.documentElement.classList.remove('dark');
  });

  it('follows the in-app theme, not the OS one, on both metas', () => {
    document.documentElement.classList.add('dark');
    syncThemeColor();
    expect(metas.map(meta => meta.content)).toEqual(['#12141c', '#12141c']);

    document.documentElement.classList.remove('dark');
    syncThemeColor();
    expect(metas.map(meta => meta.content)).toEqual(['#f6f7fb', '#f6f7fb']);
  });

  it('follows the theme toggle in the header', async () => {
    localStorage.clear();
    localStorage.setItem('telcTrainerTheme', 'light');
    const page = await mount('/settings');
    expect(metas[1]?.content).toBe('#f6f7fb');
    await click(bySelector('button[aria-label="Switch to dark mode"]')[0]);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(metas.map(meta => meta.content)).toEqual(['#12141c', '#12141c']);
    await page.unmount();
  });
});

describe('the score history chart', () => {
  it('is one image with a summary, and every bar is a row of its table', async () => {
    localStorage.clear();
    seedProgress({ attempts: [{ examId: 1 }, { examId: 2 }, { examId: 3 }] });
    /* The harness's attempts carry no total; give each one so the chart has bars. */
    const stored = JSON.parse(localStorage.getItem('telcTrainerV1') ?? '{}') as {
      attempts: { total?: number; result?: string }[];
    };
    stored.attempts.forEach((attempt, index) => {
      attempt.total = 150 + index * 15;
      attempt.result = index === 0 ? 'A2' : 'B1';
    });
    localStorage.setItem('telcTrainerV1', JSON.stringify(stored));

    const page = await mount('/history');
    const image = page.container.querySelector('[role="img"]');
    expect(image?.getAttribute('aria-label')).toBe(
      'Score history: 3 full exams, scored out of 240. Latest: Test 3, 180 of 240 (B1). Best: 180 of 240. Lines at 240, 168 · B1, 96 · A2.'
    );
    const table = page.container.querySelector('details table');
    expect(table?.querySelectorAll('tbody tr').length).toBe(3);
    expect(table?.querySelector('caption')?.textContent).toBe('Lines: 240, 168 · B1, 96 · A2.');
    expect(table?.textContent).toContain('180 / 240');

    /* Each attempt's Review link says which attempt it opens, not just "Review". */
    const reviews = [...page.container.querySelectorAll('table:not(details table) a')].map(
      link => link.textContent
    );
    expect(reviews).toHaveLength(3);
    expect(new Set(reviews).size).toBe(3);
    expect(reviews[0]?.trim()).toMatch(/^Review T3, \d/);
    await page.unmount();
  });
});

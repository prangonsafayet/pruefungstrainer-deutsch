import { expect, test } from '@playwright/test';

/* Client-side navigation, the way a nav link does it, without depending on which nav (pill
   row, tab bar, "More" menu) the viewport shows. */
const navigate = (page, path) =>
  page.evaluate(to => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);

/** Counts full document loads of the main frame from here on. */
const countLoads = page => {
  const loads = { count: 0 };
  page.on('load', () => {
    loads.count++;
  });
  return loads;
};

test.describe('a lazy chunk that is gone after a deploy', () => {
  test('reloads exactly once, then shows the fallback with Reload — never a loop', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    /* The deploy happens now: the Settings chunk this tab would ask for no longer exists. */
    await page.route('**/SettingsPage/SettingsPage.tsx*', route => route.fulfill({ status: 404, body: '' }));
    const loads = countLoads(page);

    await navigate(page, '/settings');

    const fallback = page.getByRole('alert').filter({ hasText: 'needs a fresh copy of the app' });
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole('button', { name: 'Reload' })).toBeVisible();
    await expect(fallback.getByRole('button', { name: /Try again/ })).toHaveCount(0);
    /* Give a second reload every chance to happen before asserting it did not. */
    await page.waitForTimeout(1500);
    expect(loads.count).toBe(1);
    expect(await page.evaluate(() => sessionStorage.getItem('telcTrainerChunkReloadAt'))).toMatch(/^\d+$/);

    /* Once the chunk is back, the learner's Reload recovers. */
    await page.unroute('**/SettingsPage/SettingsPage.tsx*');
    await fallback.getByRole('button', { name: 'Reload' }).click();
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
  });

  test('never reloads by itself during an exam sitting', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.route('**/MockExamRunnerPage/MockExamRunnerPage.tsx*', route =>
      route.fulfill({ status: 404, body: '' })
    );
    const loads = countLoads(page);

    await navigate(page, '/exam/1/lesen');

    await expect(page.getByRole('alert').filter({ hasText: 'needs a fresh copy of the app' })).toBeVisible();
    await page.waitForTimeout(1000);
    expect(loads.count).toBe(0);
    expect(await page.evaluate(() => sessionStorage.getItem('telcTrainerChunkReloadAt'))).toBeNull();
  });
});

test.describe('damaged progress in localStorage', () => {
  test('boots to a usable app with a notice, and the damaged copy downloads', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('telcTrainerV1', '{"attempts":[{"id":1,'));
    await page.reload();

    await expect(page.getByText('Your saved progress could not be read')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('telcTrainerRecoveryV1'))).toBe(
      '{"attempts":[{"id":1,'
    );

    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download the damaged data' }).click();
    expect((await download).suggestedFilename()).toBe('telc-trainer-damaged-progress.txt');

    /* Usable: navigating works and writes a fresh document the next load reads cleanly. */
    await navigate(page, '/settings');
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
    await expect(page.getByText('Your saved progress could not be read')).toHaveCount(0);
  });
});

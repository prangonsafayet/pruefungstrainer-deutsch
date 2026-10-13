import { spawn } from 'node:child_process';
import { appendFileSync, cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { expect, test } from '@playwright/test';

import { trainerDescriptors } from '../scripts/trainerRegistry.mjs';

/*
 * The production build as a PWA (playwright.offline.config.ts serves dist/ with its real
 * _headers): one online visit installs the service worker and precaches everything, then the
 * browser goes offline and every trainer still works — screens reached by a full page load,
 * so the navigation fallback is exercised, not just client-side routing — down to sitting
 * and submitting a DTZ Lesen module whose result survives an offline reload. A second test
 * ships a "new deploy" and checks the update prompt, held back during an exam sitting.
 */

const TRAINERS = trainerDescriptors();
const DTZ = TRAINERS.find(trainer => trainer.format === 'dtz-paper');
if (!DTZ) throw new Error('the registry has no dtz-paper trainer');

const dashboardHeading = page => page.getByRole('heading', { name: /^Dashboard/, level: 1 });

/* `expect.poll`, never `page.waitForFunction`, for these async checks: waitForFunction does not
   await a returned Promise — a Promise is truthy, so it resolved on the first poll, before the
   precache install had finished (issue #35). */
/** Until the worker is active (its precache filled during install) and controls this page. */
const serviceWorkerInControl = page =>
  expect
    .poll(
      () =>
        page.evaluate(async () => {
          const registration = await navigator.serviceWorker.getRegistration();
          return registration?.active?.state === 'activated' && navigator.serviceWorker.controller !== null;
        }),
      { timeout: 30_000 }
    )
    .toBe(true);

const collectPageErrors = page => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return errors;
};

test('after one visit, every trainer works offline — down to a DTZ Lesen sitting that persists', async ({
  page,
  context
}) => {
  test.setTimeout(120_000);
  const errors = collectPageErrors(page);
  /* A slow precache install, as on a busy CI runner: going offline before it finishes fails
     the reload below, so a wait that returns early fails here every time, not by chance. */
  await context.route('**/assets/content-*', async route => {
    await new Promise(resolve => setTimeout(resolve, 1_000));
    await route.continue();
  });
  await page.goto('/');
  await expect(dashboardHeading(page)).toBeVisible();
  await serviceWorkerInControl(page);
  await context.unrouteAll();

  await context.setOffline(true);
  /* The emulation reaches the network for real: an unprecached file cannot be fetched. */
  expect(
    await page.evaluate(() =>
      fetch('/not-precached.txt', { cache: 'no-store' }).then(
        () => 'fetched',
        () => 'failed'
      )
    )
  ).toBe('failed');

  await page.reload();
  await expect(dashboardHeading(page)).toBeVisible();
  expect(await page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);

  /* The header says so, and says what still works. */
  await page.getByRole('button', { name: 'Offline — what still works' }).click();
  const note = page.getByRole('dialog');
  await expect(note).toContainText('Cloud sync and writing feedback resume');
  await expect(note).toContainText('German voice');
  await page.keyboard.press('Escape');

  for (const { basePath, short } of TRAINERS) {
    await page.goto(basePath || '/');
    await expect(dashboardHeading(page)).toContainText(short);
    await page.goto(`${basePath}/learn`);
    await expect(page.locator('main')).toContainText(/AI-assisted learning/);
    await page.goto(`${basePath}/practice`);
    await expect(page.locator('main')).toContainText(/Reference tables/);
  }

  /* A DTZ Lesen module, sat and submitted offline. */
  await page.goto(`${DTZ.basePath}/exam/1/lesen`);
  await page.getByRole('button', { name: /^Start Lesen/ }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  const firstItem = page.locator('[id^="l1.0-"]').first();
  await firstItem.click();
  await expect(firstItem).toBeChecked();
  await page.getByRole('button', { name: /^Submit Lesen/ }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Submit anyway' }).click();
  await expect(page).toHaveURL(new RegExp(`${DTZ.basePath}/results/[^/]+$`));
  await expect(page.getByText(/time used/)).toBeVisible();
  await expect(page.getByText('/25', { exact: true }).first()).toBeVisible();

  /* Still offline: the reload is served by the worker, the result by localStorage. */
  await page.reload();
  await expect(page.getByText(/time used/)).toBeVisible();
  await page.goto(`${DTZ.basePath}/history`);
  await expect(page.locator('main')).toContainText('1 module practice run');

  expect(errors, 'uncaught errors offline').toEqual([]);
});

test.describe('a new deploy', () => {
  /* A server of its own over a copy of dist/, so this test can "deploy" by changing sw.js
     without touching the build the other test runs against. */
  let dir = '';
  let server;
  let origin = '';

  test.beforeEach(async () => {
    dir = mkdtempSync(path.join(tmpdir(), 'telc-pwa-'));
    cpSync('dist', dir, { recursive: true });
    const port = 4180 + test.info().parallelIndex;
    origin = `http://localhost:${String(port)}`;
    server = spawn(
      process.execPath,
      ['scripts/serve-dist-with-headers.mjs', '--port', String(port), '--dir', dir],
      {
        stdio: 'ignore'
      }
    );
    await expect
      .poll(() =>
        fetch(origin).then(
          response => response.status,
          () => 0
        )
      )
      .toBe(200);
  });

  test.afterEach(() => {
    server?.kill();
    rmSync(dir, { recursive: true, force: true });
  });

  test('is offered as "A new version is ready — Reload", never during an exam sitting', async ({ page }) => {
    test.setTimeout(90_000);
    const prompt = page.getByText('A new version is ready');
    await page.goto(origin);
    await expect(dashboardHeading(page)).toBeVisible();
    await serviceWorkerInControl(page);

    /* The browser compares sw.js byte for byte: any change is a new version, exactly as a
       deploy with a changed precache manifest is. */
    appendFileSync(path.join(dir, 'sw.js'), '\n// e2e: a new deploy\n');

    /* Mid-exam, the update installs but nobody is asked. */
    await page.goto(`${origin}${DTZ.basePath}/exam/1/lesen`);
    await expect(page.getByRole('button', { name: /^Start Lesen/ })).toBeVisible();
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
    });
    await expect
      .poll(() =>
        page.evaluate(async () => {
          const registration = await navigator.serviceWorker.getRegistration();
          return Boolean(registration?.waiting);
        })
      )
      .toBe(true);
    /* Long enough for the app to have heard of the waiting worker and (not) shown it. */
    await page.waitForTimeout(1_000);
    await expect(prompt).toBeHidden();

    /* Leaving the sitting (a client-side navigation) brings the offer. */
    await page.evaluate(path => {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, DTZ.basePath);
    await expect(dashboardHeading(page)).toBeVisible();
    await expect(prompt).toBeVisible();

    const reloaded = page.waitForEvent('load');
    await page.getByRole('button', { name: 'Reload' }).click();
    await reloaded;
    await expect(dashboardHeading(page)).toBeVisible();
    await expect(prompt).toBeHidden();
    const after = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return {
        waiting: Boolean(registration?.waiting),
        controlled: navigator.serviceWorker.controller !== null
      };
    });
    expect(after).toEqual({ waiting: false, controlled: true });
  });
});

import { expect, test } from '@playwright/test';

import { trainerDescriptors } from '../scripts/trainerRegistry.mjs';

/*
 * The Content-Security-Policy in public/_headers, enforced by a real browser against the
 * production build (playwright.csp.config.ts serves dist/ with its _headers). Every screen and
 * every path that reaches past the page — sign-in, the Supabase API, a provider avatar, speech
 * synthesis, the microphone and the playback of its blob: recording — must run without one
 * `securitypolicyviolation`. A blocked inline script, style, font, image or connection fails
 * here, not in production.
 */

const TRAINERS = trainerDescriptors();
const DTZ = TRAINERS.find(trainer => trainer.format === 'dtz-paper');
if (!DTZ) throw new Error('the registry has no dtz-paper trainer');

/** A 1×1 transparent PNG, for the stubbed avatar. */
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

/** Records violations from the first byte of every document, before any app script runs. */
const watchCsp = async page => {
  const violations = [];
  await page.exposeFunction('__cspViolation', text => {
    violations.push(text);
  });
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', event => {
      window.__cspViolation(`${event.violatedDirective} blocked ${event.blockedURI || 'inline'}`);
    });
  });
  page.on('console', message => {
    if (/Content Security Policy/i.test(message.text())) violations.push(message.text());
  });
  return violations;
};

/* No real backend: Supabase answers from stubs. The CSP check runs before the request
   leaves the renderer, so a stub cannot hide a blocked origin. */
const stubSupabase = page =>
  page.route(/^https:\/\/[^/]+\.supabase\.co\//, route =>
    route.fulfill({ status: 400, contentType: 'application/json', body: '{"error":"stubbed"}' })
  );

const settle = async page => {
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
};

test.beforeEach(async ({ page }) => {
  await stubSupabase(page);
});

test('the policy and its companion headers are served', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();
  expect(headers['content-security-policy']).toContain("script-src 'self' 'sha256-");
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['strict-transport-security']).toContain('max-age=63072000');
  expect(headers['permissions-policy']).toContain('microphone=(self)');
  expect(headers['cross-origin-opener-policy']).toBe('same-origin');
  expect(headers['cache-control']).toBe('no-cache');

  const asset = await request.get('/favicon.svg');
  expect(asset.headers()['x-content-type-options']).toBe('nosniff');
});

test('every screen of every trainer, both themes', async ({ page }) => {
  test.setTimeout(120_000);
  const violations = await watchCsp(page);
  const paths = ['/settings', '/no-such-page'];
  for (const { basePath } of TRAINERS)
    paths.push(
      basePath || '/',
      `${basePath}/learn`,
      `${basePath}/practice`,
      `${basePath}/history`,
      `${basePath}/guide`
    );

  for (const theme of ['light', 'dark']) {
    await page.goto('/');
    await page.evaluate(value => localStorage.setItem('telcTrainerTheme', value), theme);
    for (const path of paths) {
      await page.goto(path);
      await settle(page);
    }
    /* The pre-paint theme script is the one inline script; blocked, dark never applies. */
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
      theme === 'dark'
    );
  }
  expect(violations).toEqual([]);
});

test('sign-in: the OAuth hand-off and the password form', async ({ page }) => {
  const violations = await watchCsp(page);
  let authorize = null;
  await page.route('**/auth/v1/authorize*', route => {
    authorize = route.request().url();
    return route.abort();
  });
  await page.goto('/settings');
  await settle(page);
  await page.getByRole('button', { name: /Continue with Google/ }).click();
  await expect.poll(() => authorize, { timeout: 10_000 }).toContain('provider=google');

  await page.goto('/settings');
  await settle(page);
  await page.getByLabel('Email', { exact: true }).fill('learner@example.com');
  await page.getByLabel('Password', { exact: true }).fill('Correct-Horse-9');
  const token = page.waitForRequest('**/auth/v1/token*');
  await page
    .getByRole('button', { name: /^Sign in$/ })
    .last()
    .click();
  await token;
  expect(violations).toEqual([]);
});

test('a signed-in account shows its provider avatar', async ({ page }) => {
  const violations = await watchCsp(page);
  let avatarRequested = false;
  await page.route('https://avatars.githubusercontent.com/**', route => {
    avatarRequested = true;
    return route.fulfill({ status: 200, contentType: 'image/png', body: PIXEL });
  });
  /* A session supabase-js accepts without a refresh: unexpired, with a user. */
  await page.addInitScript(() => {
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const user = {
      id: '00000000-0000-0000-0000-000000000001',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'learner@example.com',
      app_metadata: { provider: 'github' },
      user_metadata: { avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4', full_name: 'Lea Lerner' },
      created_at: '2026-01-01T00:00:00Z'
    };
    const payload = btoa(JSON.stringify({ sub: user.id, exp: expiresAt, role: 'authenticated' }));
    localStorage.setItem(
      'telcTrainerAuth',
      JSON.stringify({
        access_token: `e30.${payload}.sig`,
        refresh_token: 'stub',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: expiresAt,
        user
      })
    );
  });
  await page.goto('/');
  await settle(page);
  await expect.poll(() => avatarRequested, { timeout: 10_000 }).toBe(true);
  expect(violations).toEqual([]);
});

test('Hören plays through speech synthesis', async ({ page }) => {
  const violations = await watchCsp(page);
  await page.goto(`${DTZ.basePath}/exam/1/hoeren`);
  await page.getByRole('button', { name: /^Start Hören/ }).click();
  await expect(page.getByRole('timer')).toBeVisible();
  /* The headless voice list may be empty; the Play button is still the real playback path. */
  const play = page.getByRole('button', { name: 'Play' }).first();
  if (await play.isEnabled()) await play.click();
  await page.waitForTimeout(300);
  expect(violations).toEqual([]);
});

test('Sprechen records from the microphone and plays the blob back', async ({ page }) => {
  const violations = await watchCsp(page);
  /* Headless Chromium on macOS never settles getUserMedia, even with the fake device. A Web
     Audio stream stands in for the microphone: MediaRecorder, the blob: URL and its <audio>
     playback — what the CSP governs — stay real. */
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext();
      const tone = context.createOscillator();
      const sink = context.createMediaStreamDestination();
      tone.connect(sink);
      tone.start();
      return sink.stream;
    };
  });
  await page.goto(`${DTZ.basePath}/exam/1/sprechen`);
  await page.getByRole('button', { name: /^Start Sprechen/ }).click();
  await page
    .getByRole('button', { name: /^Record$/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /^Stop$/ }).first()).toBeEnabled();
  await page.waitForTimeout(500);
  await page
    .getByRole('button', { name: /^Stop$/ })
    .first()
    .click();
  const recording = page.getByLabel('Your recording').first();
  await expect(recording).toHaveAttribute('src', /^blob:/);
  /* Loading the blob is what media-src governs. */
  await expect
    .poll(() => recording.evaluate(audio => audio.readyState), { timeout: 10_000 })
    .toBeGreaterThan(0);
  expect(violations).toEqual([]);
});

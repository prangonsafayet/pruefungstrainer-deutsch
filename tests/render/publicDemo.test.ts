import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DATENSCHUTZ_PATH, IMPRESSUM_PATH, INDEPENDENCE_DISCLAIMER } from '@shared/config/legal.ts';

import { captureErrors, mount, seedProgress } from './harness.ts';

/* The public deployment is built with no Supabase values (vitest runs with `envDir: false`,
   so this suite sees exactly that build). It must work fully, offer no way to sign in or sign
   up, say once that sync exists for self-hosters, and carry the legal pages and the
   independence notice. */

let errors: ReturnType<typeof captureErrors>;

beforeEach(() => {
  localStorage.clear();
  seedProgress({ daysUntilExam: 30 });
  errors = captureErrors();
});

afterEach(() => {
  errors.restore();
});

const SIGN_IN = /sign in|sign up|log in|create an account|continue with (google|github)/i;

describe('local-only build', () => {
  it.each(['/', '/b1', '/settings'])('%s offers no sign-in or sign-up entry point', async route => {
    const page = await mount(route);
    const controls = [...page.container.querySelectorAll('a, button')].map(el => el.textContent);
    expect(controls.filter(text => SIGN_IN.test(text))).toEqual([]);
    expect(errors.real()).toEqual([]);
    await page.unmount();
  });

  it('says in Settings that sync is available when self-hosting, without the env diagnosis', async () => {
    const page = await mount('/settings');
    expect(page.text()).toMatch(/Local-only mode/);
    expect(page.text()).toMatch(/self-host/);
    expect(page.text()).not.toMatch(/VITE_SUPABASE_URL/);
    await page.unmount();
  });
});

describe('legal pages and the independence notice', () => {
  it.each([
    [IMPRESSUM_PATH, /Angaben gemäß § 5 DDG/],
    [DATENSCHUTZ_PATH, /Hosting und Server-Logfiles/]
  ])('%s is deep-linkable and renders its page', async (route, heading) => {
    const page = await mount(route);
    expect(page.text()).toMatch(heading);
    expect(errors.real()).toEqual([]);
    await page.unmount();
  });

  it.each(['/', '/b2/learn', '/settings'])('%s links both legal pages from the footer', async route => {
    const page = await mount(route);
    const footer = page.container.querySelector('footer');
    expect(footer?.querySelector(`a[href="${IMPRESSUM_PATH}"]`)).not.toBeNull();
    expect(footer?.querySelector(`a[href="${DATENSCHUTZ_PATH}"]`)).not.toBeNull();
    expect(footer?.textContent).toContain(INDEPENDENCE_DISCLAIMER);
    await page.unmount();
  });

  it('repeats the independence notice in Settings', async () => {
    const page = await mount('/settings');
    const main = page.container.querySelector('main');
    expect(main?.textContent).toContain(INDEPENDENCE_DISCLAIMER);
    await page.unmount();
  });

  it('never calls the product telc', async () => {
    const page = await mount('/');
    expect(document.title).not.toMatch(/telc/i);
    expect(page.container.querySelector('footer')?.textContent).toMatch(/^Prüfungstrainer Deutsch/);
    await page.unmount();
  });
});

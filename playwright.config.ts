import { defineConfig, devices } from '@playwright/test';

/* Real-browser tests. These complement the Vitest suites in tests/: happy-dom can prove
   structure and behaviour but never layout, CSS or animation, so anything visual belongs
   here. The dev server is started automatically. */
export default defineConfig({
  testDir: './e2e',
  /* Run against the built site with its real headers: playwright.csp.config.ts and
     playwright.offline.config.ts (the dev server has no service worker). */
  testIgnore: ['csp.spec.js', 'offline.spec.js'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    /* iPad portrait on Chromium (the iPad presets default to WebKit, which CI does not
       install): the 640–1023px band, touch and all. */
    {
      name: 'tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    },
    /* iPad landscape: the first width the Learn tab puts its cheatsheets beside the plan. */
    {
      name: 'tablet-landscape',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    }
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    /*
     * Never inherit a server. A dev server left over from an earlier run keeps a module
     * graph and an optimized-dependency set from before the current checkout, which
     * renders a blank page and fails every test for reasons that have nothing to do with
     * the code under test. Paying a few seconds of startup is worth not chasing that.
     */
    reuseExistingServer: false,
    timeout: 120_000,
    /*
     * The same environment on every machine. `E2E_DEV_SERVER` makes vite.config.ts skip `.env`
     * files (and file watching / HMR), so a developer's real Supabase project or LanguageTool
     * flag cannot change what the specs see, and an edit mid-run cannot reload a page; the values below are the obviously-fake ones CI's e2e job sets, which
     * auth.spec.js and signup.spec.js need (they stub every Supabase auth request). Not a
     * credential — never replace it with one.
     */
    env: {
      E2E_DEV_SERVER: '1',
      VITE_SUPABASE_URL: 'https://e2e-not-a-real-project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'sb_publishable_e2e_not-a-real-key_000000000000',
      VITE_AUTH_PROVIDERS: 'google,github',
      VITE_SITE_URL: 'http://localhost:5173',
      VITE_DYNAMIC_FEEDBACK: '',
      VITE_LANGUAGETOOL_URL: ''
    }
  }
});

import { defineConfig, devices } from '@playwright/test';

/* `npm run test:csp`: the production build served with its real `_headers` (CSP, HSTS, …) by
   scripts/serve-dist-with-headers.mjs, because neither the dev server nor `vite preview`
   applies them. Needs a fresh `npm run build` first. One desktop project: the policy does not
   depend on the viewport. */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'csp.spec.js',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'on-first-retry'
  },
  projects: [{ name: 'csp', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/serve-dist-with-headers.mjs --port 4174',
    url: 'http://localhost:4174',
    reuseExistingServer: false,
    timeout: 30_000
  }
});

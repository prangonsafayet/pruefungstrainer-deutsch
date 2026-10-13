import { defineConfig, devices } from '@playwright/test';

/* `npm run test:offline`: the production build — the only one with a service worker — served
   with its real `_headers` by scripts/serve-dist-with-headers.mjs, then taken offline. Needs
   a fresh `npm run build` first. Desktop and phone: an installed PWA is mostly a phone thing. */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'offline.spec.js',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://localhost:4175',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ],
  webServer: {
    command: 'node scripts/serve-dist-with-headers.mjs --port 4175',
    url: 'http://localhost:4175',
    reuseExistingServer: false,
    timeout: 30_000
  }
});

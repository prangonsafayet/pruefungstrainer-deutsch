import { defineConfig } from 'vitest/config';

import { appDefines, LAYER_ALIASES } from './vite.config.ts';

/**
 * Two projects, because the two kinds of test want different worlds:
 *
 *   logic   pure functions — the schedule engine, date maths, response interpretation.
 *           No DOM, no React, so they run in plain Node and finish in milliseconds.
 *   render  the app mounted for real, to prove a page renders what it claims. happy-dom
 *           supplies the document; anything that needs a genuine browser (layout, audio,
 *           pointer behaviour) belongs in the Playwright suite instead.
 */
/* No `.env` loading in tests. A developer's `.env` (Supabase configured) used to switch sync
   on under Vitest, so the auth paths ran and were covered locally but not in CI, which has
   no `.env` — the same commit measured 81.7% lines on a laptop and 80.6% in CI. Every
   environment now runs the suites exactly as CI does. */
const NO_DOTENV = { envDir: false } as const;

export default defineConfig({
  ...NO_DOTENV,
  resolve: { alias: LAYER_ALIASES },
  define: appDefines(''),
  test: {
    restoreMocks: true,
    /* `npm run test:coverage`: the logic layer only — libs and hooks, where behaviour lives.
       Components are visual (lint-enforced) and proven by the render and e2e suites. The
       thresholds sit just under the measured numbers, so coverage can only ratchet up: raise
       them when it does. */
    coverage: {
      provider: 'v8',
      include: ['src/**/lib/**/*.{ts,tsx}', 'src/**/hooks/**/*.{ts,tsx}', 'src/**/use*.tsx'],
      exclude: ['src/content/**', 'src/shared/ui/**', 'src/**/types/**'],
      reporter: ['text-summary', 'html'],
      thresholds: { lines: 82, functions: 83, branches: 65, statements: 80 }
    },
    projects: [
      {
        ...NO_DOTENV,
        resolve: { alias: LAYER_ALIASES },
        test: {
          name: 'logic',
          /* `.js` as well as `.ts`: a suite that has to import a file outside
             `tsconfig.app.json` — `vite.config.ts` belongs to the Node project — cannot be
             `.ts`, because tsc refuses the cross-project import (TS6307). Plain JS is how
             the e2e specs solve the same problem. */
          include: ['tests/unit/**/*.test.{ts,js}'],
          environment: 'node',
          /* The content files are large; a slow first import is not a hanging test. */
          testTimeout: 20_000
        }
      },
      {
        ...NO_DOTENV,
        resolve: { alias: LAYER_ALIASES },
        define: appDefines(''),
        test: {
          name: 'render',
          include: ['tests/render/**/*.test.ts'],
          environment: 'happy-dom',
          setupFiles: ['tests/render/setup.ts'],
          /* Routes are lazily loaded, so a first render pulls a chunk from disk. */
          testTimeout: 30_000
        }
      }
    ]
  }
});

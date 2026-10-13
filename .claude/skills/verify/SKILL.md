---
name: verify
description: Run this project's full verification pipeline (typecheck, zero-warning lint, format check, guards, exam-data validation, vitest, Playwright) and report what failed. Use before committing, after a refactor, or when asked whether the app still works.
---

# Verify

Run these in order and **stop at the first failure** — later stages are meaningless if
typecheck is broken.

```bash
npm run typecheck                    # tsc -b --noEmit
npm run lint -- --max-warnings=0     # ESLint, zero tolerance (warnings are failures)
npm run format:check                 # Prettier
npm run guards                       # architecture, CSS tokens, storage keys, hook tests, prod audit
npm run validate                     # every trainer's exam data files
npm run test:unit                    # vitest: logic + render projects
npm run test:e2e                     # Playwright, Chromium + mobile
```

`npm test` chains typecheck, lint, validate and test:unit. Offline, use `npm run guards:offline`
(it skips only the registry audit). Playwright needs browsers once:
`npx playwright install chromium`.

## Interpreting failures

- **Typecheck** — fix the types. No `any`, no non-null assertion, no looser tsconfig. Third-party
  props lacking `| undefined` get `optional()` from `@shared/lib/optionalProps.ts`.
- **Lint** — import order and formatting are `--fix`able. Boundary violations
  (`no-restricted-imports`), components-visual-only and raw-colour hits are design problems:
  move logic into a hook, shared things into `src/shared`, colours into tokens.
- **guards** — `check:storage-keys` failing is user-data loss: stop. `check:architecture`
  names tree violations: an `index.*` barrel, a `routes/` folder, a feature without `pages/`, a
  component not in its own folder, a `use*.ts` hook (hooks are `.tsx`), a feature importing
  another, or a duplicated component name. `test:hooks` failing means a Claude Code hook regressed.
- **A rendered route with ~8 characters of text** means the Suspense fallback never cleared —
  usually an import cycle, not a slow chunk.
- **Playwright only** failing, with vitest green, points at layout, CSS, animation or real
  navigation. Read the trace.

## Reporting

State which stages passed and which failed, with the actual output for failures. If everything
passes, say so, and note that appearance is only verified as far as Playwright asserts it.

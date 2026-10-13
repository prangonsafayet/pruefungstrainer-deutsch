---
paths:
  - 'tests/**'
  - 'e2e/**'
  - 'vitest.config.ts'
  - 'playwright.config.ts'
---

# Testing

Two layers, both required, because they catch different things.

## Vitest — `tests/`

One command, two projects (`vitest.config.ts`). Neither loads `.env` (`envDir: false`), so a
local Supabase config cannot change what runs or what is covered:

| Project  | Where           | Environment | For                                                     |
| -------- | --------------- | ----------- | ------------------------------------------------------- |
| `logic`  | `tests/unit/`   | node        | pure functions — no DOM, no React, milliseconds         |
| `render` | `tests/render/` | happy-dom   | the app mounted for real, to prove a page renders right |

```bash
npm run test:unit    # both projects
npm run test:coverage # both projects + the lib/hook coverage gate (CI runs this)
npm run test:logic   # just the pure logic
npm run test:render  # just the mounted pages
npm run test:watch   # vitest in watch mode
```

Tests live under `tests/`, never beside the code, even though a component's own hooks and
utils sit in its folder. There are no barrels, so a suite imports (and `vi.mock`s) the file
itself, by its full alias path and extension —
`@shared/progress-store/lib/progressDb.ts`,
`@features/dashboard/pages/DashboardPage/dashboardModel.ts`,
`@shared/account-sync/hooks/useCloudSync.tsx` (hooks are `.tsx`). A `vi.mock` path that no
longer names a file mocks nothing and fails silently: after moving a file, grep `tests/` for
its old path.

| Suite                        | Covers                                                                                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `unit/schedule`              | the plan engine, swept across all 86 plannable runways                                                                                                                                                                   |
| `unit/distribute`            | the bucketing helpers the engine compresses with                                                                                                                                                                         |
| `unit/format`                | date maths, including DST and leap days                                                                                                                                                                                  |
| `unit/signUpOutcome`         | every shape Supabase's sign-up response can take                                                                                                                                                                         |
| `unit/content`               | curriculum and exam-list shape the engine trusts                                                                                                                                                                         |
| `unit/runStore`              | the run in progress, in both storage shapes it has had                                                                                                                                                                   |
| `unit/contentChunks`         | the module graph — importing the registry never touches any trainer's content, and resolving one trainer's `loadContent()` never touches another's                                                                       |
| `unit/singleLevelScoring`    | the telc B1/B2 marking scheme (Lesen/Sprachbausteine/Hören/Schreiben/Sprechen) against the verified official points                                                                                                      |
| `unit/dtzScoring`            | the DTZ marking: level boundaries, all 27 certificate combinations (5 B1, 11 A2), X, item numbering 1–45                                                                                                                 |
| `unit/srs`                   | the spaced-repetition engine and the daily streak, both pure functions of an explicit `today`                                                                                                                            |
| `unit/quiz`                  | generated quiz questions are well-formed across every item shape, including its random branches                                                                                                                          |
| `unit/weakness`              | every weakness category resolves to a real cheatsheet, or an explicit empty list, on every trainer                                                                                                                       |
| `unit/errorReport`           | a LanguageTool match maps to the right weakness category and issue type                                                                                                                                                  |
| `unit/languageToolClient`    | the dynamic-feedback client — its feature flag and its base URL are independent switches                                                                                                                                 |
| `unit/mergeProgress`         | cloud sync's field-by-field merge plus a runtime enumeration of the document's fields, so nothing is silently dropped                                                                                                    |
| `unit/weaknessProfile`       | the running record of what a learner gets wrong — additive per session, deterministic to rank                                                                                                                            |
| `unit/dashboardModel`        | dashboard meters, their heading and weak-area detection against each paper's own pass line, not the other paper's                                                                                                        |
| `unit/attemptSummary`        | the pass line a results screen marks its bars at, per paper — the bar primitive used to default it to the A2·B1 paper's                                                                                                  |
| `unit/examConditions`        | which exam-condition numbers the copy may call telc's and which it must call the app's own                                                                                                                               |
| `unit/attemptTable`          | one column header per cell in the attempts table, on both papers, and none of them unnamed                                                                                                                               |
| `unit/progressDb`            | a fresh trainer document takes its writing time from its own paper rather than a constant                                                                                                                                |
| `unit/referenceSearch`       | the five reference-table filters, which search a different set of fields per table                                                                                                                                       |
| `unit/siteMeta`              | every trainer's namespace reaches the emitted sitemap, and its attempt screens the robots.txt                                                                                                                            |
| `unit/trainerRegistry`       | the Node-side text parse of the registry, field-for-field against the real `TRAINERS`                                                                                                                                    |
| `unit/timerAnnouncements`    | the spoken exam clock: exactly 10/5/1 minutes on fake timers, never between, never the threshold a module starts on                                                                                                      |
| `unit/appShell`              | the header countdown's tone at both edges of the 14-day window and past dates, each trainer's nav tabs, the phone tab-bar split, exam-mode routes, the offline badge                                                     |
| `unit/meterTone`             | a results bar is green at or above its pass line, amber/red below, and a dashboard bar stays primary                                                                                                                     |
| `unit/productionChecks`      | the `_headers` parser, CSP inline-script hashing, the bundle budget, `sw.js` no-cache, the manifest's icons and shortcuts                                                                                                |
| `unit/appError`              | `toAppError` classifies quota, stale chunks (all three browser wordings) and dead networks; `tryCatch` never throws or rejects                                                                                           |
| `unit/logger`                | redaction (email, JWT, Supabase key, bearer, `code=`/`password=`), the 100-entry bound, the sessionStorage mirror, and that an arbitrary object (answers) is never serialised                                            |
| `unit/storage`               | quota and blocked writes return a typed failure and notify listeners; a failed write is read back from memory, not the stale disk value                                                                                  |
| `unit/staleChunk`            | the reload-once guard on a fake storage and clock: one reload per window, none in an exam sitting, none for a future timestamp                                                                                           |
| `unit/syncError`             | offline, RLS / dead session, rate limit and generic sync failures map to the right learner message                                                                                                                       |
| `render/errorHandling`       | damaged progress on boot (notice + download, app usable), a full quota (toast exporting the live document), Copy diagnostics, the play budget with no speech synthesis, a blocked microphone                             |
| `render/globalErrors`        | window `error` / `unhandledrejection` reach the log; `vite:preloadError` reloads once and lets the second one through; no reload without sessionStorage                                                                  |
| `render/copyToClipboard`     | a rejected or missing clipboard ends in "Copy failed" and a toast, never an unhandled rejection                                                                                                                          |
| `render/errorBoundary`       | the crash fallback (never the raw message), "Try again", the reset on route change, the stale-chunk Reload (once, never in an exam), and a failed content load retried afresh                                            |
| `render/routes`              | every route of every trainer mounts with no React warning — generated from `TRAINER_ORDER`                                                                                                                               |
| `render/readableColors`      | the four call sites that render a domain colour as ink or as a mark pick the readable token                                                                                                                              |
| `render/contentInjection`    | authored HTML is injected, never shown as text                                                                                                                                                                           |
| `render/authVisibility`      | the signed-out warnings appear everywhere                                                                                                                                                                                |
| `render/examDate`            | the date window is enforced, not merely suggested                                                                                                                                                                        |
| `render/examFlow`            | a full attempt on the dual-level paper, including a mid-module reload                                                                                                                                                    |
| `render/examFinish`          | the finish path acts on submit, not inside a state updater                                                                                                                                                               |
| `render/examBinding`         | a trainer's paper, papers and store survive a progress write that does not touch the exam                                                                                                                                |
| `render/selfRating`          | the ×3 self-rating maths, against each productive module's own maximum on both papers                                                                                                                                    |
| `render/schedulePlan`        | the pages re-shape with the exam date, all fallbacks included                                                                                                                                                            |
| `render/practiceHub`         | flashcard and quiz answers write a real SRS transition into a trainer's own document slice, swept over every single-level trainer                                                                                        |
| `render/dtzExamFlow`         | a full DTZ sitting through the mounted app, X in Lesen Teil 2, ending on a certificate; the missing Sprachbausteine route goes home                                                                                      |
| `render/singleLevelExamFlow` | the single-level equivalent of `examFlow` — a full attempt including a mid-module reload, swept over every single-level trainer                                                                                          |
| `render/startAttempt`        | a curriculum Go link asks before replacing a run in progress — both choices — and resumes the very same module without asking                                                                                            |
| `render/appShell`            | `useActiveTrainer` reads and switches every trainer from its URLs; the layout shows the exam countdown, puts the skip link first, scrolls to the top and moves focus to the new `<h1>` (and the tab title) on navigation |
| `render/updatePrompt`        | the service-worker store's states; the update toast with a Reload that sends skip-waiting — never in an exam sitting, back when it ends; no reload on a takeover mid-exam                                                |

**No jsdom.** happy-dom provides `matchMedia`, both observers, `scrollIntoView` and pointer
capture; `tests/render/setup.ts` only adds React's act flag and the in-memory `Storage` from
`tests/support/memoryStorage.ts` — happy-dom ships none, and without it every persistence
assertion passes vacuously. The **logic** project installs the same storage wherever a suite
persists (`unit/runStore`): Node 22+ exposes `localStorage` as an experimental getter, reading
it warns, and `@shared/lib/storage.ts` silently degrades to its fallback. Install it, never
probe for it — `typeof globalThis.localStorage` is itself what triggers the warning.

`mount()` in `tests/render/harness.ts` waits for `aria-busy` to clear rather than sleeping. A
route rendering ~8 characters means the Suspense fallback never cleared — usually an import
cycle. Content loads through `@shared/hooks/useTrainerContent.tsx` (imported by file), which
suspends on `loadContent()`, so `mount()`'s wait covers it; a fixed timeout would flake.

The harness exists so you do not re-learn:

- `seedProgress({ daysUntilExam })` writes the document **before** mounting, relative to today.
- `typeInto()` uses the native value setter — assigning `element.value` is swallowed by React.
- `blur()` dispatches `focusout`, which is what React's `onBlur` listens to.
- The setup clears `document.body` after every test.

**Run the render project from the main checkout, not a worktree.** A worktree under
`.claude/worktrees/` resolves a second React and fails with
`Cannot read properties of null (reading 'useCallback')`. Worktrees are fine for content and pure-logic work.

In `tests/`, annotate the functions, not a record of functions: the `node-tooling` lint entry
uses base `no-unused-vars`, which reports parameter names inside function types.

## Playwright — `e2e/`

Layout at three breakpoints, dark-mode persistence, real reloads, popover positioning, and
network-level stubbing (sign-up specs stub Supabase). Three projects: `chromium` (desktop),
`mobile` (Pixel 7) and `tablet` (iPad portrait 768×1024 on Chromium, touch). The smoke spec's
no-overflow check runs at 360, 768, 1024 and 1280.
`e2e/singleLevelTrainers.spec.js` takes its trainer list from `scripts/trainerRegistry.mjs`
(every non-root trainer). `e2e/dtzTrainer.spec.js` covers the DTZ end to end and stubs
`speechSynthesis` with one German voice so Hören takes the real playback path.
`e2e/contrast.spec.js` and `e2e/reducedMotion.spec.js`: see the ui-design-system rule.
`e2e/a11y.spec.js` runs axe (WCAG 2.2 AA tags) over every route of every trainer, a runner,
results and review per format, light and dark, on chromium + mobile: zero serious/critical,
moderate/minor printed. `e2e/keyboardOnly.spec.js` (chromium) reaches, answers and submits a
Lesen Teil per format and drives a flashcard and a quiz with keys only. Radix radio groups
select on the roving-focus tick, so an arrow must be held (`keyboard.down`, wait for focus,
`up`) — an instant `press` releases before the tick.
`e2e/errorHandling.spec.js` 404s a lazy chunk after first load (one reload, then the fallback —
never a loop; none during an exam sitting) and boots on damaged `telcTrainerV1`.
`e2e/csp.spec.js` is not in the main config: `npm run test:csp` runs it against the built site
served with its real `_headers` (see the tooling-ci rule). Nor is `e2e/offline.spec.js`:
`npm run test:offline` (chromium + mobile) installs the service worker, goes offline, loads
every trainer's dashboard, Learn and Practice, sits and submits a DTZ Lesen module and reloads
it; and ships a changed `sw.js` to see the update prompt, held back in an exam sitting.
react-day-picker marks month navigation with `aria-disabled` but day cells with both
`data-disabled` and a real `disabled` — assert the right one. For interactive checks use the
**Playwright MCP** instead of a throwaway spec.

## Rules

- A bug fix ships with a regression test in the layer that would have caught it — and you have
  watched it fail with the bug re-introduced.
- Appearance claims need Playwright or a real browser, never a unit test.
- Assert on roles, not classes (the timer is `getByRole('timer')`).
- Prefer a parameterised sweep over a spot check when the input is a range.
- A test that depends on an emulated environment asserts the emulation; one that needs seeded
  state asserts the state arrived (count the bars).
- When two cases differ only sometimes, the fixture must hit a case where they differ. A
  "keeps what was there" test needs something already there.
- When asserting generated copy, match a phrase only the failing branch prints, and pin the
  number next to it. Prove a guard in a narrow range with a fixture inside that range.
- An update queued inside a state updater runs eagerly when nothing is pending: queue one first,
  then assert the observable consequence, not the absence of a warning.

# Architecture

```
src/app        composition root ONLY — main.tsx, router.tsx, providers/AppProviders.tsx.
               May import anything. No components, hooks or logic of its own.
src/features   vertical slices, one per screen family: pages/ (screens), components/,
               hooks/, lib/, types/. A feature imports ONLY itself, @shared and @content —
               never another feature. The header, nav, layout and 404 page are app-shell.
src/shared     everything two or more features use: ui/ primitives (vendored shadcn),
               components/, flat hooks/ lib/ config/ types/ providers/, and the
               cross-feature domains — progress-store/, study-schedule/, account-sync/,
               exam-run/, writing-feedback/ — each keeping its own components/ hooks/ lib/.
src/content    inert data, keyed by trainer: content/<id>/ holds that trainer's exams
               (exams/allExams.ts), curriculum, vocabulary bank and guide HTML, gathered in
               content/<id>/content.ts; content/trainerContent.ts is the eager, test-only
               TRAINER_CONTENT module. Content imports nothing but @shared/types.
```

There are **no barrels** anywhere in `src/` — no `index.ts`, no folder imports. Every import
names the file that defines the thing, with its extension: `@shared/ui/button.tsx`,
`@shared/types/exam.ts`, `@shared/components/data-display/ScoreMeter/ScoreMeter.tsx`.

## Folder per component

Every component — and every page — lives in a folder named after it, together with everything
only it uses:

```
src/features/dashboard/
  pages/
    DashboardPage/
      DashboardPage.tsx        the screen (default export, visual only)
      useDashboardStats.tsx    its hook — hooks are .tsx
      dashboardModel.ts        its pure model
      examCards.ts
  components/
    TodayPlanCard/TodayPlanCard.tsx
    DashboardExamCard/DashboardExamCard.tsx
  hooks/useTodayPlan.tsx       used by TodayPlanCard AND DashboardPage, so it stays here
  types/dashboard.ts           used across the feature
src/shared/components/data-display/ScoreMeter/ScoreMeter.tsx
```

A module used by exactly one component moves into that component's folder; one used by
several stays in the feature's (or domain's) `hooks/`, `lib/`, `types/` or `config/`. Group
folders (`components/sync/`, `components/modules/dtz-paper/`) are kebab-case and hold component
folders, never a loose `.tsx`. `src/shared/ui` is the one exception: the shadcn CLI writes flat
kebab-case files there. `src/shared/hooks` and `src/shared/lib` stay flat files. Tests stay
under `tests/`, never beside the code.

## One registry, peer trainers

The trainers (A2·B1, B1, B2 and DTZ) are peers described once in
`shared/config/trainers.ts`: one `TRAINERS` descriptor per trainer names its identity, route
namespace, paper, progress slice and lazily-loaded content. That is the only place a
per-trainer fact may live. A `no-restricted-syntax` rule refuses a trainer id anywhere else in
`src/` as a value (`mode === 'b1'`), an object key (`{ b1: … }`) or a property read
(`db.b1`). Type-level uses are not matched, so the unions that DEFINE the ids and
`ProgressDatabase`'s fields still declare theirs. Exempt: the registry, `src/content/**`,
`shared/progress-store/lib/progressDb.ts` and `shared/account-sync/lib/mergeProgress.ts`. `eslint.config.js` names no id —
`scripts/trainerRegistry.mjs` reads them from the registry (as text, because the eslint
config, `vite.config.ts`, `tests/render/routes.test.ts` and `e2e/singleLevelTrainers.spec.js`
cannot resolve the layer aliases); `tests/unit/trainerRegistry.test.js` checks that parse.
Every screen, route, hook and nav item is generated from `TRAINER_ORDER`.

Adding a trainer on an existing paper is seven edits plus two tests; a new paper is much
larger. The measured lists live in the `new-trainer` skill — use it, do not re-derive them.

`features/mock-exam` runs every mock exam of every trainer: runner shell, results and review
screen, driven by a format descriptor per paper (see the exam-formats rule). The run store and
the run formats a dashboard needs to start, resume or discard a run live in `shared/exam-run`.
`features/vocab-practice` drills every trainer's vocabulary bank.

## Dependency rules are ESLint rules

- **A feature never imports another feature** — not its components, hooks, libs or types. It
  MAY deep-import itself through its own alias (`feature-isolation-<name>`, one generated
  entry per feature directory). Anything a second feature needs moves to `src/shared`: that
  is why the progress store, the study schedule, account sync and the exam-run machinery are
  shared domains rather than features.
- A feature must not import `@app/**`. `src/shared` must not import features or the app.
  `src/content` imports `@shared/types/*` and nothing else.
- No barrels and no folder imports: an alias import with no file extension
  (`@shared/ui`, `@features/dashboard`) and any `…/index` are refused (`NO_BARRELS`), and
  `check-file/no-index` refuses an `index.*` file.
- Primitives come from their file in `src/shared/ui`.
- Relative imports climb at most one level; `../../` must use an alias.
- Module renderers are imported only by their own format's `lib/formats/<format>/format.ts`
  (`exam-modules-through-format`).

These patterns are `no-restricted-imports` / `no-restricted-syntax`, and both are
_configured, not accumulated_: when two flat-config entries set the same rule for a file, the
later one replaces the earlier one's options. Every entry restates every pattern that applies
to its files; dropping one is silent. After editing them, re-prove each rule with a planted
violation (both `a` and `a/b` forms for a `/**` pattern) and delete the plant.

## Tree rules are `npm run check:architecture`

`scripts/check-architecture.mjs` checks what a file-at-a-time linter cannot: no `index.*` under
`src/`; no `routes/` folder (screens live in `pages/`); every feature has `pages/` (a folder with
no screen belongs in `src/shared`); every `PascalCase.tsx` under `components/` or `pages/` sits in
a folder of its own name, never loose; a PascalCase folder is always such a component folder;
no `use*.ts` (hooks are `.tsx`); no feature imports another; and **one name, one component** — no
two `.tsx` files share a basename. A shared name across features is usually one component
written twice — move it to `src/shared/components`; otherwise rename so the file says what it is
(`DualLevelLesenModule`, `ScoreMeter`, `SyncSignInCard`).

## Where things go

| Kind                          | Location                                         | Example                                       |
| ----------------------------- | ------------------------------------------------ | --------------------------------------------- |
| Screen                        | `features/<f>/pages/<Page>/`                     | `DashboardPage/DashboardPage.tsx`             |
| A screen's own hook / model   | beside it, in `pages/<Page>/`                    | `DashboardPage/useDashboardStats.tsx`         |
| Feature-private component     | `features/<f>/components/[<group>/]<Name>/`      | `DashboardExamCard/DashboardExamCard.tsx`     |
| A component's own hook / util | beside it, in its folder                         | `AudioSettingsCard/useAudioSettings.tsx`      |
| Logic used across one feature | `features/<f>/{hooks,lib,types,config}/`         | `mock-exam/hooks/useExamBinding.tsx`          |
| Anything two features use     | `shared/<domain>/` or flat `shared/{hooks,lib}/` | `shared/progress-store/hooks/useProgress.tsx` |
| Cross-feature component       | `shared/components/[<group>/]<Name>/`            | `data-display/ScoreMeter/ScoreMeter.tsx`      |
| Design-system primitive       | `shared/ui/` (shadcn CLI writes here, flat)      | `button.tsx`                                  |
| Domain type                   | `shared/types/`                                  | `exam.ts`, `progress.ts`                      |
| Shared constant               | `shared/config/`                                 | `exam.ts`, `appInfo.ts`                       |
| App chrome (header, nav, 404) | `features/app-shell/`                            | `components/BottomTabBar/BottomTabBar.tsx`    |
| Exam or study content         | `content/<id>/`                                  | `a2b1/exams/exam07.ts`                        |

## Shared domains

- `shared/progress-store/` — the persisted document: `providers/ProgressProvider.tsx`,
  `hooks/useProgress.tsx`, `useTrainerSlice.tsx`, `useProgressBackup.tsx`, `lib/progressDb.ts`,
  `lib/importProgress.ts`.
- `shared/account-sync/` — auth and cloud sync: `AccountMenu` (read by app-shell), `SyncPanel`
  (read by settings), `hooks/useCloudSync.tsx`, `useSync.tsx`, `lib/mergeProgress.ts`,
  `lib/supabaseClient.ts`.
- `shared/exam-run/` — what starts, resumes and discards a run: `lib/runStore.ts`,
  `lib/runFormats.ts` and one `<format>RunFormat.ts` per paper, `hooks/useStartAttempt.tsx`,
  `types/run.ts`, `types/examFormat.ts`, `config/run.ts`. Read by mock-exam, dashboard and
  settings.
- Error handling (flat `shared/lib/`): `appError.ts` (the `AppError` shape, `toAppError`,
  `Result`, `tryCatch`), `logger.ts` (local-only, redacted ring buffer), `globalErrors.ts`
  (window `error` / `unhandledrejection` / `vite:preloadError`, and the boundaries' `onError`),
  `staleChunk.ts` (the reload-once guard). `components/ErrorBoundary` wraps the app root and
  every route (in the layout, reset by the path); `components/ErrorFallback` is what it shows.
- `shared/writing-feedback/lib/` — the writing rubric, error report, Leitpunkte and weakness
  profile (no screen yet; covered by unit tests).
- `shared/study-schedule/` — below.

## The `study-schedule` domain

Owns the adaptive schedule; dashboard, curriculum, settings and vocab-practice read it from
`@shared/study-schedule/…`. `lib/buildSchedule.ts` is a pure function of (exam date, today,
finished lessons, taken exams) and reads no clock. `lib/distribute.ts` holds the bucketing
helpers, `lib/describeSchedule.ts` every user-facing string about the plan.
`hooks/useTrainerSchedule.tsx` / `hooks/useToday.tsx` are the React surface. The schedule is
derived on render and **never persisted**; its inputs (`settings.examDate`, `learnDone`,
`attempts`) are the only stored state. Constants: `@shared/config/schedule.ts`; types:
`@shared/types/schedule.ts`. Date rules: the dates-timers rule.

## The `app-shell` feature

The chrome around every screen: `components/AppLayout/AppLayout.tsx` (the router's layout
route: skip link, `header`, `main#main`, footer; with its own `useAppLayout.tsx`,
`useHeaderHeight.tsx`, `usePageFocus.tsx` — focus to the new page's `<h1>` and
`document.title` on navigation, never on first load — and `syncStatus.ts`; the runner route
is distraction-free — no nav, switcher, countdown or account menu — as decided by
`@shared/exam-run/lib/examMode.ts`, which the stale-chunk reload guard reads too),
`MainNav` (the pill row, ≥ 640px), `BottomTabBar` (phones: ≤ 5 slots, daily tabs first, the
rest behind a "More" menu), both reading `lib/navEntries.ts`, `TrainerSwitcher`,
`ExamCountdownBadge` (with `useExamCountdown.tsx`
over the pure `examCountdown.ts` — tone: passed → warning, 0–14 days → destructive, else
secondary), `AppFooter`, and `pages/NotFoundPage/NotFoundPage.tsx`. `hooks/useActiveTrainer.tsx`
(the trainer the URL is in, its home, the switch) is shared by MainNav, TrainerSwitcher and the
layout. It reads `@shared/account-sync/…` and `@shared/progress-store/…` and must not import
`@app/**`. The router deep-imports its `AppLayout` and `NotFoundPage` exactly as it does every
other page. Tests: `tests/unit/appShell.test.ts`, `tests/render/appShell.test.ts`.

## Offline, notices and the schedule source

- `src/shared/lib/serviceWorker.ts` registers the PWA service worker (production builds only)
  and holds its status; `src/shared/hooks/useServiceWorkerUpdate.tsx` and the app-shell
  `AppLayout/useUpdatePrompt.tsx` turn a waiting update into a Reload prompt that never
  interrupts an exam sitting. Workbox config lives in `vite.config.ts`.
- `src/shared/progress-store/hooks/useProgressNotices.tsx` shows the storage-full,
  damaged-progress and recovery notices that `progressDb` reports.
- `src/shared/study-schedule/lib/trainerSource.ts` adapts a trainer's slice and content into the
  schedule engine's inputs.

Diagrams, the data model and the decision records behind these rules:
[`docs/architecture/`](../../docs/architecture/README.md).

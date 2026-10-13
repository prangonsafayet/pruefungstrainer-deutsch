# C4 level 3: components

One diagram per area. Each box names the file that defines it, relative to `src/`. The
layer rules apply throughout:

- `app/` composes and may import anything.
- A feature imports only itself, `@shared` and `@content`.
- `shared/` imports no feature.
- `content/` imports only `@shared/types`.

Both ESLint and `npm run check:architecture` enforce these rules.

- [a. App composition](#a-app-composition)
- [b. Mock-exam engine](#b-mock-exam-engine)
- [c. Progress store and account sync](#c-progress-store-and-account-sync)
- [d. Study schedule and curriculum](#d-study-schedule-and-curriculum)
- [e. Vocabulary practice and SRS](#e-vocabulary-practice-and-srs)
- [f. Error handling and observability](#f-error-handling-and-observability)

## a. App composition

```mermaid
C4Component
  title App composition: boot to screen

  Container_Boundary(appLayer, "src/app") {
    Component(main, "main.tsx", "entry", "Installs global error handlers, registers the service worker in production, renders the tree")
    Component(providers, "AppProviders.tsx", "composition root", "ErrorBoundary, ProgressProvider, ConfirmProvider, BrowserRouter, Toaster")
    Component(router, "router.tsx", "AppRouter", "One route tree per trainer from TRAINER_ORDER, plus /settings and 404")
  }

  Container_Boundary(sharedLayer, "src/shared") {
    Component(registry, "config/trainers.ts", "TRAINERS, TRAINER_ORDER", "Every per-trainer fact: id, basePath, paper, format, docKey, loadContent")
    Component(contentHook, "hooks/useTrainerContent.tsx", "use() + promise cache", "Suspends until a trainer's content chunk loads")
    Component(boundary, "components/ErrorBoundary", "react-error-boundary", "At the root and around every route")
    Component(progress, "progress-store/providers/ProgressProvider.tsx", "context", "The persisted document")
  }

  Container_Boundary(shell, "features/app-shell") {
    Component(layout, "AppLayout + useAppLayout.tsx", "layout route", "Header, nav, SyncContext, route ErrorBoundary keyed by path, update prompt")
    Component(activeTrainer, "hooks/useActiveTrainer.tsx", "hook", "Which trainer the URL is in")
    Component(nav, "MainNav, BottomTabBar, TrainerSwitcher", "components", "Read lib/navEntries.ts")
  }

  Component(pages, "Feature pages", "features/*/pages/*Page", "Dashboard eager; Curriculum, Guide, Practice, History, Settings, MockExam* lazy")
  Component(content, "content/{id}/content.ts", "lazy chunk", "Exams, curriculum, guide, vocab")

  Rel(main, providers, "renders")
  Rel(providers, progress, "wraps")
  Rel(providers, router, "children")
  Rel(router, registry, "maps TRAINER_ORDER")
  Rel(router, layout, "layout route")
  Rel(layout, boundary, "wraps Outlet")
  Rel(layout, pages, "Outlet")
  Rel(layout, activeTrainer, "uses")
  Rel(nav, activeTrainer, "uses")
  Rel(pages, contentHook, "useTrainerContent(trainer)")
  Rel(contentHook, registry, "loadContent()")
  Rel(contentHook, content, "import()")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

- **Order matters in `AppProviders`.** The error boundary is outermost, so a crash anywhere
  still renders. The progress provider sits above the router, so navigation never remounts
  it.
- **The router names no trainer.** `trainerRoutes(trainer)` builds a dashboard, `learn`,
  `guide` (only when `hasGuide`), `practice`, `history` and the three exam routes. Every
  page gets `trainer` as a prop.
- **The layout owns cloud sync.** `useAppLayout` calls `useCloudSync` and provides the
  result on `SyncContext`. `AccountMenu` in the header and `SyncPanel` in Settings both read
  it through `useSync`.
- **The runner route is distraction-free.** On it, the layout hides the nav, the trainer
  switcher, the countdown and the account menu. `isExamRunPath` in
  `shared/exam-run/lib/examMode.ts` decides this. The update prompt and the stale-chunk
  guard read the same function.

## b. Mock-exam engine

```mermaid
C4Component
  title Mock-exam engine: one runner, three papers

  Container_Boundary(mock, "features/mock-exam") {
    Component(pagesX, "MockExamRunnerPage, MockExamResultsPage, MockExamReviewPage", "pages", "Take trainer as a prop")
    Component(binding, "hooks/useExamBinding.tsx", "hook", "Trainer to format, papers and attempt store; switch on slice.format")
    Component(runner, "ExamRunnerView + useExamRun.tsx", "state machine", "brief, module, rating; clock; answers; plays; finish")
    Component(dual, "lib/formats/dual-level/format.ts", "DUAL_LEVEL_FORMAT", "A2·B1: 5 modules, sb score, dual verdict")
    Component(single, "lib/formats/single-level/format.ts", "SINGLE_LEVEL_FORMAT", "B1, B2: 5 modules, written + oral parts")
    Component(dtz, "lib/formats/dtz-paper/format.ts", "DTZ_FORMAT", "DTZ: 4 modules, 3 Teilergebnisse, certificate")
    Component(scoring, "formats/*/attempt, scoring, summary, review.ts", "pure", "buildAttempt, summarize, review, countUnanswered")
    Component(renderers, "components/modules/{format}/*Module", "renderers", "One per module per paper; imported only by their format.ts")
    Component(rating, "components/rating/SelfRatingCard", "component + useSelfRating", "Criteria sliders for Schreiben and Sprechen")
    Component(results, "AttemptResults, AttemptReview", "components", "Render AttemptSummary and ReviewSection lists")
  }

  Container_Boundary(examRun, "shared/exam-run") {
    Component(runFormats, "lib/runFormats.ts", "RUN_FORMATS", "Run-only half of each format; runFormatFor, clearAllRuns")
    Component(runStore, "lib/runStore.ts", "createRunStore", "parseRuns, legacy envelopes, one entry per trainer per key")
    Component(start, "hooks/useStartAttempt.tsx", "hook", "Start, resume or confirm-replace a run; used by dashboard and curriculum")
  }

  Component(slice, "progress-store/hooks/useTrainerSlice.tsx", "hook", "settings, attempts, saveAttempt for the trainer's slice")
  Component(examUi, "shared/components/exam-ui/*", "components", "Inputs, gaps, toolbar, CountdownRing, RecorderControls")

  Rel(pagesX, binding, "useExamBinding(trainer)")
  Rel(binding, slice, "reads format, attempts")
  Rel(binding, dual, "picks")
  Rel(binding, single, "picks")
  Rel(binding, dtz, "picks")
  Rel(pagesX, runner, "renders")
  Rel(runner, runStore, "load, save, clear")
  Rel(runner, renderers, "format.moduleComponents[module]")
  Rel(runner, rating, "phase rating")
  Rel(runner, scoring, "buildAttempt at finish")
  Rel(runner, slice, "saveAttempt")
  Rel(pagesX, results, "summarize, review")
  Rel(dtz, runFormats, "spreads DTZ_RUN_FORMAT")
  Rel(runFormats, runStore, "one store per key")
  Rel(start, runFormats, "runFormatFor")
  Rel(renderers, examUi, "imports by file")

  UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
```

The descriptor type is `ExamFormat<TExam, TSettings, TAttempt>` in
`shared/exam-run/types/examFormat.ts`. It extends `ExamRunFormat` (`modules`,
`moduleShort`, `runStore`) with:

- `examLabel`, `moduleName`, `minutes` and `briefing`;
- `rating`: a `RatingSpec` per rated module, with a `stepPoints` override for the unequal DTZ
  oral scales;
- `speakingHint` and `speakingReviewNote`;
- `moduleComponents`: a `Partial` record, because the DTZ has no Sprachbausteine;
- `scoring`: an `ExamScoring` with `countUnanswered`, `buildAttempt`, `summarize`,
  `completionToast`, `review` and `writingSample`.

The runner, the results screen and the review screen exist once and read everything
paper-specific through this object ([ADR 0002](adr/0002-format-descriptors.md)).

The run store is shared, not owned by the feature, because two other features start and
discard runs: the dashboard (`useResumableRun`, `useStartAttempt`) and settings
(`clearAllRuns` on "Delete all progress"). Each paper has its own key, and inside a key
each trainer has its own entry. B1 and B2 share `telcTrainerLevelRunV1` without
overwriting each other.

## c. Progress store and account sync

```mermaid
C4Component
  title Progress store and account sync

  Container_Boundary(store, "shared/progress-store") {
    Component(provider, "providers/ProgressProvider.tsx", "context", "db, dbRef, update(recipe), replaceLocal(next)")
    Component(db, "lib/progressDb.ts", "pure + storage", "loadDatabase, normalizeDatabase, persistDatabase, stamp, releaseDamaged, EMPTY_DATABASE")
    Component(notices, "hooks/useProgressNotices.tsx", "hook", "Damaged-load and storage-failure toasts")
    Component(slice, "hooks/useTrainerSlice.tsx", "hook", "One trainer's slice whatever its docKey; saveAttempt, update, setSetting")
    Component(backup, "hooks/useProgressBackup.tsx + lib/importProgress.ts", "hook + pure", "Export; readBackup Result; per-slice restore plan")
  }

  Container_Boundary(sync, "shared/account-sync") {
    Component(cloud, "hooks/useCloudSync.tsx", "hook", "Session, fullSync, 1500 ms debounced push, OAuth callback, deleteRemote")
    Component(merge, "lib/mergeProgress.ts", "pure", "Field-by-field merge; unknown keys from the newer side")
    Component(client, "lib/supabaseClient.ts", "supabase-js", "PKCE, storageKey telcTrainerAuth; null when not configured")
    Component(syncErr, "lib/syncError.ts", "pure", "classifySyncError to sync-offline, denied, rate-limited, failed")
    Component(ui, "SyncPanel, AccountMenu, PasswordAuthForm", "components", "Read SyncContext via useSync")
  }

  Component(storage, "shared/lib/storage.ts", "Result", "readLocal, writeLocal, in-memory fallback, failure listeners")
  ContainerDb(ls, "localStorage", "telcTrainerV1, telcTrainerRecoveryV1, telcTrainerAuth")
  System_Ext(supa, "Supabase", "public.progress")

  Rel(provider, db, "load once; normalize + stamp + persist per update")
  Rel(provider, notices, "loaded, dbRef")
  Rel(db, storage, "readLocal, writeLocal")
  Rel(storage, ls, "get/setItem")
  Rel(slice, provider, "useProgress().update")
  Rel(backup, provider, "replaceLocal")
  Rel(cloud, provider, "dbRef, replaceLocal, _updatedAt")
  Rel(cloud, db, "normalizeDatabase(remote)")
  Rel(cloud, merge, "mergeProgress(local, remote)")
  Rel(cloud, client, "select, upsert, delete")
  Rel(cloud, syncErr, "on failure")
  Rel(client, supa, "HTTPS")
  Rel(ui, cloud, "SyncContext")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

- **Two ways to write the document.**
  - `update(recipe)` normalizes the result, stamps `_updatedAt` and persists it. A new stamp
    is what triggers the debounced push.
  - `replaceLocal(next)` normalizes and persists without restamping. Sync uses it to install
    a merged document, so the two sides do not fight over which one is newer.
- **`normalizeDatabase` is not a whitelist.** It spreads the input first and then validates
  each field it knows. A field written by a newer build survives an older build. It keeps
  a nested object's identity when nothing in it changed, because it runs on every write
  ([ADR 0004](adr/0004-no-schema-library.md)).
- **`mergeProgress` rebuilds every known field.** Unknown fields come from the newer side.
  The rule for each field is in the [data model](data-model.md#merge-rules)
  ([ADR 0003](adr/0003-local-first-field-merge.md)).
- **One sync per sign-in, then debounced pushes.** A push never runs before a pull has
  succeeded. Until then, the debounced timer retries the full sync instead.

## d. Study schedule and curriculum

```mermaid
C4Component
  title Study schedule and curriculum

  Container_Boundary(sched, "shared/study-schedule") {
    Component(useSched, "hooks/useTrainerSchedule.tsx", "hook", "useMemo over buildScheduleFrom")
    Component(today, "hooks/useToday.tsx", "hook", "Local ISO date; the only clock read")
    Component(build, "lib/buildSchedule.ts", "pure", "buildScheduleFrom(input, source): dated slots or null")
    Component(source, "lib/trainerSource.ts", "pure", "trainerScheduleSource(content, sprintLearnDays)")
    Component(dist, "lib/distribute.ts", "pure", "chunkEvenly, chunkBySize, interleaveFillers")
    Component(describe, "lib/describeSchedule.ts", "pure", "Every user-facing sentence about the plan")
  }

  Container_Boundary(curr, "features/curriculum") {
    Component(page, "pages/CurriculumPage", "page", "The Learn tab")
    Component(learnPlan, "hooks/useLearnPlan.tsx", "hook", "Tick tasks, touch activity, start linked exams")
    Component(scheduled, "hooks/useScheduledLearn.tsx", "hook", "Groups learn days by schedule slot")
    Component(planLib, "lib/planProgress.ts, lib/taskTarget.ts", "pure", "Plan summary; resolve a task's link")
  }

  Component(slice, "progress-store/hooks/useTrainerSlice.tsx", "hook", "settings.examDate, learnDone, attemptedExamIds")
  Component(learnKey, "shared/lib/learnProgress.ts", "pure", "learnTaskKey = d{day}t{index}")
  Component(dash, "features/dashboard/hooks/useTodayPlan.tsx", "hook", "Today card on the dashboard")
  Component(cfg, "shared/config/schedule.ts", "constants", "MIN_PREP_DAYS, MAX_PREP_DAYS, phase weights")

  Rel(useSched, slice, "inputs")
  Rel(useSched, today, "today")
  Rel(useSched, source, "from useTrainerContent")
  Rel(useSched, build, "calls")
  Rel(build, dist, "uses")
  Rel(build, cfg, "reads")
  Rel(page, learnPlan, "uses")
  Rel(page, scheduled, "uses")
  Rel(scheduled, useSched, "uses")
  Rel(learnPlan, slice, "update learnDone")
  Rel(learnPlan, learnKey, "keys")
  Rel(learnPlan, planLib, "summarizePlan")
  Rel(dash, useSched, "uses")
  Rel(page, describe, "copy")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

The schedule is **derived on every render and never stored**. `buildScheduleFrom` is pure:
`today` is an argument and the engine reads no clock. Its only stored inputs are:

- `settings.examDate`;
- `learnDone`;
- the attempted exam ids.

So the plan can never disagree with progress. A stored date that is not a real date
returns `null`, and callers then show static copy rather than a plan built on a guess.

- **Runway.** The engine clamps the runway to `MIN_PREP_DAYS` (5) to `MAX_PREP_DAYS` (90)
  and splits it into a learn phase and a mock phase.
- **Tier rule.** Core days 1–14 are always scheduled. Extension days 15–28 appear only once
  every core day has a day of its own.
- **Sprint.** The shortest runway is the emergency sprint: a crash course on the trainer's
  `sprintLearnDays`, three anchor papers (`sprintAnchors`) and an exam eve. With even fewer
  days, it is trimmed from the middle.
- **Tests.** The sweep in `tests/unit/schedule.test.ts` holds these invariants across every runway.

## e. Vocabulary practice and SRS

```mermaid
C4Component
  title Vocabulary practice and spaced repetition

  Container_Boundary(vp, "features/vocab-practice") {
    Component(page, "pages/VocabPracticePage", "page", "Category picker, sessions, reference tables")
    Component(practice, "VocabPracticePage/usePractice.tsx", "hook", "Due cards, quiz build, grading into SRS")
    Component(deep, "VocabPracticePage/useDeepLinkedQuiz.tsx", "hook", "Starts a quiz from a curriculum link")
    Component(pstore, "lib/practiceStore.ts", "zustand + immer", "In-memory session: flashcards or quiz; not persisted")
    Component(quiz, "lib/quiz.ts", "pure", "buildQuiz: questions and distractors")
    Component(sessions, "VocabFlashcardSession, VocabQuizSession, PracticeSessionSummary", "components", "Render the session")
  }

  Component(srs, "shared/lib/srs.ts", "pure Leitner", "reviewItem, isDue, pickDueIds, countMastery, streakLength")
  Component(items, "shared/lib/studyItems.ts", "pure", "allCards, cardsFor, idsFor over a VocabBank")
  Component(slice, "progress-store/hooks/useTrainerSlice.tsx", "hook", "srs and activity of the trainer")
  Component(content, "hooks/useTrainerContent.tsx", "hook", "content.vocab")
  Component(dashModel, "features/dashboard/pages/DashboardPage/dashboardModel.ts", "pure", "Mastery and streak for the dashboard")

  Rel(page, practice, "uses")
  Rel(page, deep, "uses")
  Rel(page, sessions, "renders")
  Rel(practice, pstore, "start, grade, choose")
  Rel(practice, quiz, "buildQuiz")
  Rel(practice, items, "cards")
  Rel(practice, srs, "pickDueIds, reviewItem")
  Rel(practice, slice, "update srs + activity")
  Rel(practice, content, "vocab bank")
  Rel(dashModel, srs, "countMastery, streakLength")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

`srs.ts` is a small Leitner system:

- six boxes with intervals `[0, 1, 3, 7, 14, 30]` days;
- a miss sends an item back to box 1;
- box 4 and above counts as mastered.

Like the schedule, it is pure: `today` is always an argument. The session itself (which
card is open, quiz choices) lives in a zustand store with immer. It is deliberately not
persisted, and only the graded result reaches the document. Each trainer keeps its own
`srs` and `activity` maps (the root trainer at the document root, the others in their
`TrainerDoc`). The merge combines them per item and per day.

## f. Error handling and observability

```mermaid
C4Component
  title Error handling and observability

  Container_Boundary(lib, "shared/lib") {
    Component(appErr, "appError.ts", "types + helpers", "AppError (code, message, recoverable, cause), Result, tryCatch, toAppError")
    Component(log, "logger.ts", "ring buffer", "100 entries, redacted, mirrored to sessionStorage; never sent")
    Component(globalErr, "globalErrors.ts", "listeners", "window error, unhandledrejection, vite:preloadError; reportRenderError")
    Component(stale, "staleChunk.ts", "guard", "Reload once per 5 min; never mid-exam or offline")
    Component(storage, "storage.ts", "Result", "writeLocal returns Result; failure listeners; in-memory fallback")
    Component(sw, "serviceWorker.ts", "external store", "off, registering, ready, update-waiting, failed")
  }

  Container_Boundary(comp, "shared/components") {
    Component(boundary, "ErrorBoundary", "react-error-boundary", "Root + per route, reset by path")
    Component(fallback, "ErrorFallback", "component", "Learner message, Retry, Home, Reload")
  }

  Component(syncErr, "account-sync/lib/syncError.ts", "classifier", "Supabase failure to AppError")
  Component(notices, "progress-store/hooks/useProgressNotices.tsx", "hook", "Toasts with a next action")
  Component(diag, "settings/components/DiagnosticsCard", "component + useDiagnostics + diagnostics.ts", "Copy diagnostics: build, browser, online, offline mode, sync flags, last 50 entries")
  Component(main, "app/main.tsx", "entry", "installGlobalErrorHandlers()")

  Rel(main, globalErr, "installs")
  Rel(globalErr, log, "error, warn")
  Rel(globalErr, stale, "on chunk failure")
  Rel(boundary, globalErr, "onError = reportRenderError")
  Rel(boundary, fallback, "renders")
  Rel(fallback, appErr, "isChunkLoadError picks Reload")
  Rel(storage, appErr, "Result, storage-full")
  Rel(storage, notices, "subscribeToStorageFailures")
  Rel(syncErr, appErr, "appError(code)")
  Rel(sw, log, "registration failures")
  Rel(diag, log, "getLogEntries")
  Rel(diag, sw, "status")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

- **Learner messages come from `AppError`.** Every `AppErrorCode` has a default message
  with a next action ("Export a backup", "Sign out and in again", "Reload"). The `cause`
  goes only to the log.
- **Lint refuses a swallowed catch.** `local/no-swallowed-catch` refuses a catch that
  neither rethrows, returns, nor calls `logger.*` or `toAppError`.
- **The logger is safe by construction.**
  - It stores a scope, a short message and, from an error, only its name, code and message.
  - It redacts emails, JWTs, Supabase keys, bearer tokens, `key=value` secrets, UUIDs and
    long opaque tokens.
  - It caps each entry at 300 characters.
- **Nothing leaves the device.** The Diagnostics card formats the last 50 entries as text
  for the learner to copy ([ADR 0010](adr/0010-error-handling-model.md)).

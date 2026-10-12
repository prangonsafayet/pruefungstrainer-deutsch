---
paths:
  - 'src/**'
---

# Architecture

```
src/app        composition root — providers, router, layout. May import anything.
src/features   vertical slices: components/ hooks/ lib/ routes/, plus an index.ts naming the
               public surface where another feature needs something from it.
src/shared     feature-agnostic building blocks — ui/ primitives, components, hooks, lib,
               config, types, providers.
src/content    inert data, keyed by trainer: content/trainers/<id>/ holds that trainer's
               exams, curriculum, vocabulary bank and guide HTML.
```

## One registry, peer trainers

The trainers (A2·B1, B1, B2, and DTZ being added) are peers described once in
`shared/config/trainers.ts`: one `TRAINERS` descriptor per trainer names its identity, route
namespace, paper, progress slice and lazily-loaded content. That is the only place a
per-trainer fact may live. A `no-restricted-syntax` rule refuses a trainer id anywhere else in
`src/` as a value (`mode === 'b1'`), an object key (`{ b1: … }`) or a property read
(`db.b1`). Type-level uses are not matched, so the unions that DEFINE the ids and
`ProgressDatabase`'s fields still declare theirs. Exempt: the registry, `src/content/**`,
`progress/lib/progressDb.ts` and `auth/lib/mergeProgress.ts`. `eslint.config.js` names no id —
`scripts/trainerRegistry.mjs` reads them from the registry (as text, because the eslint
config, `vite.config.ts`, `tests/render/routes.test.ts` and `e2e/singleLevelTrainers.spec.js`
cannot resolve the layer aliases); `tests/unit/trainerRegistry.test.js` checks that parse.
Every screen, route, hook and nav item is generated from `TRAINER_ORDER`.

Adding a trainer on an existing paper is seven edits plus two tests; a new paper is much
larger. The measured lists live in the `new-trainer` skill — use it, do not re-derive them.

`features/exam` runs every mock exam of every trainer: one run-state machine, runner shell,
results and review screen, driven by a format descriptor per paper (see the exam-formats
rule). `features/practice` drills every trainer's vocabulary bank.

## Dependency rules are ESLint rules

- A feature must not import another feature's internals — only `@features/<name>` (its
  `index.ts`). It MAY deep-import itself through its own alias (one generated entry per
  feature directory).
- A feature must not import `@app/**`. `src/shared` must not import features or the app.
  `src/content` must not import application code (including the bare `@shared/components`).
- Primitives come from `@shared/ui`, never from a file inside it.
- Relative imports climb at most one level; `../../` must use an alias.
- **A feature barrel must not re-export a component or route** (feature-barrels-export-no-ui;
  currently in the TODO(redesign) block — `features/auth/index.ts` still exports
  `AccountMenu` and `SyncPanel`). UI two features need lives in `src/shared/components`.
- **Shared if used twice:** `npm run check:architecture` fails when two features own a
  component file with the same name — that is one component written twice; move it to
  `src/shared/components`.

These patterns are `no-restricted-imports` / `no-restricted-syntax`, and both are
_configured, not accumulated_: when two flat-config entries set the same rule for a file, the
later one replaces the earlier one's options. Every entry restates every pattern that applies
to its files; dropping one is silent. After editing them, re-prove each rule with a planted
violation (both `a` and `a/b` forms for a `/**` pattern) and delete the plant.

## Barrels and routes

Route components are not exported from feature barrels: the router deep-imports them
(`@features/exam/routes/RunnerPage.tsx`). Exporting them once produced an import cycle that
hung the settings route on a permanent skeleton. Only `auth`, `exam`, `plan` and `progress`
have a barrel, because only they are read by another feature; a feature nobody imports needs
no door. If two features need the same thing, it belongs in `src/shared` — that is why the
confirm dialog, the speech layer and the score-history chart live there.

## Where things go

| Kind                      | Location                                   | Example                        |
| ------------------------- | ------------------------------------------ | ------------------------------ |
| Screen                    | `features/<f>/routes/`                     | `DashboardPage.tsx`            |
| Feature-private component | `features/<f>/components/<group>/`         | `ExamCard.tsx`                 |
| Feature logic             | `features/<f>/hooks/`, `features/<f>/lib/` | `useExamRun.ts`, `runStore.ts` |
| Cross-feature component   | `shared/components/<group>/`               | `data-display/Meter.tsx`       |
| Design-system primitive   | `shared/ui/` (shadcn CLI writes here)      | `button.tsx`                   |
| Domain type               | `shared/types/`                            | `exam.ts`, `progress.ts`       |
| Shared constant           | `shared/config/`                           | `exam.ts`, `appInfo.ts`        |
| Exam or study content     | `content/trainers/<id>/`                   | `a2b1/exams/exam07.ts`         |

## The `plan` feature

Owns the adaptive schedule; dashboard, learn and settings read it through `@features/plan`.
`lib/buildSchedule.ts` is a pure function of (exam date, today, finished lessons, taken exams)
and reads no clock. `lib/distribute.ts` holds the bucketing helpers, `lib/describeSchedule.ts`
every user-facing string about the plan. `hooks/useTrainerSchedule.ts` / `hooks/useToday.ts`
are the React surface. The schedule is derived on render and **never persisted**; its inputs
(`settings.examDate`, `learnDone`, `attempts`) are the only stored state. Constants:
`@shared/config/schedule.ts`; types: `@shared/types/schedule.ts`. Date rules: the
dates-timers rule.

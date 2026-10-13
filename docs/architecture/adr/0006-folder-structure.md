# ADR 0006: Folder per component, `pages/`, no barrels, isolated features, shared domains

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

As the app grew to four trainers, three problems appeared:

- **Unclear ownership.** It was hard to tell where a file belonged and who used it.
- **Barrels hid things.** `index.ts` re-exports hid the real file behind an import, created
  cycles, and pulled whole folders into eager chunks.
- **Feature-to-feature imports.** The dashboard, settings and the exam runner reached into
  each other, so a change in one broke another.

## Decision

- **Four layers, one alias each.** `src/app` is the composition root only. `src/features`
  holds one vertical slice per screen family. `src/shared` holds anything two features
  use. `src/content` holds inert data per trainer. The aliases are `@app`, `@features`,
  `@shared` and `@content`. There is no catch-all `@/`, so a boundary violation cannot hide
  behind a second spelling of a path.
- **Features are isolated.** A feature imports only itself, `@shared` and `@content`. What
  a second feature needs moves to `src/shared`. That is why `progress-store`,
  `account-sync`, `exam-run`, `study-schedule` and `writing-feedback` are shared domains,
  each with its own `components/`, `hooks/` and `lib/`.
- **Folder per component.** Every component and page lives in a folder of its own name,
  with everything only it uses (`DashboardPage/useDashboardStats.tsx`). Screens live in
  `pages/`, never `routes/`. Group folders are kebab-case.
- **No barrels.** There is no `index.*` and no folder import. Every import names its file
  with the extension (`@shared/ui/button.tsx`).
- **One exception.** `src/shared/ui` stays flat and kebab-case, because the shadcn CLI
  writes there.

ESLint enforces these rules (`no-restricted-imports` per layer, `NO_BARRELS`,
`check-file/no-index`, and one generated `feature-isolation-<name>` entry per feature).
`scripts/check-architecture.mjs` checks what a file-at-a-time linter cannot: folder per
component, `pages/` per feature, no `routes/`, unique component basenames and no
cross-feature import.

## Consequences

- **A path says what a file is and who may use it.** Moving a module means updating its
  importers, and lint names every one.
- **Bundle splits stay predictable.** Importing a file never drags in a folder.
- **"One name, one component".** No two `.tsx` files may share a basename. This surfaces
  components that were written twice.
- **The lint config needs care.** `no-restricted-imports` and `no-restricted-syntax` are
  configured, not accumulated. Every flat-config entry must restate every pattern that
  applies to its files, and a changed rule is re-proved with a planted violation.

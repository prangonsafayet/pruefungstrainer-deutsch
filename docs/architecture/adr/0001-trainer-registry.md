# ADR 0001: One trainer registry holds every per-trainer fact

- **Status:** Accepted
- **Date:** 2026-08-21 (DTZ added 2026-10-12)

## Context

The app began as an A2·B1 trainer. Adding B1 and B2 meant every screen, route, nav item,
hook and storage path had to learn about more than one exam. Writing `if (mode === 'b1')`
at each place spreads one trainer's facts across the tree. A fourth trainer would then mean
finding all of them, and a missed one fails silently.

## Decision

`src/shared/config/trainers.ts` is the only place a per-trainer fact may live. One
`TrainerInfo` per trainer gives:

- identity: `id`, `name`, `short` and `accent`;
- routing: `basePath` (A2·B1 owns the root);
- its paper: `format` and the eager `paper`;
- its progress slice: `docKey`;
- its content: `loadContent`, a dynamic import of its `content.ts`;
- plan details: `sprintLearnDays` and `weaknessCheatsheets`.

`TrainerInfo` pairs `format` with `docKey` in a discriminated union, so a mispaired entry
is a type error. `TRAINER_ORDER` generates every route (`router.tsx`), nav entry, run
format and schedule source.

A `no-restricted-syntax` rule refuses a trainer id anywhere else in `src/`, as a value, an
object key or a property read. There are three exemptions:

- `src/content/**`;
- `progressDb.ts` and `mergeProgress.ts`, which must spell each trainer out under
  `exactOptionalPropertyTypes`.

`scripts/trainerRegistry.mjs` reads the id list from the registry as text, for the ESLint
config, `vite.config.ts` and the tests that cannot resolve the layer aliases.

## Consequences

- **Cheap on an existing paper.** A trainer on an existing paper costs a content folder,
  one registry entry and a short, measured list of type-level edits plus two tests. The
  `new-trainer` skill has the list. No screen changes.
- **Expensive for a new paper.** A trainer that sets a new paper costs much more (see
  [ADR 0002](0002-format-descriptors.md)). The DTZ was that case.
- **Static fields only.** A registry field must be readable synchronously. Anything
  reachable from `loadContent` is lazy, so `tagline` and `hasGuide` are written by hand
  rather than derived from content.
- **The eager part must stay small.** Rolldown ignores `manualChunks` for a module that is
  reachable both eagerly and lazily. The registry's eager imports are therefore only each
  trainer's small `paper.ts`.

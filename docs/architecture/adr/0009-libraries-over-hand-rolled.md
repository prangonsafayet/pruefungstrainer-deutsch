# ADR 0009: Libraries over hand-rolled code, with three named exceptions

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

Hand-rolled generic machinery (date maths, error boundaries, retries, charts) is easy to
start and expensive to own. Libraries cost bundle size, supply-chain exposure and
sometimes semantics the app cannot accept. The project needed one rule that could decide
each case.

## Decision

Before writing non-trivial generic code, look for a maintained, typed, tree-shakeable
library:

1. first one already in `package.json` (date-fns, Radix, sonner, zustand, immer, lucide,
   react-day-picker, cva, tailwind-merge, react-error-boundary);
2. then a small, well-maintained one.

A candidate needs active maintenance, TypeScript types, an MIT, Apache or ISC licence, no
paid service and no telemetry, and an acceptable bundle cost. It must also pass
`npm run audit:prod`. Hand-roll only when the library costs more than the code, and say
why in a one-line comment.

The 2026-10-12 audit applied the rule:

- **Adopted.** `react-error-boundary` for the boundaries, because classes are banned in
  `src/`. date-fns now backs the `format.ts` date helpers.
- **The chart stays hand-rolled.** `ScoreHistoryChart` draws a few bars. Recharts would cost
  about 90 kB gzip in a screen that needs a `role="img"` plus a data table.
- **The schema stays hand-rolled.** A parse-and-rebuild schema would break passthrough and
  object identity on the persisted document ([ADR 0004](0004-no-schema-library.md)).
- **SRS stays hand-rolled.** `srs.ts` is a pure six-box Leitner system of about 100 lines.
  Its stored shape (`box`, `due`, `seen`, `correct`, `wrong`) is persisted, synced and
  merged per field. A library's own card model would mean a migration and a different merge
  rule, for no gain in what the learner sees.

## Consequences

- **A new dependency is a reviewed decision.** It must clear `audit:prod`, and CI's
  `deadcode` job flags unused dependencies.
- **Each exception has a written reason** at its call site, so it is not re-litigated by
  every reviewer.
- **Watch for eager size.** A library pulled into an eager chunk shows up in
  `check:bundle`. date-fns `parse` was avoided because it cost about 7 kB gzip in the entry
  graph.

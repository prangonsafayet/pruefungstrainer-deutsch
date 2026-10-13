# ADR 0002: One format descriptor per paper drives one generic exam engine

- **Status:** Accepted
- **Date:** 2026-08-21 (`dtz-paper` added 2026-10-12)

## Context

The app hosts three papers, and they differ in several ways:

- **Modules.** The DTZ has no Sprachbausteine.
- **Item shapes.** The DTZ has X answers and paired richtig/falsch + MC items.
- **Timing.**
- **Self-rating scales.** The DTZ oral scales are weighted unequally.
- **The verdict.** A2·B1 gives a total with a dual-level grade. B1 and B2 give written and
  oral parts. The DTZ gives three Teilergebnisse and a certificate.

What it means to sit one is the same for all three: a queue of modules against a clock,
answers keyed by item, a self-rating for the two productive modules, and a stored attempt
at the end. Three copies of the runner, results and review screens would drift apart.

## Decision

Each paper has one descriptor in `src/features/mock-exam/lib/formats/<format>/format.ts`:
`DUAL_LEVEL_FORMAT`, `SINGLE_LEVEL_FORMAT` and `DTZ_FORMAT`. Each one implements
`ExamFormat<TExam, TSettings, TAttempt>` (`shared/exam-run/types/examFormat.ts`), which
covers:

- labels, timing and briefing;
- rating specs and speaking hints;
- `moduleComponents`, a partial record;
- `scoring`: `countUnanswered`, `buildAttempt`, `summarize`, `completionToast`, `review`
  and `writingSample`.

`useExamBinding` narrows a trainer to its descriptor once, on `slice.format`. After that,
`ExamRunnerView` with `useExamRun`, `AttemptResults` and `AttemptReview` render the same
code for every paper.

The run-only half (`modules`, `moduleShort`, `runStore`) lives in
`shared/exam-run/lib/<format>RunFormat.ts`, gathered by `runFormats.ts`. That is because
the dashboard and settings start and discard runs too, and a feature may not import
another feature.

A module renderer carries its paper in its name (`DtzLesenModule`). Only its own
`format.ts` may import it (the `exam-modules-through-format` lint rule). Anything named
after one paper is named after that paper. Nothing is named after a brand.

## Consequences

- **One engine for every paper.** One runner, one results screen and one review screen
  serve all four trainers, and marking logic is pure and unit-tested per format.
- **A new paper is a large but well-defined change:**
  - another `ExamFormatId`;
  - a `formats/<new>/` folder and its renderers;
  - a `RUN_FORMATS` entry;
  - a `TrainerSlice` variant and an attempt type;
  - the format-keyed records in `examConditions.ts`.
- **`moduleComponents` is `Partial`.** A stored run that names a module the paper lacks
  sends the learner home instead of rendering nothing.

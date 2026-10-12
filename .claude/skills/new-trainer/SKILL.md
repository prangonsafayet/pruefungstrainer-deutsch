---
name: new-trainer
description: The measured edit list for adding a trainer to the registry — seven edits plus two tests for a trainer on an existing paper, and the much larger list for a trainer that sets a new paper (as DTZ does). Use when adding, planning or estimating a new trainer or exam format.
when_to_use: Adding a fifth trainer, planning a new exam format, or checking what the DTZ trainer still needs wired.
---

# New trainer

Follow the memory protocol first (`.claude/rules/memory.md`): read `.claude/memory/traps.md`
and `docs/lessons.local.md` if present; append what cost you time.

This list was measured, not assumed: a trainer was planted to see what actually changes. Every
item is a list the type system needs spelled out. If adding DTZ (or anything later) shows the
list is wrong, fix this file in the same PR.

## A trainer on an existing paper — seven edits

| Edit                                                                               | Why it cannot be derived                                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `content/<id>/` — the content folder                                               | it is the content                                                                                |
| one entry in `TRAINERS` (`shared/config/trainers.ts`)                              | it is the registry                                                                               |
| `TrainerId`, and `SingleLevelTrainerId` if it sets that paper                      | widening either to `string` loses the exhaustiveness the design rests on                         |
| a field on `ProgressDatabase` (`shared/types/progress.ts`)                         | the persisted document's own shape                                                               |
| `EMPTY_DATABASE` + `normalizeDatabase` (`shared/progress-store/lib/progressDb.ts`) | `exactOptionalPropertyTypes`: an unopened trainer is an ABSENT key, so defaulting is per trainer |
| `mergeProgress` (`shared/account-sync/lib/mergeProgress.ts`)                       | it rebuilds the document field by field on purpose; this is where two trainers were once wiped   |
| `TRAINER_CONTENT` (`src/content/trainerContent.ts`)                                | the static content imports live here only; four suites and `validate.cjs` read it eagerly        |

## Two tests

- `tests/unit/contentChunks.test.ts` — one `vi.mock` per trainer's content module. `vi.mock`
  takes a literal path, so it cannot be looped. Miss it and the new trainer's lazy-loading
  guarantee goes unverified while the suite stays green.
- `tests/unit/mergeProgress.test.ts` — every new `ProgressDatabase` field needs a merge test,
  with the field populated on BOTH sides.

Generated, so no edit: `eslint.config.js`'s trainer ids, `vite.config.ts`'s sitemap and
`robots.txt`, `tests/render/routes.test.ts`'s routes and `e2e/singleLevelTrainers.spec.js`'s
list all read the registry through `scripts/trainerRegistry.mjs`.

## A trainer that sets a NEW paper — additionally

Measured by adding the DTZ (`'dtz-paper'`):

- another `ExamFormatId` (`shared/types/trainer.ts`) — never equal to a trainer id, which the
  trainer-id lint ban would then refuse everywhere — and the exam type
  (`shared/types/<paper>Exam.ts`, e.g. `dtzExam.ts`)
- a whole `features/mock-exam/lib/formats/<new>/` mirroring `single-level/` (`format.ts`,
  scoring, summary, review, briefing copy, self-rating scale) plus its run format with its OWN
  storage key, `shared/exam-run/lib/<new>RunFormat.ts`, registered in `shared/exam-run/lib/runFormats.ts`
- the module renderers under `features/mock-exam/components/modules/<new>/<Renderer>/<Renderer>.tsx`,
  named after the paper (`DtzLesenModule`) and imported only by that format's `format.ts`. No
  `eslint.config.js` edit: its `ignores` already covers every `lib/formats/*/format.ts`
- a `TrainerInfo` variant pairing the format with its document key (and a `<Paper>DocKey` type),
  a `TrainerDoc<Attempt>` field on `ProgressDatabase`, a `TrainerSlice` variant, an
  `ExamBinding` variant, a `ScoredAttempts` variant and an entry in `RUN_FORMATS`
- the format-keyed records in `shared/config/examConditions.ts` (eight, including
  `DEFAULT_PLAYS_ALLOWED`)
- every switch over the format: `passLineLabel`, `writingTimeHint`, `withBinding`,
  `useExamBinding`, `useTrainerSlice`, the dashboard model and exam cards, the attempts table
  and the score chart. They are exhaustive (`unreachableFormat` or a `default`-less switch the
  return type checks), so `npm run typecheck` lists them
- `validate.cjs` checks for the new shape, and scoring tests against the official points
- a new run key in `.claude/hooks/storage-keys.baseline` and the protected-key lists

## Checklist

1. Read the architecture, persistence and exam-formats rules (they load when you open the files).
2. Make the edits above; run `npm run typecheck` — exhaustiveness errors point at anything missed.
3. `npm run check:storage-keys` — a new run key is fine (add it with `-- --update`), a renamed
   one is not.
4. `npm test`, then `npm run test:e2e`; open the new trainer in a real browser and watch the
   network log: visiting it must not download another trainer's content chunk.
5. Ask `persistence-guardian` to review the `ProgressDatabase` / merge changes.

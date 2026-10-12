---
paths:
  - 'src/features/exam/**'
  - 'src/shared/config/*Exam*.ts'
  - 'src/shared/config/exam.ts'
  - 'src/shared/config/examConditions.ts'
  - 'src/shared/types/*Exam*.ts'
  - 'src/shared/types/exam.ts'
  - 'src/shared/types/examRun.ts'
  - 'src/shared/components/exam-ui/**'
---

# Exam formats

`features/exam` runs every mock exam of every trainer through a **format descriptor** in
`features/exam/lib/formats/`: `DUAL_LEVEL_FORMAT` (A2·B1) and `SINGLE_LEVEL_FORMAT` (telc B1 and
B2), with a third for the **DTZ** paper being added. A descriptor owns its module list and
timing, briefing copy, marking rules, self-rating scale and module renderers
(`components/modules/<format>/`). Only a format's own `lib/formats/<format>/index.ts` may import
its renderers (`exam-modules-through-format`) — the twins share basenames.

`useExamBinding` binds a trainer to its paper and stored attempts, so the runner, results and
review screens narrow once and render generic views. Shared rendering lives in
`shared/components/exam-ui/` via `@shared/components`.

Anything named after one paper is named after that paper (`SINGLE_LEVEL_FORMAT`,
`single-level/scoring.ts`); anything generic is not; nothing is named after a brand (`Telc`
distinguishes nothing).

## DTZ

Format facts come only from `docs/dtz-format.local.md` (gitignored, cites the g.a.s.t.
Übungssatz page by page). Its **Not stated** list — plays per Hören text, per-Teil minutes, a
Schreiben word count, Sprechen preparation time — must never be presented as official. The data
contract is the `DtzExam` type in `src/shared/types/dtzExam.ts`; read it as the source of truth.
DTZ has no Sprachbausteine module and places a learner at A2 or B1 from three Teilergebnisse.

## Numbers and provenance

Each paper's scoring and timing must match its trainer's `guide.ts`. A number the source does
not give is the app's own: copy names the app as owner ("this trainer marks each part at
60%"), never says "official", and never sits inside a German `anweisung`.
`tests/unit/examConditions.test.ts` locks which condition numbers may be called telc's. The
plays-per-Teil question for single-level Hören Teil 3 is open and unsourced — do not change it
without a source.

## Answers and the clock

Answer keys and the run store are persisted — see the persistence rule. The exam clock rules
are in the dates-timers rule.

Adding a paper (another `ExamFormatId`, a `formats/<new>/`, renderers, `RUN_FORMATS`, a
`TrainerSlice` variant, an attempt type, the format-keyed records in `examConditions.ts`): the
`new-trainer` skill has the measured list.

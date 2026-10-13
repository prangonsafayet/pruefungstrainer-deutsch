---
name: new-exam
description: Scaffold and author a new mock exam for one of the four trainers (A2·B1, B1, B2, DTZ), wired into that trainer's exam index and validated. Use when asked to add a further mock exam, or to replace an existing one wholesale.
argument-hint: '<trainer id> [exam number]'
---

# New exam

Follow the memory protocol first (`.claude/rules/memory.md`): read `.claude/memory/traps.md`
and `docs/lessons.local.md` if present; append what cost you time.

Adding a mock exam touches three places in one trainer's folder,
`src/content/<id>/`. Do them in this order.

## 1. Decide the trainer, level and theme

Read `src/content/<id>/exams/allExams.ts` for what exists, then that trainer's `guide.ts`
and two neighbouring exams. Each trainer has its own data contract:

| Trainer | Type (source of truth)                                     |
| ------- | ---------------------------------------------------------- |
| A2·B1   | `DualLevelExam` in `src/shared/types/exam.ts`              |
| B1, B2  | `SingleLevelExam` in `src/shared/types/singleLevelExam.ts` |
| DTZ     | `DtzExam` in `src/shared/types/dtzExam.ts`                 |

A2·B1 ramps: tests 1–3 early A2, 4–7 solid A2/A2+, 8–15 B1. B1, B2 and DTZ do not ramp — every
paper sits at its level and the exams vary by `theme`. Pick a theme not already used.

## 2. Write the data file

Create `src/content/<id>/exams/examNN.ts` in the exact shape of its neighbours, ending
`} as const satisfies <ExamType>;` with a default export. Delegate the authoring to the
**exam-author** agent — it knows every Teil's item counts and the content rules (plausible
distractors, answers derivable from the text alone, mixed richtig/falsch, `alt` spellings on
note-sheet gaps, speakable TTS dialogue, original texts only). Then have
**content-fact-checker** check any exam facts or numbers in the prose.

## 3. Register it

Add the import and array entry in `src/content/<id>/exams/allExams.ts`, keeping it sorted
by `id`. The dashboard, history, runner and plan read from there; nothing else changes.

## 4. Validate

```bash
npm run validate     # counts, duplicate ids, answer ranges, mixed booleans
npm test             # types + the content and injection guards
```

Take the new exam once in `npm run dev` before calling it done — a plausible-looking answer key
that is ambiguous in practice is the common failure.

---
paths:
  - 'src/content/**'
  - 'validate.cjs'
---

# Exam and study content

Author with the `exam-author` agent; check facts with `content-fact-checker`. Run
`npm run validate` after every edit, then `npm test`.

## No invented exam facts

- Exam facts come from the exam provider's own published documents. The sources are cited in
  `docs/level-trainers.local.md` (telc B1/B2) and `docs/dtz-format.local.md` (DTZ) — both
  gitignored. Each trainer's `guide.ts` was verified against them; **when a `paper.ts`,
  curriculum, exam or `validate.cjs` disagrees with the guide, the guide wins.** A validator can
  encode a wrong fact and then defend it (`wantTasks` once required two B2 writing tasks).
- Every figure in prose is either in the source document or derivable from the repo's own
  content. Otherwise delete it — prose is unchecked by the type system and every test.
- A number's provenance travels with it. If the source lacks it, the copy names the app as its
  owner and it never sits inside the German `anweisung`, which learners read as the exam's own
  words. Grep the figure repo-wide before changing it in one place.
- An unresolved fact is recorded, not guessed (the single-level Hören Teil 3 plays count is
  open).
- Scope a content correction by `grep` across `src/content/`, not by the files you thought of.
  Before restoring dropped guidance, grep for what it is guidance about — guidance that
  contradicts the samples is worse than thin guidance.

## Original texts only

All mock exams, including DTZ's ten, are original texts that follow the format. Nothing from a
published Übungssatz or mock exam is reproduced.

## HTML in both directions

`GUIDE_HTML`, `LEARN.intro` and each `cheatsheets[].html` are repo-authored HTML and are
**injected**. Every other content string is plain text and must render as text.
`tests/render/contentInjection` guards both directions — a `<b>` once shipped visible on the
Learn page when a field moved from an injected template to a text node.

## Curriculum

`learnDone` keys are `d<day>t<index>`: never add, remove or reorder curriculum days or tasks —
rewrite text in place (see the persistence rule).

## Language

German content stays German; instructions to the learner (`anweisung`) are German, UI chrome
English. Redemittel: check the slot (who speaks, to whom, after what) before the wording.
Listening is TTS: write `{ speaker, text }` turns, speakable sentences.

## Validator

`validate.cjs` reads `TRAINER_CONTENT` eagerly. Per-file verdicts compare a counter captured
before that file, never the global one. Prove a new guard by planting a violation of it.

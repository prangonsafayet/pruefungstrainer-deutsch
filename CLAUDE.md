# CLAUDE.md

A React study app for four German exams — telc **A2·B1, B1 and B2**, and the **DTZ**
(Deutsch-Test für Zuwanderer A2–B1, being added) — run as peer trainers behind one registry,
each with its own mock exams, 28-day curriculum, guide and vocabulary bank (flashcards, quizzes,
spaced repetition). Modules are timed and scored by each paper's rules; progress is stored
locally with optional Supabase sync. It is a portfolio project: code quality and presentation
count as much as features.

Detail lives in `.claude/rules/`, which load automatically when you touch matching files.
Follow the memory protocol (`.claude/rules/memory.md`) before your first edit.

## Commands

```bash
npm run dev          # dev server on :5173
npm test             # typecheck → lint → exam data → vitest (logic + render)
npm run guards       # architecture, CSS tokens, storage keys, hook tests, prod audit
npm run test:e2e     # Playwright (Chromium + a mobile profile)
npm run build        # production build into dist/
```

`npm test` must pass before anything is committed; pre-push enforces it plus `guards:offline`.
`npm run test:e2e` needs browsers once: `npx playwright install chromium`.

## Non-negotiables

1. **Components are visual only.** Logic goes in a `use*.ts` hook or a pure `lib/` util.
2. **Primitives come from `@shared/ui`**, never from a file inside it, and never as raw
   `<button>` / `<input>` / `<form>` / `<table>` / `<label>`. Colours come from tokens.
3. **No `any`, no non-null assertions.** Narrow instead.
4. **A bug fix ships with a regression test.**
5. **Never commit to `main`.** Issue → branch → PR → green CI → squash-merge.
6. **No AI attribution in commits** — no `Co-Authored-By`, no "generated with" footer.

All six are lint rules or hooks where they can be. Prefer a maintained library already in
`package.json` to hand-rolled generic machinery; never add a dependency for a few lines.

## Task → what loads, what to use

| Task                                   | Rule (auto-loads on matching files)                                   | Agent / skill                                     |
| -------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| Any app code in `src/`                 | `architecture`, `conventions`                                         | `frontend-reviewer` before committing             |
| UI, styling, tokens, primitives        | `ui-design-system`                                                    | `ui-designer`                                     |
| Progress document, storage, auth, sync | `persistence`                                                         | `persistence-guardian` (required review)          |
| Exam runner, scoring, formats          | `exam-formats`, `dates-timers`                                        | —                                                 |
| Exam content, guide, curriculum        | `content`                                                             | `exam-author`, `content-fact-checker`, `new-exam` |
| Adding a trainer or paper              | `architecture`, `persistence`                                         | `new-trainer`                                     |
| Tests                                  | `testing`                                                             | `verify`                                          |
| CI, lint config, scripts, hooks        | `tooling-ci`                                                          | `audit`, `ship`                                   |
| Choosing a model or plugin             | [`model-routing`](.claude/rules/model-routing.md), `plugins` (always) | —                                                 |
| Branching, reviewing, releasing        | —                                                                     | [`CONTRIBUTING.md`](CONTRIBUTING.md)              |

## Reporting

Say what you actually ran and what it printed. If appearance matters, verify it in a real
browser (Playwright MCP is available) rather than asserting it from a passing unit test.

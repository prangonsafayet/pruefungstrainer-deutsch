# Architecture

The Prüfungstrainer Deutsch is a client-only React single-page app. It prepares learners for
four German exams: telc Deutsch A2·B1, telc Deutsch B1, telc Deutsch B2 and the
Deutsch-Test für Zuwanderer (DTZ). Four trainers ship 45 mock exams in total (15 + 10 + 10

- 10), and each trainer has a 28-day curriculum, an exam guide and a vocabulary bank. The
  app runs a sitting module by module against a clock, marks it by its paper's rules and
  stores the attempt. All of this lives in one JSON document in `localStorage`, so the app
  works with no account and, from v3.0.0, with no network. Signing in through Supabase is
  optional. It merges that document field by field with one cloud row, so progress can follow
  the learner across devices. There is no server of our own: Netlify serves static files with
  a strict Content Security Policy, and every per-trainer fact comes from one registry,
  `src/shared/config/trainers.ts`.

The diagrams use the [C4 model](https://c4model.com) in Mermaid. GitHub renders them inline.

## Reading order

| #   | Page                              | What it answers                                                                 |
| --- | --------------------------------- | ------------------------------------------------------------------------------- |
| 1   | [Context](c4-1-context.md)        | Who uses the app, which outside systems it talks to, and what data crosses      |
| 2   | [Containers](c4-2-containers.md)  | What ships to the browser, where it is stored, and what is lazy                 |
| 3   | [Components](c4-3-components.md)  | The inside of six areas, with the real file for each box                        |
| 4   | [Dynamic views](c4-4-dynamic.md)  | Five flows step by step: a DTZ sitting, sync, sign-in, a corrupt load, a deploy |
| 5   | [Data model](data-model.md)       | The persisted document, the storage keys, the answer keys and the merge rules   |
| 6   | [Quality gates](quality-gates.md) | What runs at commit, push, CI and merge, and what each gate is (and is not)     |
| 7   | [Decision records](adr/)          | Why the system has this shape                                                   |

## Decision records

| ADR                                                     | Decision                                                       |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| [0001](adr/0001-trainer-registry.md)                    | One trainer registry holds every per-trainer fact              |
| [0002](adr/0002-format-descriptors.md)                  | One format descriptor per paper drives one generic exam engine |
| [0003](adr/0003-local-first-field-merge.md)             | Local-first storage with a field-by-field cloud merge          |
| [0004](adr/0004-no-schema-library.md)                   | No schema library for the persisted document                   |
| [0005](adr/0005-dtz-paper-format.md)                    | `dtz-paper` is its own format id with its own run key          |
| [0006](adr/0006-folder-structure.md)                    | Folder per component, `pages/`, no barrels, isolated features  |
| [0007](adr/0007-components-visual-only.md)              | Components are visual only, enforced by lint                   |
| [0008](adr/0008-self-hosted-fonts-strict-csp.md)        | Self-hosted fonts and a strict CSP                             |
| [0009](adr/0009-libraries-over-hand-rolled.md)          | Libraries over hand-rolled code, with three named exceptions   |
| [0010](adr/0010-error-handling-model.md)                | `Result` at I/O boundaries, a recovery key, no telemetry       |
| [0011](adr/0011-hooks-are-tsx.md)                       | Hooks are `.tsx` files                                         |
| [0012](adr/0012-claude-hook-not-a-security-boundary.md) | The Claude Code git hook is accident prevention, not security  |

## Glossary

| Term             | Meaning                                                                                                                                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trainer**      | One exam the app prepares for: `a2b1`, `b1`, `b2` or `dtz` (`TrainerId`). A `TrainerInfo` entry in `TRAINERS` gives its name, route base path, paper, progress slice and lazy content loader. The trainers are peers.                                                       |
| **Paper/format** | The shape of a sitting: its modules, timing, marking and self-rating scales. There are three (`ExamFormatId`): `dual-level` (A2·B1), `single-level` (B1 and B2) and `dtz-paper` (DTZ). Each has a format descriptor in `features/mock-exam/lib/formats/<format>/format.ts`. |
| **mock exam**    | One complete mock exam: one file `src/content/<id>/exams/examNN.ts` that satisfies the paper's type (`DualLevelExam`, `SingleLevelExam` or `DtzExam`).                                                                                                                      |
| **Module**       | One part of a sitting: `lesen`, `sprachbausteine`, `hoeren`, `schreiben` or `sprechen` (`ExamModule`). The DTZ has no `sprachbausteine`.                                                                                                                                    |
| **Teil**         | A numbered part inside a module, for example DTZ Hören Teil 3. Answer keys carry the Teil number: `h3.0` is Hören Teil 3, item 0.                                                                                                                                           |
| **Teilergebnis** | A DTZ part result. There are three: Hören + Lesen (max 45), Schreiben (max 20) and Sprechen (max 100). Each one is placed at B1, A2 or "unter A2". `dtzCertificate` derives the certificate from the three levels, not from a total.                                        |
| **Slice**        | One trainer's share of the persisted document: attempts, `learnDone`, `srs`, `activity` and `settings`. The root trainer (A2·B1) keeps its slice at the document root. Every other trainer keeps a `TrainerDoc` under its id. `useTrainerSlice` hides the difference.       |
| **Run**          | A sitting in progress (`ExamRun`): the module queue, the current index and phase (`brief`, `module` or `rating`), answers, plays, ratings and the deadline. It is stored per paper under its own key, so a reload resumes it. It becomes an **attempt** when it finishes.   |
| **Attempt**      | A finished, marked run stored in the trainer's slice. Its `id` is `Date.now()` at completion, which is also the results route parameter.                                                                                                                                    |

## Keeping this current

These pages describe the tree at `feat/dtz-trainer-and-redesign` (v3.0.0). The rules in
`.claude/rules/` are the working contract, and these pages explain them. When the two
disagree, the code is the authority: fix the page.

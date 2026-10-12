# Model routing

Spend the expensive model on judgement, not on fan-out. See the memory note "Cheaper models
for mechanical work". `route-prompt.sh` adds a one-line hint per prompt; this table decides.

| Task                                                 | Model                                 | Agent / skill                                  |
| ---------------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| Lookup: where / what / find / explain                | haiku                                 | `Explore`, or a direct Grep/Read               |
| Mechanical: rename, format, typo, bump, copy, tests  | sonnet (haiku if trivial)             | general-purpose                                |
| Exam content, curriculum, guide, vocab, DTZ items    | sonnet                                | `exam-author`, then `content-fact-checker`     |
| UI and design-system work                            | sonnet (opus if system-wide redesign) | `ui-designer`                                  |
| Review against repo rules                            | sonnet                                | `frontend-reviewer`, `verify` / `audit` skills |
| Architecture, persistence/merge, security, migration | opus                                  | main thread; `persistence-guardian`            |
| Final pre-merge review                               | opus                                  | main thread or `/code-review`                  |

- Keep the main thread for judgement and integration; delegate mechanical fan-out down.
- Do not spawn an agent for a single-file lookup — read the file.
- Batch independent agents in one message so they run in parallel.
- One writer per working tree. Fix and mutation agents stage explicit paths, never `-A`.

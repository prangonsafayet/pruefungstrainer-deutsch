---
paths:
  - '.github/**'
  - 'eslint.config.js'
  - 'package.json'
  - '.husky/**'
  - 'scripts/**'
  - 'knip.json'
  - 'vite.config.ts'
  - '.lintstagedrc.json'
  - '.claude/hooks/**'
  - '.claude/settings.json'
---

# Tooling, CI and guardrails

## Pipeline order

| Where                       | Runs                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| pre-commit (husky)          | `lint-staged`: ESLint `--max-warnings 0 --fix` + Prettier on staged files                                             |
| pre-push (husky)            | `typecheck` → `lint --max-warnings=0` → `format:check` → `validate` → `test:unit` → `guards:offline` (whole codebase) |
| CI `static`                 | `typecheck` → `lint -- --max-warnings=0` → `format:check` → `guards`                                                  |
| CI `unit` / `e2e` / `build` | `validate` + `test:unit` / Playwright on Chromium / production build with no secrets                                  |
| CI `audit`, `deadcode`      | `npm audit --audit-level=high` (dev advisories) and `knip:ci` — both `continue-on-error` until their findings clear   |

`npm run guards` = `guards:offline` (`check:architecture` → `check:css` → `check:storage-keys`
→ `test:hooks`) then `audit:prod` (`npm audit --omit=dev --audit-level=moderate`). Pre-push uses
the offline variant so a push never depends on the registry. `npm test` stays typecheck → lint
→ validate → vitest.

Other scripts: `lint:strict` (zero warnings), `lint:todo` (turns on every rule in the
TODO(redesign) block), `audit:all` (report only), `knip` (dead code; config in `knip.json`,
`src/shared/ui/**` ignored as vendored).

## ESLint traps

- `no-restricted-imports` and `no-restricted-syntax` are **configured, not accumulated**: a
  later flat-config entry matching the same file replaces the earlier options. Restate every
  pattern per entry, or use a different rule key (`@typescript-eslint/no-restricted-imports`,
  `no-restricted-globals`, `no-restricted-properties`, a `local/` rule) — that is why the
  components-visual-only and raw-colour guards use those. Re-prove every changed rule with a
  planted violation, then delete it.
- A `/**` group pattern does not match the bare specifier: list both `a` and `a/**`.
- Flat config only lints extensions a `files` pattern names; `tests/**/*` opts nothing in.
  Treat "0 errors, N warnings" as a failure — the warning is how a skipped file shows up.
- A glob like `tests/**/*` inside a `/* */` comment closes it and breaks the config with
  `SyntaxError: Unexpected token '*'`. Use `//` comments or reword.
- The TODO(redesign) block (`ENFORCED` in `eslint.config.js`) holds fully-defined rules the tree
  still violates, each with its count. Flip a flag to `true` once `npm run lint:todo` is clean
  for it.

## Claude Code hooks (`.claude/hooks/`, wired in `.claude/settings.json`)

- `guard-git.sh` (PreToolUse Bash): blocks commit/push on main, push to main, `--no-verify` /
  `commit -n`, AI attribution in a commit message, `git add -A|.|--all`, `commit -a`, and
  `rm -r` of `src`, `docs`, `.git` or the project root.
- `guard-files.sh` (PreToolUse Edit|Write): blocks `.env*` except `.env.example`, and
  `package-lock.json` (npm writes it).
- `check-invariants.sh` (PostToolUse Edit|Write): after a `src/` edit, runs
  `check:storage-keys` and ESLint on the edited `.ts`/`.tsx`; exit 2 feeds the failure back.
- `route-prompt.sh` (UserPromptSubmit): adds a one-line model-routing hint.

Hooks parse stdin with node, **fail open** (exit 0 on their own errors; only a deliberate block
exits 2), and use `read -r -d '' script <<'JS'` — macOS bash 3.2 mis-parses quotes in a heredoc
inside `$(…)`. Never wire a hook before `bash -n` and `npm run test:hooks` pass.

## Other traps

- **`npm ci` fails with `Missing: … from lock file`** while local installs work: the lockfile
  lacks other platforms' native binaries. Regenerate it:
  `rm -rf node_modules package-lock.json && npm install`. Never hand-edit the lockfile.
- **Blank page and `require_react is not a function` under Playwright**: `server.open: true`
  racing the dependency optimizer plus `reuseExistingServer` serving a stale graph. Do not
  reintroduce either.
- **Node ≥ 22 required, `.nvmrc` pins 24** (Vite 8 rolldown, Vitest 4, happy-dom).
- **Rolldown ignores `manualChunks` for a module reachable from both an eager and a lazy graph.**
  A field a trainer needs synchronously lives on the eager `TrainerInfo`, never inside anything
  reachable through `loadContent()`. Check the network log in a real browser.
- `VITE_*` values are inlined at build time.
- Bumping Playwright means bumping the CI container image tag (a guard step checks).
- A `.ts` suite cannot import `vite.config.ts` (TS6307); build-time logic needing a test goes in
  a `.mjs` under `scripts/`, tested from plain JS.
- The pre-push hook checks the working tree, not the pushed commit.
- `git mv` plus a reformat in one commit loses rename detection: move, then reformat.
- In a shared checkout, stage explicit paths only (the hook enforces it).

## Merge gate

- `main` requires the four CI checks (Static analysis = typecheck + zero-warning lint + format +
  guards; Unit tests; End-to-end tests; Production build) and **enforce_admins is on** (since
  2026-10-12) — nobody, admins included, merges past a red check.
- `.claude/hooks/guard-git.sh` is a second layer, not the boundary. Merges are an **allowlist**:
  only the literal standalone `gh pr merge <n> --squash [--delete-branch]` passes, and only when
  `gh pr checks <n> --required` is all green (run in the project dir with `GH_REPO` unset). Any
  other gh command carrying a merge word, and any gh+merge inside `bash -c`/`eval`/`xargs`/`$(…)`/
  backticks, is refused. Consequence: edit files that mention those words with the Edit tool, not
  a Bash heredoc. Also refused: `git push --all` / `--mirror`.
- Every code review (frontend-reviewer, /code-review, caveman-review, ponytail-review) starts by
  running `npm run typecheck` and `npm run lint -- --max-warnings=0` over the WHOLE codebase and
  reports any error as a blocker, not only issues in the diff.

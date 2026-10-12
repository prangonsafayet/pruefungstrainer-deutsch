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

| Where              | Runs                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| pre-commit (husky) | `lint-staged`: ESLint `--max-warnings 0 --fix` + Prettier on staged files                                             |
| pre-push (husky)   | `typecheck` → `lint --max-warnings=0` → `format:check` → `validate` → `test:unit` → `guards:offline` (whole codebase) |
| CI `static`        | `typecheck` → `lint -- --max-warnings=0` → `format:check` → `guards`                                                  |
| CI `unit`          | `validate` → `test:coverage` (every vitest suite + the coverage gate)                                                 |
| CI `e2e`           | Playwright on Chromium → `build` → `test:csp` (the build served with its real `_headers`)                             |
| CI `build`         | production build with no secrets → `check:bundle` → `check:csp`                                                       |
| CI `deadcode`      | `knip:ci` — blocking                                                                                                  |
| CI `audit`         | `npm audit --audit-level=high` (dev advisories) — `continue-on-error` until they have a fix                           |

`npm run guards` = `guards:offline` (`check:architecture` — barrels, `routes/`, folder per
component, `pages/` per feature, `.tsx` hooks, feature isolation, unique names — → `check:css` → `check:storage-keys`
→ `test:hooks`) then `audit:prod` (`npm audit --omit=dev --audit-level=moderate`). Pre-push uses
the offline variant so a push never depends on the registry. `npm test` stays typecheck → lint
→ validate → vitest.

Other scripts: `lint:strict` (zero warnings), `lint:todo` (turns on every rule in the
TODO(redesign) block), `audit:all` (report only), `knip` (dead code; config in `knip.json`,
`src/shared/ui/**` ignored as vendored; an export kept for planned work gets a `@public` JSDoc
tag with its reason, never a blanket ignore).

## Coverage and bundle budgets

- `npm run test:coverage` runs every vitest suite with v8 coverage over libs and hooks
  (`src/**/lib/**`, `src/**/hooks/**`, `src/**/use*.tsx`; content, `shared/ui` and types
  excluded). Thresholds in `vitest.config.ts` sit just under the measured numbers (2026-10-13:
  lines 81.69%, functions 83.88%, branches 64.13%, statements 80.19% → 81/83/64/80). Raise
  them when coverage rises; never lower them to land a change.
- `npm run check:bundle` (after `build`) prints the chunk table and fails when the entry chunk
  passes `ENTRY_BASELINE_BYTES` + 10% or any `content-<id>` chunk passes 160 kB gzip. Raise the
  baseline in the commit that explains the growth. A date-fns `parse` import once cost 7 kB
  gzip in an eagerly preloaded chunk — the table is how that shows up.

## Content Security Policy and response headers

`public/_headers` is the only source of response headers (`netlify.toml` sets none — two
sources would set a header twice). The `/*` block carries the CSP, HSTS (2 years, preload),
`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`
(`microphone=(self)` for the Sprechen recorder, camera/geolocation/payment/usb off) and
`Cross-Origin-Opener-Policy: same-origin` (sign-in is a full-page PKCE redirect, never a
popup). `/assets/*` is immutable; `/` and `/index.html` are `no-cache`.

| Directive     | Allows                                                                            | Why                                                                                                     |
| ------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `script-src`  | `'self'` + one `'sha256-…'`                                                       | the pre-paint theme script in `index.html`; no `unsafe-inline`                                          |
| `style-src`   | `'self' 'unsafe-inline'`                                                          | sonner and Radix's scroll lock (`react-style-singleton`) inject `<style>` elements with runtime content |
| `img-src`     | `'self' data: blob:` + `*.googleusercontent.com`, `avatars.githubusercontent.com` | OAuth provider avatars in the account menu                                                              |
| `connect-src` | `'self'` + `https://*.supabase.co`, `https://api.languagetool.org`                | auth + sync REST (no realtime, so no `wss:`), writing feedback                                          |
| `media-src`   | `'self' blob:`                                                                    | playback of the recorder's blob URL                                                                     |

Also: `font-src 'self'` (fonts are self-hosted), `worker-src` and `manifest-src 'self'`,
`object-src 'none'`, `base-uri` and `form-action 'self'`, `frame-ancestors 'none'`,
`upgrade-insecure-requests`.

A tighter `style-src-elem 'self'; style-src-attr 'unsafe-inline'` was tested (2026-10-13) and
blocks those injected `<style>` elements on every page; a hash cannot cover them because their
content changes at runtime.

- **Add an origin** to the one directive that needs it, in `public/_headers`, then
  `npm run build && npm run test:csp`. A Supabase custom domain or a self-hosted
  `VITE_LANGUAGETOOL_URL` must be added to `connect-src` by hand, or sync / feedback is blocked.
- **Inline script changed** (anything inside `<script>` in `index.html`): `check:csp` (run
  after `npm run build`) fails and prints the new `'sha256-…'` to paste into `script-src`. CI
  runs it after the build. JSON-LD data blocks are not executed and need no hash.
- `npm run test:csp` (`playwright.csp.config.ts`, `e2e/csp.spec.js`) serves `dist/` through
  `scripts/serve-dist-with-headers.mjs` (a dependency-free `_headers` + SPA-fallback server;
  `vite preview` ignores `_headers`) and fails on any `securitypolicyviolation` across every
  trainer screen in both themes, the OAuth hand-off and password sign-in, a provider avatar,
  Hören playback and a Sprechen recording played back from its blob URL (`getUserMedia` is
  stubbed with a Web Audio stream: headless Chromium on macOS never settles it). It needs a fresh
  `npm run build`. The main Playwright config ignores this spec.
- After a deploy, confirm on the deploy preview with `curl -sI <url>` (look for
  `content-security-policy`, `strict-transport-security`, `permissions-policy`) and a browser
  console free of CSP errors.

## ESLint traps

- Type-aware linting uses `parserOptions.projectService` (not `project: [...]`). After a mass
  file move, restart the editor's ESLint server — a stale program shows phantom
  `no-unsafe-*` "error typed value" errors the CLI does not.
- Banning a bare folder import (`@shared/ui`) while allowing files under it
  (`@shared/ui/button.tsx`) needs a `regex` pattern: a gitignore-style `group` that matches the
  folder also matches everything beneath it, and a `!` negation cannot re-include a child of an
  excluded parent.
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
- **The merge boundary is GitHub branch protection, server-side.** `.claude/hooks/guard-git.sh`
  is accident prevention for Claude sessions, **not a security control**: a client-side hook
  that reads shell text can always be sidestepped (a script file, `python -c`, curl to the REST
  API, a renamed binary). Security reviews of it (2026-10-12, four rounds) were accepted on that
  basis — do not keep extending its parser. It stays fail-open on its own errors, because a
  fail-closed bug once blocked every Bash call.
- Within that scope, `guard-git.sh` is a second layer, not the boundary. Merges are an **allowlist**:
  only the literal standalone `gh pr merge <n> --squash [--delete-branch]` passes, and only when
  `gh pr checks <n> --required` is all green (run in the project dir with `GH_REPO` unset). Any
  other gh command carrying a merge word, and any gh+merge inside `bash -c`/`eval`/`xargs`/`$(…)`/
  backticks, is refused. Consequence: edit files that mention those words with the Edit tool, not
  a Bash heredoc. Also refused: `git push --all` / `--mirror`.
- Every code review (frontend-reviewer, /code-review, caveman-review, ponytail-review) starts by
  running `npm run typecheck` and `npm run lint -- --max-warnings=0` over the WHOLE codebase and
  reports any error as a blocker, not only issues in the diff.

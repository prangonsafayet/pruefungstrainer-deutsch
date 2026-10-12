# Trap ledger

One line per trap: symptom → rule. Every entry happened in this repo. Long-form stories live in
the local, gitignored `docs/lessons.local.md`. Append dated entries (`YYYY-MM-DD`) under the
right area; see `.claude/rules/memory.md`.

## Persistence

- B1/B2 progress vanished on sign-in → a new `ProgressDatabase` field is three edits:
  `normalizeDatabase` defaults it, `mergeProgress` merges it, a test asserts the merge.
- A storage key nearly renamed → keys are user data; `npm run check:storage-keys` (CI, pre-push,
  PostToolUse hook) fails if a baseline key disappears. New keys only, never reuse.
- Unwrapped legacy run still lost → a migration satisfies the consumer (old shape said `level`,
  new says `trainer`); test resuming the old payload end to end.
- Checkboxes re-pointed at other work → `learnDone` keys are `d<day>t<index>`; never renumber
  curriculum days or tasks, rewrite text in place.
- Unknown key kept by `normalizeDatabase`, dropped by `mergeProgress` → follow the value to the
  write that persists it; assert on the serialised payload.
- Importing an old backup emptied newer slices → per slice: present replaces, absent keeps.
- "Delete" refilled by the next device → a union-only merge cannot delete; copy must say so.
- Answer map read raw → keys (`l1.0`, `w.text`) never change; read via `shared/lib/answers.ts`.
- 2026-10-12: schema libraries (zod) rejected for `normalizeDatabase` → it must pass unknown keys
  through and preserve object identity.
- 2026-10-12: the DTZ run key is the new `telcTrainerDtzRunV1` → never reuse
  `telcTrainerLevelRunV1` for another paper. Protected keys (never rename or remove):
  `telcTrainerV1`, `telcTrainerRunV1`, `telcTrainerLevelRunV1`, `telcTrainerDtzRunV1`,
  `telcTrainerAuth`, `telcTrainerTheme`.

## Lint and config

- Boundary rules dead for weeks → `no-restricted-imports`/`-syntax` replace, not merge, across
  flat-config entries; restate every pattern or use a different rule key; prove with a plant.
- `a/**` allowed bare `a` → list both forms; plant both.
- `.ts` under `tests/` unlinted → name extensions in `files`; "0 errors, N warnings" is a failure.
- `SyntaxError: Unexpected token '*'` → no globs inside `/* */` (`**/*` closes the comment).
- `no-unused-vars` on a name inside a function type in `tests/` → annotate the functions, not the
  record of functions.
- 2026-10-12: the DTZ format id is `'dtz-paper'` → the trainer-id lint ban forbids the literal
  `'dtz'` outside the registry.
- 2026-10-12: structure rules → no `index.*` barrels or folder imports (import the file, with
  its extension); every component/page in `Name/Name.tsx` with what only it uses; screens in
  `pages/`; hooks are `.tsx`; a feature imports only itself + `@shared` + `@content`, so code two
  features use moves to `src/shared/<domain>/`. Enforced by lint (`NO_BARRELS`,
  `feature-isolation-*`, `check-file`) and `npm run check:architecture` — do not re-litigate.
- 2026-10-12: a bare-folder ban (`@shared/ui`) that must allow `@shared/ui/button.tsx` → use a
  `regex` pattern; a gitignore `group` on the folder also matches its children.
- 2026-10-12: stale `no-unsafe-assignment` in the editor after mass moves, CLI clean → the IDE
  cached the `project` program; config now uses `projectService` — restart the ESLint server.
- 2026-10-12: `npx shadcn add` wrote into a literal `@shared/ui/` folder → the CLI reads paths
  from the ROOT `tsconfig.json` only; it also emits `import { cn } from "cn"` — fix by hand.
- 2026-10-12: `npx shadcn add sheet` also added `cn` (an unrelated npm package) and the `radix-ui`
  umbrella to `package.json` → uninstall both and add the single `@radix-ui/react-<x>` package.

## Types

- `in` narrowing on a base interface failed to compile → `in` narrows a union only.
- `Array.isArray(unknown)` smuggled `any` → re-bind through `readonly unknown[]`, build with a
  type guard.
- `no-unnecessary-condition` sees through a widening `const` annotation → line-scoped disable
  with the reason, or a helper whose return type admits `undefined`.
- `Object.entries` over a finite-keyed `Partial` hides `undefined` → funnel untrusted JSON
  through a helper that declares what may really be there.
- 2026-10-12: binary format ternaries silently treat a third paper as dual-level → exhaustive
  switches over the format id.
- 2026-10-13: `parseIsoDate('2026-02-31')` returned 3 March → `new Date(y, m, d)` rolls an
  impossible day over; a parsed calendar day must format back to the string it came from.

## Tests

- Reduced-motion suite passed without emulating → `page.emulateMedia`, and assert the emulation.
- Contrast/chart suite seeded nothing → assert the seeded state arrived.
- Label test passed against its bug → fixtures must hit the case where things differ.
- Updater-during-render bug invisible → queue an update first, assert the consequence.
- Regex on feedback copy matched the success message → match failing-only phrasing, pin numbers.
- Guard test never reached its branch → build the fixture inside the guard's range.
- `bumpActivity({})` could not catch a wipe → seed prior state.
- Merge rule untested with one-sided fixtures → populate both sides; mutate to prove.
- Key enumeration passed with the rule deleted → enumerate values, with a positive control.
- `localStorage` probe warned and tested the fallback → install the test Storage, never probe.
- Hardcoded exam date → `seedProgress({ daysUntilExam })`.
- Render suite fails in a worktree (`useCallback` of null) → render tests run in the main checkout.
- `.ts` suite cannot import `vite.config.ts` (TS6307) → build logic in `scripts/*.mjs`, tested from JS.
- 2026-10-13: headless Chromium on macOS never settles `getUserMedia`, even with
  `--use-fake-device-for-media-stream` → stub it with a Web Audio
  `createMediaStreamDestination().stream`; MediaRecorder and blob playback stay real.
- 2026-10-13: a `page.route` stub does not hide a CSP violation → the renderer checks CSP before
  the request reaches the network layer, so stub backends freely in `e2e/csp.spec.js`.

## Dates, timers, React

- `new Date('YYYY-MM-DD')` is a day early west of Greenwich → `parseIsoDate`/`toIsoDate`;
  components may not touch the clock (lint).
- DST turned +1 day into 23:00 → `addDays` builds from date parts.
- Clock stalled while typing → interval depends on `phase`/`index` only; read values via refs.
- `getVoices()` render loop on machines without a German voice → `useSyncExternalStore`.
- Icon flush to a card edge → absolute offsets use the padding box; match the padding.
- Filter lifted out of a component changed a heading → list what the old code derived from;
  look in a browser.
- Token swap narrowed a union and changed a chip → a refactor diff has no unrequested visual change.
- 2026-10-12: h1 focused on first load in dev → StrictMode double-runs mount effects; detect a
  navigation by comparing the previous pathname, never with a first-render flag.
- 2026-10-12: a dark-only `dark:border-border` on Card erased callers' `border-l-primary` → do not
  colour a primitive's border per theme; dark hairlines live in the `--shadow-*` tokens.
- 2026-10-12: `.guide-toc a` stayed underlined → `@tailwindcss/typography` outranks
  `@layer components`; prose overrides are unlayered.
- 2026-10-12: e2e `getByRole` missed a visible link right after a Radix menu item click → Radix
  aria-hides the page until the menu's exit ends; wait for `getByRole('menu')` hidden.

## Exam facts and content

- Five invented telc facts spread to 20 papers, curricula and `validate.cjs` → facts come from
  the provider's documents; the verified `guide.ts` wins; validators can encode the bug.
- Invented numbers in guides → every figure is sourced or derivable, else deleted.
- "150–220 Wörter" moved into an `anweisung` → a number's provenance travels with it; app-owned
  numbers never sit in German task instructions or carry "official".
- "60% official" → keep the behaviour, move the claim ("this trainer marks at 60%").
- Synonym kept the wrong pragmatic role → check the Redemittel slot before the wording.
- Restored guidance contradicted every sample → grep what the guidance is about first.
- Correction scoped by file list missed curricula → scope by `grep` across `src/content/`.
- Validator "OK" from a global counter → per-item verdicts use a counter captured per item.
- Hören Teil 3 play count unsourced → record open questions; do not guess.
- 2026-10-12: DTZ facts only from `docs/dtz-format.local.md` → plays per text, per-Teil minutes,
  Schreiben word count and Sprechen prep time are NOT stated; never assert them.
- 2026-10-12: never reproduce g.a.s.t. (or telc) material → Modelltests are original texts.

## Bundling and build

- `manualChunks` ignored for a module in both eager and lazy graphs → synchronous trainer facts
  live on the eager `TrainerInfo`; verify chunks in a real browser's network log.
- `npm ci` "Missing from lock file" → regenerate the lockfile; never hand-edit it (hook blocks).
- Blank Playwright page (`require_react is not a function`) → no `server.open`, no stale
  `reuseExistingServer`.
- `VITE_*` change had no effect → inlined at build time; rebuild.
- 2026-10-12: og-image.png showed only the top-left of the card → `qlmanage` zooms non-square SVGs;
  `npm run images` renders it with `npx playwright screenshot` — look at the PNG after.
- 2026-10-13: date-fns `parse` added ~7 kB gzip to an eagerly preloaded chunk → for a fixed
  `yyyy-MM-dd` shape use the regex + `lightFormat` round-trip; `npm run check:bundle` shows it.
- 2026-10-13: `style-src-elem 'self'` broke every page → sonner and Radix's scroll lock
  (`react-style-singleton`) inject runtime `<style>` elements; `style-src` needs
  `'unsafe-inline'`, and a hash in the same directive would silently disable it.
- 2026-10-13: knip flagged exports reserved for issue #18 → tag them `@public` with the reason
  in JSDoc; knip skips them, and the `deadcode` CI job is blocking.

## Hooks and tooling

- 2026-10-12: a broken `guard-git.sh` blocked every Bash call → hooks fail open (exit 0 on their
  own errors, 2 only to block) and pass `bash -n` + `npm run test:hooks` before being wired.
- 2026-10-12: bash 3.2 (macOS) mis-parses quotes in a heredoc inside `$()` → use
  `IFS= read -r -d '' var <<'EOF' || true`.
- zsh loop ran once over a whole string → zsh does not word-split; use arrays.
- 2026-10-12: a path rewrite with `sed 's#…\b#…#'` changed nothing on macOS → BSD sed has no
  `\b`; grep for the old path after every bulk rewrite.
- Pre-push typechecks the working tree, not the pushed commit → push explicit SHAs when others
  are mid-edit, and say so.
- `git mv` + reformat lost rename history → move in one commit, reformat in the next.
- 2026-10-12: a scripted import rewrite missed `typeof import('…')` type positions and
  template-literal `vi.importActual(\`@content/${id}/…\`)`paths → after a mass move, grep`src/ tests/ e2e/` for every old path, not just import declarations.
- `git checkout -- file` after a plant reverted real work → `cp` a backup before planting.

## Agents and process

- `git add -A` swept another session's work into a commit → one writer per tree; stage explicit
  paths (hook-enforced); read `git status --porcelain` before committing.
- Worktree cut from `main`, not the feature branch → state the parent commit; agent verifies it.
- Reviewer's fix did not compile / did not fix → findings are evidence, not instructions.
- "Dead" default was a live bug → read every call site before deleting.
- Reports drifted ("2 of 11" was 3) → re-run gates yourself; visual claims need artefact paths.
- "One registry entry" was optimistic → measure extensibility by adding the thing.
- Plan code blocks disagreed with their own tests → a plan's code is unrun code; execute it.
- Narrowed memo deps changed nothing → write the identity assertion first; revert each half.
- 2026-10-12: one writer per tree for cross-cutting refactors; subagents stage explicit paths.

## Concurrency (2026-10-12)

- Committing while another agent edits the same tree → lint-staged backs up and restores unstaged
  changes around the hook, so the other agent's in-flight edits can vanish or be clobbered on disk.
  **Rule:** never `git commit` while any writer agent is running in the tree; commit between phases.
- 2026-10-12: dependency sweep — the MCR playwright manifest URL returns 404 without an `Accept: application/vnd.oci.image.index.v1+json` header even for existing tags → check tag existence with that header (or `/v2/playwright/tags/list`). knip cannot see `lint-staged` used only by `.husky/pre-commit` → it is in `knip.json` ignoreDependencies. Dev-only `npm audit` residue (braces via eslint-plugin-check-file, postcss-selector-parser via @tailwindcss/typography) has no fix; prod audit is 0.

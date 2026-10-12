---
name: audit
description: Run this repo's security, dependency, dead-code, lint and invariant audit — prod dependency audit (gating), dev audit (report), zero-warning lint plus the TODO(redesign) rules, Prettier, the architecture/CSS-token/storage-key guards, and knip — and report the findings. Use before a release, after dependency bumps, or when asked how healthy the codebase is.
allowed-tools: Bash(npm run *), Bash(npm audit *), Bash(npx knip *), Read, Grep, Glob
---

# Audit

Run in this order; keep going past failures (this is a report, not a gate) and collect each
result.

```bash
npm run guards              # check:architecture, check:css, check:storage-keys, test:hooks, audit:prod
npm run audit:all           # dev advisories, report only
npm run lint -- --max-warnings=0
npm run lint:todo           # every rule still parked in the TODO(redesign) block
npm run format:check
npm run knip                # unused files, exports, types and dependencies
```

## Reading the results

- **`audit:prod` (moderate+)** gates CI. Any finding there is a release blocker; name the
  package, the advisory and whether `npm audit fix` resolves it without a major bump.
- **`audit:all`**: known, unfixable dev advisories are `braces` (via micromatch via
  eslint-plugin-check-file, no upstream fix) and `postcss-selector-parser` (via
  @tailwindcss/typography, "fix" is a downgrade). Report anything else as new.
- **Lint warnings** are failures: a warning is how a silently-skipped file shows up.
- **`lint:todo`** counts against the `ENFORCED` flags in `eslint.config.js`. When a ban reaches
  zero, say so — its flag can flip to `true`.
- **`check:storage-keys`** failing means a persisted key vanished: stop and escalate, it is user
  data loss (see the persistence rule).
- **knip**: verify each finding before calling it dead. Exports used only by an in-progress
  trainer (DTZ) or the redesign are expected; a "dead" item has been a live bug here before.
  Fix config false positives in `knip.json`, never by deleting code in an audit.

## Report

One section per command: the exact tail of its output, then findings grouped by severity with
file and line. Say which stages passed. Do not fix anything unless asked.

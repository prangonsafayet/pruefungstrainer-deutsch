# ADR 0004: No schema library for the persisted document

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

The persisted document arrives from places the app does not control: an older build, a
newer build, the cloud row written by another device, or a hand-edited file. A schema
library such as zod is the obvious tool for untrusted data, and the project's
libraries-first rule ([ADR 0009](0009-libraries-over-hand-rolled.md)) asked the question
seriously. A library audit on 2026-10-12 looked at it.

## Decision

`normalizeDatabase` and `normalizeTrainerDoc` (`progressDb.ts`) stay hand-written, for two
properties a parse-and-rebuild schema breaks by default:

1. **Unknown keys pass through.** The function spreads the input first and then validates
   each known field. It also runs over the remote row before a merge. A whitelist rebuild
   there would let an older build strip a newer build's slice and push the stripped copy
   back, which deletes it from the cloud.
2. **Object identity is kept.** The function runs on every write. When nothing in
   `settings` or a trainer document changed, it returns the caller's own object
   (`withDefaults`, `unchanged`). Consumers memoise on those references. A fresh object per
   write re-rendered the exam runner on every keystroke.

Each field gets the smallest check that makes it safe:

- `Array.isArray` for a list;
- `isMap` (non-null, non-array object) for a map;
- defaults merged into `settings`.

A `null` map, once a crash on the next sign-in, now becomes `{}`. Import is stricter on
purpose: `readBackup` refuses the whole file and names the bad field.

## Consequences

- **No validation dependency.** The two guarantees are tested directly: unknown keys
  survive normalisation and the merge, and identity is kept on an unchanged write.
- **Shape checks, not deep checks.** The validation stops at the shape of each field.
  Readers use guarded accessors (`shared/lib/answers.ts`, `noUncheckedIndexedAccess`) for
  the values inside.
- **When to revisit.** A future schema library must support passthrough and structural
  sharing. Otherwise this decision stands.

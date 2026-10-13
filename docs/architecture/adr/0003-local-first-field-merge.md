# ADR 0003: Local-first storage with a field-by-field cloud merge

- **Status:** Accepted
- **Date:** 2026-08-19 (field-by-field rebuild since the B1/B2 slices, 2026-08-21)

## Context

Learners study on phones and laptops, often offline, and most never make an account. A
backend of our own would cost money, hosting and a privacy policy for data we do not need.
Sync must still never lose work, because a lost mock-exam attempt is an hour of a learner's
time.

## Decision

- **`localStorage` is the source of truth.** The whole `ProgressDatabase` is one JSON
  document under `telcTrainerV1`. It is written through on every change by
  `ProgressProvider`. The app is fully usable with no account, and from v3.0.0 with no
  network.
- **Sync is optional.** It goes through Supabase, with one `jsonb` row per user in
  `public.progress` behind row-level security. It runs once per sign-in, as a pull, a
  merge, a local replace and a push. After that, changes are pushed with a 1500 ms
  debounce. A push never runs before a pull has succeeded.
- **`mergeProgress` rebuilds every known field with its own rule.** Attempts are a union by
  id. `learnDone` is an OR. For `srs`, the higher box wins and the counters take the max.
  `activity` takes the max per day. Settings are last-write-wins by `_updatedAt`.
  `weakness` takes the max count and the later `lastSeen`. Each trainer document is merged
  the same way.
- **Unknown fields come from the newer side, untouched.** The merge never spreads one side
  over the other for the fields it knows.

## Consequences

- **No conflict dialog, and nothing the learner did is lost.** The merge never asks the
  learner to choose a side.
- **The merge cannot delete.** Unticking on one device is undone by another device's tick.
  "Delete all progress" must also clear the remote row (`clearRemote`: overwrite with a
  stamped empty document, then read it back — the browser has no delete policy), and copy
  must not promise a deletion the merge cannot deliver: other signed-in devices restore it.
- **A new field takes three edits:** `normalizeDatabase` defaults it, `mergeProgress`
  merges it, and a test asserts the serialised merged payload keeps it. The B1/B2 slices
  were once wiped because the merge was missing. `persistence-guardian` reviews every such
  change.
- **Older builds keep newer data.** An older build carries a newer build's slice as an
  unknown key and takes it whole from the newer side. Its own settings for that slice can
  therefore win if the older device wrote last. The v3.0.0 release notes tell users to
  update every device.

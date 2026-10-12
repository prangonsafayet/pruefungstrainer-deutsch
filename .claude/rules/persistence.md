---
paths:
  - 'src/features/progress-store/**'
  - 'src/features/account-sync/**'
  - 'src/shared/types/progress.ts'
  - 'src/shared/types/trainer.ts'
  - 'src/shared/lib/storage.ts'
  - 'src/shared/lib/answers.ts'
  - 'src/features/mock-exam/lib/runStore.ts'
  - 'supabase-setup.sql'
---

# Persistence, auth and sync

Any change here gets a `persistence-guardian` review before commit.

## The persisted document

`mergeProgress` (`features/account-sync/lib/mergeProgress.ts`) rebuilds the whole progress document
field by field when cloud sync reconciles local and remote — it does not spread one side over
the other. Adding a field to `ProgressDatabase` is three edits, not one: `normalizeDatabase`
defaults it, `mergeProgress` merges it, and a test asserts the merge survives. The B1/B2 slices
were once dropped exactly this way, and TypeScript could not see it because both fields are
optional. `exactOptionalPropertyTypes` means an unopened trainer is an ABSENT key, so both
functions are spelled out per trainer (the two trainer-id lint exemptions).

- `normalizeDatabase` runs on every write, so it must not rebuild unchanged objects (identity
  churn re-renders the runner).
- A "this drops data" fix follows the value to the write that persists it: there have been two
  whitelist rebuilds on one path. Assert on the payload that leaves
  (`JSON.parse(JSON.stringify(merged))`), not on the object in the middle.
- For a merge rule, populate the field on BOTH sides in the test, or the rule never runs. Prove
  an enumeration test with a positive control (the buggy `{ ...remote, ...local }`).
- A restore decides per slice: present (even empty) replaces, absent keeps.
- The union-only merge cannot express deletion; copy must not promise one it cannot deliver.
- A migration must satisfy the consumer, not just the parser: test resuming an old payload end
  to end (the legacy run shape named the trainer field `level`, not `trainer`).

## Storage keys are user data

Six keys are live and must never be renamed or removed: `telcTrainerV1`, `telcTrainerRunV1`,
`telcTrainerLevelRunV1`, `telcTrainerDtzRunV1`, `telcTrainerAuth`, `telcTrainerTheme`. The baseline is
`.claude/hooks/storage-keys.baseline`; `npm run check:storage-keys` (CI, pre-push and the
PostToolUse hook) fails if any disappears. New keys are allowed — add them with
`npm run check:storage-keys -- --update`.

## Answer map

Flat and stringly-keyed (`l1.0`, `h5.2`, `w.text`) because it is persisted and read by older
and newer builds. **Never change the key format.** Read values through the accessors in
`shared/lib/answers.ts`.

## learnDone

Keys are `d<day>t<index>`. Adding, removing or reordering a curriculum day or task silently
re-points completed checkboxes at different work. Rewrite task text in place; never renumber.

## Auth

- Never hash, store or log a password in the browser — Supabase Auth owns credentials.
- Supabase obscures whether an email exists: `signUp` "success" with no session means either
  "we emailed you" or "account exists"; the only signal is an empty `identities` array
  (`signUpOutcome.ts`).
- `signUp`'s resend is rate limited and silently no-ops; use `auth.resend` explicitly.
- PKCE only; the redirect target is built from the page's own origin. Never ship a
  `sb_secret_` / `service_role` key — the build and Settings both reject one.

## Environment variables

`VITE_*` values are inlined at build time: changing one needs a rebuild or dev-server restart;
a hosting dashboard change does nothing to an already-built site. Settings reports what the
running build was compiled with.

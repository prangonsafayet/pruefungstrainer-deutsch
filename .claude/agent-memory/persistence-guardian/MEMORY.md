# persistence-guardian memory

One dated line per lesson. Read before reviewing; append for every new data-loss path.

- 2026-10-12: `mergeProgress` rebuilds field by field — every `ProgressDatabase` field needs a default, a merge rule and a both-sides test.
- 2026-10-12: Protected keys: `telcTrainerV1`, `telcTrainerRunV1`, `telcTrainerLevelRunV1`, `telcTrainerAuth`, `telcTrainerTheme`; six once DTZ adds `telcTrainerDtzRunV1` (new — never reuse the level run key).
- 2026-10-12: `learnDone` keys are `d<day>t<index>`; any renumbering re-points completed work.
- 2026-10-12: Unknown keys must survive both `normalizeDatabase` and `mergeProgress` to the pushed payload.
- 2026-10-12: `normalizeDatabase` runs on every write; rebuilding unchanged objects churns identity and re-renders the runner.
- 2026-10-12: Legacy run payloads named the trainer field `level`; migrations are tested end to end.
- 2026-10-12: Restore: present slice replaces, absent slice keeps. The union merge cannot delete.
- 2026-10-12: Key-presence enumeration passes with a rule deleted — enumerate values with a positive control.
- 2026-10-12: zod rejected for `normalizeDatabase` — it must pass unknown keys through and keep identity.
- 2026-10-12: Older build with a newer `_updatedAt` and a stale copy of an unknown slice (e.g. `dtz`) overwrites it wholesale via the newer-side spread; attempts/ticks heal on the new device's next union, its slice settings do not.
- 2026-10-13: Recovery-copy write failing on quota leaves the damaged original on disk only until the first `update`; a smaller fresh doc then fits and overwrites it — the copy lives only in tab memory. Test the write AFTER a failed set-aside, not just the load.
- 2026-10-13: clearRemote's `syncing` guard was a closure snapshot taken before `await confirm`; a fullSync/online-retry/in-flight push landing after the read-back re-filled the cleared row with a success toast — guard with refs (await in-flight, block new), not render state.
- 2026-10-13: A clear that fails AFTER its upsert may have landed leaves a NEWER stamped empty row; the next fullSync lets its DEFAULT_SETTINGS win last-write-wins over local settings (examDate etc.) while the toast says "untouched". Re-stamp local on any post-upsert failure.

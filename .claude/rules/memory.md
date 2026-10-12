# Memory protocol

Agents and sessions must not repeat a trap someone already paid for.

**Before the first edit of a task**, read:

1. `.claude/memory/traps.md` — the committed trap ledger (one line each, by area).
2. `docs/lessons.local.md` — the local long-form ledger (gitignored; may be absent).
3. Your own `.claude/agent-memory/<agent>/MEMORY.md` if you are a project agent.

**After learning something expensive** — a trap that cost time, a review finding whose premise
was wrong, a user correction — append `symptom → cause → rule` as one dated line
(`YYYY-MM-DD`) to `.claude/memory/traps.md` under its area, and to your agent memory if it is
specific to your role.

- One fact per entry. Rules, not war stories.
- Never store secrets, credentials, user data or transient task state.
- A rule that is now enforced by lint or a hook says so, so nobody re-litigates it.

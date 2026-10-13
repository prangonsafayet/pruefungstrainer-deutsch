# ADR 0012: The Claude Code git hook is accident prevention, not a security boundary

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

`.claude/hooks/guard-git.sh` is a PreToolUse hook on Claude Code's Bash tool. It refuses:

- a commit or push on `main`;
- `--no-verify`;
- AI attribution in a commit message;
- `git add -A`;
- a merge that is not the literal `gh pr merge <n> --squash` with green required checks;
- `rm -r` of `src`, `docs` or `.git`.

Four rounds of security review on 2026-10-12 each found a new way around it: a script
file, `python -c`, curl to the GitHub REST API, a renamed binary. A hook that reads shell
text cannot see every way a process can reach git or GitHub.

## Decision

The hook is **accident prevention for Claude sessions, not a security control**. The merge
boundary is GitHub branch protection on `main`, which is enforced on the server:

- four required checks: Static analysis, Unit tests, End-to-end tests and Production build;
- `enforce_admins` on.

The hook stays **fail-open** on its own errors: it exits 0 and blocks only deliberately,
with exit 2. A fail-closed bug once blocked every Bash call. Its parser is not extended
further to chase bypasses. `npm run test:hooks` (part of `guards`) keeps its intended
behaviour tested.

## Consequences

- **Reviews of the hook judge accident prevention.** A bypass is expected and is not
  treated as a vulnerability. A gap in branch protection would be.
- **The hook can refuse harmless text.** It reads command text, not intent, so a Bash
  command whose text merely mentions a merge command can be refused. While these records
  were being written, it refused a heredoc that contained this ADR. Edit such files with
  the Edit or Write tool instead.
- **The same reasoning covers the other local gates.** `guard-files.sh`, the husky hooks
  and `check-invariants.sh` catch mistakes early. CI and branch protection are what hold.

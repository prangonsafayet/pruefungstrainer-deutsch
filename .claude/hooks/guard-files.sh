#!/usr/bin/env bash
# PreToolUse(Edit|MultiEdit|Write) guard. Exit 2 blocks the write and shows stderr to Claude.
#   - .env files hold real credentials; only .env.example is authored by hand.
#   - package-lock.json must come from npm: a hand-edited or partial lockfile drops other
#     platforms' native binaries and `npm ci` fails on Linux (see CONTRIBUTING.md).
# Persisted storage keys are guarded after the edit instead, by check-invariants.sh.
set -u

input=$(cat)

# `read -d ''` rather than `$(cat <<'JS' …)`: bash 3.2 (macOS) mis-parses quotes inside a
# heredoc nested in a command substitution.
IFS= read -r -d '' script <<'JS' || true
const path = require('node:path');
const payload = JSON.parse(require('node:fs').readFileSync(0, 'utf8') || '{}');
const name = path.basename(payload.tool_input?.file_path ?? '');
const block = reason => {
  process.stderr.write(`Blocked by .claude/hooks/guard-files.sh: ${reason}\n`);
  process.exit(2);
};
if (name.startsWith('.env') && name !== '.env.example')
  block(`${name} holds credentials and is never written by an agent. Edit .env.example, and ask the user to set real values themselves.`);
if (name === 'package-lock.json')
  block('package-lock.json is written by npm only. Run `npm install <pkg>` (or `npm install`) instead of editing it.');
JS

# Fail open: only a deliberate block (exit 2) stops the write; a crash in this hook must not.
printf '%s' "$input" | node -e "$script"
[ $? -eq 2 ] && exit 2
exit 0

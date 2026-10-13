#!/usr/bin/env bash
# PostToolUse(Edit|MultiEdit|Write) check. It cannot undo the edit; exit 2 puts stderr in
# front of Claude so it fixes the problem on the next turn.
#   1. Any edit under src/: every persisted storage key in the baseline must still exist
#      (scripts/check-storage-keys.mjs — the same check CI and pre-push run).
#   2. An edited .ts/.tsx under src/: ESLint that one file now, not at commit time.
set -u

input=$(cat)
project=${CLAUDE_PROJECT_DIR:-$(pwd)}

# Fail open on a malformed payload: only a real finding returns 2.
file=$(printf '%s' "$input" | node -e '
const p = JSON.parse(require("node:fs").readFileSync(0, "utf8") || "{}");
process.stdout.write(p.tool_input?.file_path ?? "");' 2>/dev/null) || exit 0

case "$file" in
  "$project"/src/*) ;;
  src/*) file="$project/$file" ;;
  *) exit 0 ;;
esac

# Only a real finding blocks; a crash of the checker itself fails open.
keys=$(node "$project/scripts/check-storage-keys.mjs" 2>&1)
if [ $? -ne 0 ] && printf '%s' "$keys" | grep -q 'disappeared'; then
  printf '!!! PERSISTED STORAGE KEY REMOVED !!!\n%s\n' "$keys" >&2
  exit 2
fi

case "$file" in
  *.ts | *.tsx) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

# ESLint exits 1 for lint problems and 2 for its own crash; only the first blocks.
out=$(cd "$project" && "$project/node_modules/.bin/eslint" --no-warn-ignored --max-warnings=0 "$file" 2>&1)
if [ $? -eq 1 ]; then
  printf 'ESLint fails on %s — fix it now:\n%s\n' "${file#"$project"/}" "$(printf '%s\n' "$out" | head -n 30)" >&2
  exit 2
fi
exit 0

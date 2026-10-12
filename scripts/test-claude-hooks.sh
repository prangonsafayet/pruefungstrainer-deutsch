#!/usr/bin/env bash
# Feeds sample payloads to every Claude Code hook in .claude/hooks/ and asserts the exit code
# (2 = blocked, 0 = allowed) and, for the prompt router, the class it names. Fast and offline.
# Run: npm run test:hooks
set -u

root=$(cd "$(dirname "$0")/.." && pwd)
hooks="$root/.claude/hooks"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
pass=0
fail=0

# A throwaway repo on main, for the "you are on main" cases.
git init -q -b main "$tmp/onmain"

json() { node -e 'process.stdout.write(JSON.stringify(JSON.parse(process.argv[1])))' "$1"; }

# expect <exit> <hook> <payload-json> <label> [stdout-substring] [project-dir]
expect() {
  local want=$1 hook=$2 payload=$3 label=$4 needle=${5:-} project=${6:-$root}
  local out code
  out=$(printf '%s' "$payload" | CLAUDE_PROJECT_DIR="$project" "$hooks/$hook" 2>/dev/null)
  code=$?
  if [ "$code" -ne "$want" ]; then
    printf 'FAIL  %-18s %s (exit %s, wanted %s)\n' "$hook" "$label" "$code" "$want"
    fail=$((fail + 1))
  elif [ -n "$needle" ] && ! printf '%s' "$out" | grep -qF -- "$needle"; then
    printf 'FAIL  %-18s %s (stdout lacks "%s": %s)\n' "$hook" "$label" "$needle" "$out"
    fail=$((fail + 1))
  else
    pass=$((pass + 1))
  fi
}

bash_cmd() { json "{\"tool_name\":\"Bash\",\"tool_input\":{\"command\":$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$1")},\"cwd\":\"${2:-$root}\"}"; }
file_edit() { json "{\"tool_name\":\"Edit\",\"tool_input\":{\"file_path\":\"$1\"},\"cwd\":\"$root\"}"; }
prompt() { json "{\"prompt\":$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$1")}"; }

# --- guard-git.sh: blocked ---
expect 2 guard-git.sh "$(bash_cmd 'git add -A')" 'git add -A'
expect 2 guard-git.sh "$(bash_cmd 'gh pr merge 32 --squash --admin')" 'gh pr merge --admin'
# A PR number that cannot be resolved (or no gh auth, as in CI) cannot prove its checks: blocked.
expect 2 guard-git.sh "$(bash_cmd 'gh pr merge 999999999 --squash')" 'gh pr merge, checks unverifiable'
expect 2 guard-git.sh "$(bash_cmd 'git add .')" 'git add .'
expect 2 guard-git.sh "$(bash_cmd 'git add --all')" 'git add --all'
expect 2 guard-git.sh "$(bash_cmd 'cd src && git add -A')" 'git add -A after cd'
expect 2 guard-git.sh "$(bash_cmd 'git commit -am "Fix timer"')" 'git commit -am'
expect 2 guard-git.sh "$(bash_cmd 'git commit -m "Fix timer" --no-verify')" 'commit --no-verify'
expect 2 guard-git.sh "$(bash_cmd 'git commit -n -m "Fix timer"')" 'commit -n'
expect 2 guard-git.sh "$(bash_cmd 'git push --no-verify')" 'push --no-verify'
expect 2 guard-git.sh "$(bash_cmd $'git commit -m "Fix timer\n\nCo-Authored-By: Claude <noreply@anthropic.com>"')" 'Co-Authored-By trailer'
expect 2 guard-git.sh "$(bash_cmd 'git commit -m "$(cat <<EOF
Fix timer

Generated with Claude Code
EOF
)"')" 'Generated-with footer in a heredoc'
expect 2 guard-git.sh "$(bash_cmd 'git push -f origin main')" 'force push to main'
expect 2 guard-git.sh "$(bash_cmd 'git push --force origin HEAD:main')" 'force push HEAD:main'
expect 2 guard-git.sh "$(bash_cmd 'git push origin feat/x:refs/heads/main')" 'push to refs/heads/main'
expect 2 guard-git.sh "$(bash_cmd 'git commit -m "Fix timer"' "$tmp/onmain")" 'commit while on main'
expect 2 guard-git.sh "$(bash_cmd 'git push -u origin HEAD' "$tmp/onmain")" 'push while on main'
expect 2 guard-git.sh "$(bash_cmd "git -C $tmp/onmain commit -m x")" 'git -C <main repo> commit'
expect 2 guard-git.sh "$(bash_cmd 'rm -rf src')" 'rm -rf src'
expect 2 guard-git.sh "$(bash_cmd 'rm -fr ./docs/')" 'rm -fr ./docs/'
expect 2 guard-git.sh "$(bash_cmd "rm -r -f $root/.git")" 'rm -r -f <abs>/.git'
# --- guard-git.sh: allowed ---
expect 0 guard-git.sh "$(bash_cmd 'git add src/a.ts e2e/b.spec.js')" 'git add explicit paths'
expect 0 guard-git.sh "$(bash_cmd 'git commit -m "Fix the exam timer stalling"' "$tmp/notmain")" 'commit outside a repo'
expect 0 guard-git.sh "$(bash_cmd 'git push -u origin HEAD')" 'push a feature branch'
expect 0 guard-git.sh "$(bash_cmd 'git status --porcelain && git diff')" 'read-only git'
expect 0 guard-git.sh "$(bash_cmd 'echo "git add -A"')" 'git add -A inside an echo string'
expect 0 guard-git.sh "$(bash_cmd 'rm -rf node_modules dist')" 'rm -rf node_modules'
expect 0 guard-git.sh "$(bash_cmd 'rm -rf src/features/x/old')" 'rm -rf a path inside src'
expect 0 guard-git.sh "$(bash_cmd 'npm test')" 'npm test'

# --- guard-files.sh ---
expect 2 guard-files.sh "$(file_edit "$root/.env")" '.env'
expect 2 guard-files.sh "$(file_edit "$root/.env.local")" '.env.local'
expect 2 guard-files.sh "$(file_edit "$root/package-lock.json")" 'package-lock.json'
expect 0 guard-files.sh "$(file_edit "$root/.env.example")" '.env.example'
expect 0 guard-files.sh "$(file_edit "$root/src/shared/ui/button.tsx")" 'src/shared/ui file'

# --- check-invariants.sh, against a scratch project so nothing in src/ is touched ---
fake="$tmp/project"
mkdir -p "$fake/scripts" "$fake/.claude/hooks" "$fake/src" "$fake/node_modules/.bin"
cp "$root/scripts/check-storage-keys.mjs" "$fake/scripts/"
cp "$root/.claude/hooks/storage-keys.baseline" "$fake/.claude/hooks/"
keys=$(grep -v '^#' "$fake/.claude/hooks/storage-keys.baseline" | sed "s/.*/'&'/" | tr '\n' ' ')
printf 'export const KEYS = [%s];\n' "$(printf '%s' "$keys" | sed 's/ /, /g; s/, $//')" > "$fake/src/keys.ts"
printf '#!/bin/sh\nexit 0\n' > "$fake/node_modules/.bin/eslint"
chmod +x "$fake/node_modules/.bin/eslint"
expect 0 check-invariants.sh "$(file_edit "$fake/src/keys.ts")" 'all keys present, lint clean' '' "$fake"
expect 0 check-invariants.sh "$(file_edit "$root/README.md")" 'edit outside src/' '' "$fake"
printf '#!/bin/sh\necho "1:1 error planted"\nexit 1\n' > "$fake/node_modules/.bin/eslint"
expect 2 check-invariants.sh "$(file_edit "$fake/src/keys.ts")" 'lint failure on the edited file' '' "$fake"
sed -i.bak "s/'telcTrainerTheme', *//; s/, *'telcTrainerTheme'//" "$fake/src/keys.ts"
expect 2 check-invariants.sh "$(file_edit "$fake/src/keys.ts")" 'a baseline storage key removed' '' "$fake"

# --- every hook fails open on its own errors: only a deliberate block may exit 2 ---
for hook in guard-git.sh guard-files.sh check-invariants.sh route-prompt.sh; do
  expect 0 "$hook" 'not json {' 'malformed payload fails open'
done

# --- route-prompt.sh: never blocks, names the class ---
expect 0 route-prompt.sh "$(prompt 'Where is the exam timer defined?')" 'lookup' 'Model routing: lookup'
expect 0 route-prompt.sh "$(prompt 'rename useFoo to useBar')" 'mechanical' 'Model routing: mechanical'
expect 0 route-prompt.sh "$(prompt 'Add a DTZ Modelltest 03')" 'content' 'Model routing: content'
expect 0 route-prompt.sh "$(prompt 'Redesign the dashboard cards')" 'ui' 'Model routing: ui'
expect 0 route-prompt.sh "$(prompt 'refactor how cloud sync merges progress')" 'architecture' 'Model routing: architecture'
expect 0 route-prompt.sh "$(prompt 'review my diff before I push')" 'review' 'Model routing: review'
expect 0 route-prompt.sh "$(prompt 'hello there')" 'unknown → silent'
out=$(printf '%s' "$(prompt 'hello there')" | "$hooks/route-prompt.sh")
if [ -n "$out" ]; then
  echo "FAIL  route-prompt.sh   unknown prompt printed: $out"
  fail=$((fail + 1))
fi
out=$(printf '%s' "$(prompt 'review my diff')" | "$hooks/route-prompt.sh")
if ! printf '%s' "$out" | node -e 'const o=JSON.parse(require("fs").readFileSync(0,"utf8"));if(o.hookSpecificOutput.hookEventName!=="UserPromptSubmit")process.exit(1)'; then
  echo "FAIL  route-prompt.sh   output is not the UserPromptSubmit JSON shape: $out"
  fail=$((fail + 1))
fi

echo "hooks: $pass passed, $fail failed"
[ "$fail" -eq 0 ]

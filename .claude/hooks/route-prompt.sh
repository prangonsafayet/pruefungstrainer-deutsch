#!/usr/bin/env bash
# UserPromptSubmit hint: classify the prompt by keywords and name the model and agent that
# .claude/rules/model-routing.md routes it to. Advisory only — it never blocks, and an
# unrecognised prompt prints nothing.
set -u

input=$(cat)

# `read -d ''` rather than `$(cat <<'JS' …)`: bash 3.2 (macOS) mis-parses quotes inside a
# heredoc nested in a command substitution.
IFS= read -r -d '' script <<'JS' || true
const payload = JSON.parse(require('node:fs').readFileSync(0, 'utf8') || '{}');
const prompt = String(payload.prompt ?? '');
/* First match wins, so the costlier, more specific classes come first. */
const CLASSES = [
  ['architecture', /\b(refactor\w*|architecture|persist\w*|merge\w*|sync\w*|security|migrat\w*)\b/i, 'opus / main thread (+ persistence-guardian for stored data)'],
  ['review', /\b(review\w*|audit\w*|verify|verification)\b/i, 'sonnet / frontend-reviewer, verify or audit skill (opus for the final pre-merge review)'],
  ['content', /\b(modelltests?|exam content|curricul\w*|guide|vocab\w*|dtz|teil|leitpunkte)\b/i, 'sonnet / exam-author, then content-fact-checker'],
  ['ui', /\b(re-?design|design|ui|ux|layout|styl\w*|tokens?|contrast)\b/i, 'sonnet / ui-designer (opus for a system-wide redesign)'],
  ['mechanical', /\b(rename|format\w*|typos?|bump|translat\w*|add tests? for|copy)\b/i, 'sonnet (haiku if trivial) / general-purpose'],
  ['lookup', /\b(where|what|find|explain|which|how does)\b/i, 'haiku / Explore']
];
const hit = CLASSES.find(([, pattern]) => pattern.test(prompt));
if (hit) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: `Model routing: ${hit[0]} → ${hit[2]}; see .claude/rules/model-routing.md`
      }
    }) + '\n'
  );
}
JS

printf '%s' "$input" | node -e "$script" 2>/dev/null
exit 0

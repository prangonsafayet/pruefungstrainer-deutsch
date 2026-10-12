#!/usr/bin/env bash
# PreToolUse(Bash) guard for this repo's git and filesystem rules. Exit 2 blocks the command
# and shows stderr to Claude; exit 0 lets it run. Every rule here is a non-negotiable from
# CLAUDE.md or a lesson that cost real time (docs/lessons.local.md):
#   - no commit or push while on main, no push that targets main, no force push to main
#   - no --no-verify (the husky hooks are the local gate)
#   - no AI attribution in a commit message (Co-Authored-By, "Generated with")
#   - no `git add -A` / `.` / `--all`, no `git commit -a`: stage explicit paths, because a
#     whole-tree stage in a shared checkout commits another session's work
#   - no `rm -rf` of src, docs or .git
#   - no `gh pr merge` unless every required check on the PR has passed, and never `--admin`
set -u

input=$(cat)

# `read -d ''` rather than `$(cat <<'JS' …)`: bash 3.2 (macOS) mis-parses quotes inside a
# heredoc nested in a command substitution.
IFS= read -r -d '' script <<'JS' || true
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const payload = JSON.parse(require('node:fs').readFileSync(0, 'utf8') || '{}');
const command = payload.tool_input?.command ?? '';
const cwd = payload.cwd || process.cwd();
const project = process.env.CLAUDE_PROJECT_DIR || cwd;

const block = reason => {
  process.stderr.write(`Blocked by .claude/hooks/guard-git.sh: ${reason}\n`);
  process.exit(2);
};

/* A small shell-word splitter: quotes, backslashes, and the operators that start a new
   simple command. Enough to read argv; it never executes anything. */
const simpleCommands = text => {
  const commands = [[]];
  let word = null;
  let quote = null;
  const push = () => {
    if (word !== null) commands[commands.length - 1].push(word);
    word = null;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && i + 1 < text.length) word += text[++i];
      else word += ch;
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      word ??= '';
    } else if (ch === '\\' && i + 1 < text.length) {
      word = (word ?? '') + text[++i];
    } else if (/\s/.test(ch) && ch !== '\n') {
      push();
    } else if (ch === '\n' || ch === ';' || ch === '&' || ch === '|' || ch === '(' || ch === ')') {
      push();
      commands.push([]);
    } else {
      word = (word ?? '') + ch;
    }
  }
  push();
  return commands.filter(argv => argv.length > 0);
};

/* `git [-C dir] [-c k=v] <sub> args…` → { sub, args, dir }, or null for anything else. */
const gitCall = argv => {
  let i = 0;
  while (i < argv.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(argv[i])) i++;
  if (argv[i] === 'command' || argv[i] === 'exec') i++;
  if (path.basename(argv[i] ?? '') !== 'git') return null;
  let dir = cwd;
  i++;
  while (i < argv.length && argv[i].startsWith('-')) {
    if (argv[i] === '-C') dir = path.resolve(dir, argv[++i] ?? '');
    else if (argv[i] === '-c') i++;
    i++;
  }
  return { sub: argv[i], args: argv.slice(i + 1), dir };
};

const branchIn = dir => {
  try {
    return execFileSync('git', ['-C', dir, 'symbolic-ref', '--short', '-q', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return '';
  }
};

/* Short flags may be bundled: `-am` holds `-a`. */
const hasShort = (args, letter) => args.some(a => /^-[A-Za-z]+$/.test(a) && a.includes(letter));
const ATTRIBUTION = /co-authored-by|generated with/i;

/* `env FOO=1 gh …`, `command gh …`, `exec gh …` all run gh. */
const stripPrefix = argv => {
  let i = 0;
  for (;;) {
    if (argv[i] === 'env' || argv[i] === 'command' || argv[i] === 'exec' || argv[i] === 'nohup') i++;
    else if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(argv[i] ?? '')) i++;
    else break;
  }
  return argv.slice(i);
};

/* A merge hidden inside a nested shell string (`bash -c "gh pr merge …"`, `eval …`) cannot be
   parsed reliably, so it is refused outright: run the merge as its own command. */
const NESTED_MERGE = /(?:\b(?:bash|sh|zsh)\s+-c|\beval\b|\bxargs\b)[^\n]*gh\s+(?:pr\s+merge|api\b[^\n]*pulls\/\d+\/merge)/;
if (NESTED_MERGE.test(command)) block('a PR merge nested in `bash -c` / `eval` / `xargs` cannot be checked. Run `gh pr merge <n>` as its own command.');

for (const argv of simpleCommands(command)) {
  const git = gitCall(argv);
  if (git) {
    const { sub, args, dir } = git;
    const onMain = () => ['main', 'master'].includes(branchIn(dir));

    if ((sub === 'commit' || sub === 'push') && args.includes('--no-verify'))
      block(`--no-verify skips the husky gate. Fix what the hook reports instead.`);

    if (sub === 'commit') {
      if (onMain()) block('you are on main. Never commit to main: issue → branch → PR → green CI → squash-merge.');
      if (hasShort(args, 'n')) block('`git commit -n` is --no-verify. Fix what the hook reports instead.');
      if (args.includes('--all') || hasShort(args, 'a'))
        block('`git commit -a` stages the whole tree. Stage explicit paths (`git add <path> …`) and commit those.');
      const fileIndex = args.findIndex(a => a === '-F' || a === '--file');
      let message = command;
      if (fileIndex !== -1) {
        try {
          message += readFileSync(path.resolve(dir, args[fileIndex + 1] ?? ''), 'utf8');
        } catch {}
      }
      if (ATTRIBUTION.test(message))
        block('the commit message carries AI attribution (Co-Authored-By / "Generated with"). This repo forbids it — non-negotiable 6. Remove the trailer.');
    }

    if (sub === 'push') {
      const force = args.some(a => a === '--force' || a.startsWith('--force-with-lease') || a === '--force-if-includes') || hasShort(args, 'f');
      const refspecs = args.filter(a => !a.startsWith('-')).slice(1);
      const targetsMain = refspecs.some(r => /(^|:)(refs\/heads\/)?(main|master)$/.test(r.replace(/^\+/, '')));
      if (onMain()) block('you are on main. Never push from main: push a feature branch and open a PR.');
      if (targetsMain) block(`${force ? 'force-' : ''}pushing to main. main only changes through a squash-merged PR.`);
    }

    if (sub === 'add') {
      const all = args.some(a => a === '-A' || a === '--all' || a === '.' || a === './' || a === ':/' || a === '*');
      if (all) block('stage explicit paths (`git add <path> <path>`), never -A / . / --all — in a shared checkout that commits another session\'s work.');
    }
    continue;
  }

  /* Merging is gated on the PR's required checks (typecheck, zero-warning lint, format,
     guards, unit, e2e, build). Branch protection (enforce_admins) is the real gate; this is
     the second layer, so it must check the SAME PR in the SAME repo the merge acts on. */
  const ghArgv = stripPrefix(argv);
  if (path.basename(ghArgv[0] ?? '') === 'gh' && ghArgv[1] === 'pr' && ghArgv[2] === 'merge') {
    const rest = ghArgv.slice(3);
    if (rest.includes('--admin')) block('`gh pr merge --admin` bypasses branch protection. Wait for the required checks instead.');
    // Flags of `gh pr merge` that take a value; their values are not the PR selector.
    const VALUED = new Set(['-b', '--body', '-F', '--body-file', '-t', '--subject', '-A', '--author-email', '--match-head-commit', '-R', '--repo']);
    let selector;
    let repo;
    for (let i = 0; i < rest.length; i++) {
      const a = rest[i];
      if (a.startsWith('--') && a.includes('=')) {
        const [flag, value] = [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)];
        if (flag === '--repo') repo = value;
        continue;
      }
      if (VALUED.has(a)) {
        if (a === '-R' || a === '--repo') repo = rest[i + 1];
        i++;
        continue;
      }
      if (a.startsWith('-')) continue;
      if (selector !== undefined) block('`gh pr merge` got more than one PR argument; name exactly one PR.');
      selector = a;
    }
    let buckets;
    try {
      const out = execFileSync(
        'gh',
        ['pr', 'checks', ...(selector ? [selector] : []), ...(repo ? ['--repo', repo] : []), '--required', '--json', 'name,bucket'],
        { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
      );
      buckets = JSON.parse(out);
    } catch {
      block('could not read the PR\'s required checks (`gh pr checks --required`). Merge only after confirming they all pass.');
    }
    const failing = buckets.filter(c => c.bucket !== 'pass' && c.bucket !== 'skipping');
    if (buckets.length === 0) block('the PR reports no required checks yet. Wait for CI to start and pass.');
    if (failing.length) block(`required checks not green: ${failing.map(c => `${c.name} (${c.bucket})`).join(', ')}. Fix them before merging.`);
    continue;
  }
  /* The REST merge endpoint skips everything above. */
  if (path.basename(ghArgv[0] ?? '') === 'gh' && ghArgv[1] === 'api' && ghArgv.some(a => /pulls\/\d+\/merge\b/.test(a)))
    block('merging through `gh api …/pulls/N/merge` skips the checks gate. Use `gh pr merge <n>` after CI is green.');

  if (path.basename(argv[0]) === 'rm') {
    const flags = argv.slice(1).filter(a => a.startsWith('-'));
    const recursive = flags.some(f => f === '--recursive' || /^-[A-Za-z]*[rR]/.test(f));
    if (!recursive) continue;
    const protectedDirs = ['src', 'docs', '.git'].map(d => path.join(project, d));
    for (const target of argv.slice(1).filter(a => !a.startsWith('-'))) {
      const resolved = path.resolve(cwd, target.replace(/\/\*?$/, '') || '/');
      if (protectedDirs.includes(resolved) || resolved === project)
        block(`refusing to delete ${path.relative(project, resolved) || 'the project root'} recursively. Remove the specific files you mean instead.`);
    }
  }
}
JS

# Fail open: only a deliberate block (exit 2) stops the command; a crash in this hook must not.
printf '%s' "$input" | node -e "$script"
[ $? -eq 2 ] && exit 2
exit 0

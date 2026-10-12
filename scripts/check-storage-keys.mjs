import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The persisted storage keys are live user data: renaming or dropping one silently orphans
 * every learner's progress. This compares the `'telcTrainer…'` literals in src/ against the
 * committed baseline and fails if any baseline key disappeared. New keys are allowed; they
 * are reported so they can be added to the baseline (`--update` appends them, never removes).
 *
 * Shared by CI, the pre-push hook and the Claude Code PostToolUse hook, so there is one
 * implementation of the invariant.
 */

const ROOT = new URL('..', import.meta.url).pathname;
const BASELINE = join(ROOT, '.claude/hooks/storage-keys.baseline');
const KEY = /'(telcTrainer[A-Za-z0-9]*)'/g;

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.(ts|tsx|js|mjs)$/.test(entry.name) ? [path] : [];
  });

const current = new Set(
  walk(join(ROOT, 'src')).flatMap(file => [...readFileSync(file, 'utf8').matchAll(KEY)].map(m => m[1]))
);
const baselineText = readFileSync(BASELINE, 'utf8');
const baseline = baselineText
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'));

const missing = baseline.filter(key => !current.has(key));
const added = [...current].filter(key => !baseline.includes(key)).sort();

if (missing.length > 0) {
  console.error(
    `Persisted storage key(s) disappeared from src/: ${missing.join(', ')}.\n` +
      'These keys are live user data. Renaming or removing one orphans every stored copy. ' +
      'Restore the literal (or migrate explicitly and say so in review) before going further.'
  );
  process.exit(1);
}

if (added.length > 0 && process.argv.includes('--update')) {
  writeFileSync(BASELINE, `${baselineText.trimEnd()}\n${added.join('\n')}\n`);
  console.log(`Added to the baseline: ${added.join(', ')}.`);
} else if (added.length > 0) {
  console.log(
    `New storage key(s), not yet in the baseline: ${added.join(', ')} (allowed; add with --update).`
  );
}

console.log(`Storage keys OK: all ${baseline.length} baseline keys present.`);

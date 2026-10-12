import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Architecture checks ESLint cannot express, because they compare files with each other.
 *
 * One name, one component: no two `.tsx` files anywhere under src/ may share a basename.
 * Across features, a shared name is usually one component written twice — it belongs in
 * src/shared/components. Inside one feature or across layers, it is two things a reader (and
 * an editor's file search) cannot tell apart — the name should say which paper, feature or
 * role it serves (`DualLevelLesenModule`, `SyncSignInCard`). Exact-name matches only; a
 * deliberate pair goes in ALLOWED_TWINS with the reason next to it.
 *
 * The neighbouring rules — a feature barrel must not re-export UI, src/shared must not import
 * features, no feature deep-imports another — are ESLint rules (`npm run lint`).
 * `--report-only` prints the findings and exits 0.
 */

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

/** `<File>.tsx` names two files may legitimately share, each with its reason. */
const ALLOWED_TWINS = new Map([]);

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.tsx') ? [path] : [];
  });

const owners = new Map();
for (const file of walk(SRC)) {
  const name = file.slice(file.lastIndexOf('/') + 1);
  owners.set(name, [...(owners.get(name) ?? []), relative(ROOT, file)]);
}

const twins = [...owners].filter(([name, paths]) => paths.length > 1 && !ALLOWED_TWINS.has(name));

if (twins.length === 0) {
  console.log('Architecture OK: every component file name under src/ is unique.');
} else {
  console.error(
    `${twins.length} component file name(s) used more than once under src/ — rename so each says what it is, or move a shared one to src/shared/components:`
  );
  for (const [name, paths] of twins) console.error(`  ${name}\n    ${paths.join('\n    ')}`);
  if (!process.argv.includes('--report-only')) process.exit(1);
  console.error('(--report-only: not failing.)');
}

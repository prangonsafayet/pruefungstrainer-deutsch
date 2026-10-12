import { existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Architecture checks ESLint cannot express, because they compare files with each other.
 *
 * Shared-if-used-twice: two features each owning a component file with the same name is
 * usually one component written twice — it belongs in src/shared/components. Exact-name
 * matches only, so a hit is worth a look rather than proof; a deliberate pair goes in
 * ALLOWED_TWINS with the reason next to it.
 *
 * The neighbouring rules — a feature barrel must not re-export UI, src/shared must not import
 * features, no feature deep-imports another — are ESLint rules (`npm run lint`).
 * `--report-only` prints the findings and exits 0.
 */

const ROOT = new URL('..', import.meta.url).pathname;
const FEATURES = join(ROOT, 'src/features');

/** `<File>.tsx` names two features may legitimately both own, each with its reason. */
const ALLOWED_TWINS = new Map([]);

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.tsx') ? [path] : [];
  });

const owners = new Map();
for (const feature of readdirSync(FEATURES)) {
  const components = join(FEATURES, feature, 'components');
  if (!existsSync(components)) continue;
  for (const file of walk(components)) {
    const name = file.slice(file.lastIndexOf('/') + 1);
    owners.set(name, [...(owners.get(name) ?? []), relative(ROOT, file)]);
  }
}

const features = path => new Set(path.map(p => p.split('/')[2]));
const twins = [...owners].filter(([name, paths]) => features(paths).size > 1 && !ALLOWED_TWINS.has(name));

if (twins.length === 0) {
  console.log('Architecture OK: no component name is owned by two features.');
} else {
  console.error(
    `${twins.length} component name(s) owned by more than one feature — move the shared one to src/shared/components:`
  );
  for (const [name, paths] of twins) console.error(`  ${name}\n    ${paths.join('\n    ')}`);
  if (!process.argv.includes('--report-only')) process.exit(1);
  console.error('(--report-only: not failing.)');
}

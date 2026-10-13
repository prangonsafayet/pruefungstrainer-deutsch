import { readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Architecture checks about the shape of the tree, which ESLint (a file-at-a-time linter)
 * cannot express. `--report-only` prints the findings and exits 0.
 *
 *   no-index          no `index.*` file anywhere under src/ — there are no barrels; every
 *                     import names the file that defines the thing.
 *   no-routes         a feature's screens live in `pages/`; a `routes/` folder is the old layout.
 *   feature-pages     every feature has a `pages/` folder. A folder with no screen is not a
 *                     feature: its code belongs in src/shared.
 *   own-folder        a component (`PascalCase.tsx` under components/ or pages/) lives in a
 *                     folder named after it — `components/ScoreMeter/ScoreMeter.tsx` — never
 *                     loose in components/, pages/ or a group folder. src/shared/ui is exempt:
 *                     the shadcn CLI writes flat kebab-case files there.
 *   pascal-folder     a PascalCase folder is a component's own folder: it sits under
 *                     components/ or pages/ and holds `<Folder>.tsx`.
 *   hook-tsx          hooks use the `.tsx` extension: no `use*.ts` under src/.
 *   feature-isolation a feature imports only itself, @shared and @content (also an ESLint rule).
 *   unique-name       no two `.tsx` files share a basename. Across features a shared name is
 *                     usually one component written twice — it belongs in src/shared. Inside
 *                     one layer it is two things a reader cannot tell apart, so the name should
 *                     say which paper or role it serves (`DualLevelLesenModule`,
 *                     `SyncSignInCard`). A deliberate pair goes in ALLOWED_TWINS with its reason.
 */

/* fileURLToPath, not `.pathname`: a checkout path with a space would stay `%20`. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');

/** `<File>.tsx` names two files may legitimately share, each with its reason. */
const ALLOWED_TWINS = new Map([]);

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? [{ path, dir: true }, ...walk(path)] : [{ path, dir: false }];
  });

const entries = walk(SRC).map(entry => ({ ...entry, rel: relative(ROOT, entry.path).split(sep).join('/') }));
const files = entries.filter(entry => !entry.dir).map(entry => entry.rel);
const dirs = entries.filter(entry => entry.dir).map(entry => entry.rel);

const PASCAL = /^[A-Z][A-Za-z0-9]*$/;
const isVendoredUi = path => path.startsWith('src/shared/ui/');
const underComponents = path => /\/(components|pages)\//.test(path);

/** @type {[string, string][]} */
const findings = [];
const fail = (rule, message) => findings.push([rule, message]);

for (const file of files) {
  const name = basename(file);
  const stem = name.replace(/\.[^.]+$/, '');
  if (/^index\.[cm]?[jt]sx?$/.test(name))
    fail('no-index', `${file}: barrels are not allowed — import the defining file`);
  if (/^use[A-Z].*\.ts$/.test(name)) fail('hook-tsx', `${file}: hooks use .tsx — rename to ${stem}.tsx`);

  if (name.endsWith('.tsx') && PASCAL.test(stem) && underComponents(file) && !isVendoredUi(file)) {
    const parent = basename(dirname(file));
    if (parent === 'components' || parent === 'pages') {
      fail('own-folder', `${file}: move into its own folder, ${dirname(file)}/${stem}/${name}`);
    } else if (parent !== stem) {
      fail(
        'own-folder',
        `${file}: its folder is "${parent}" — a component lives in a folder named after it (${stem}/${name})`
      );
    }
  }
}

for (const dir of dirs) {
  const name = basename(dir);
  if (dir.startsWith('src/features/') && name === 'routes')
    fail('no-routes', `${dir}: screens live in pages/<Page>/<Page>.tsx`);
  if (PASCAL.test(name) && !isVendoredUi(dir)) {
    if (!underComponents(`${dir}/`))
      fail('pascal-folder', `${dir}: a PascalCase folder belongs under components/ or pages/`);
    else if (!files.includes(`${dir}/${name}.tsx`))
      fail('pascal-folder', `${dir}: a component folder must hold ${name}.tsx`);
  }
}

const features = readdirSync(join(SRC, 'features'), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);
for (const feature of features) {
  if (!dirs.includes(`src/features/${feature}/pages`)) {
    fail(
      'feature-pages',
      `src/features/${feature}: has no pages/ — a folder with no screen belongs in src/shared`
    );
  }
}

/* Alias and relative specifiers alike: a relative one is resolved, so `../other` that lands in
   another feature is caught too. */
const SPECIFIER = /(?:from\s+|import\s*\(\s*)['"]((?:@features\/|\.{1,2}\/)[^'"]+)['"]/g;
const featureOf = (file, spec) => {
  if (spec.startsWith('@features/')) return spec.split('/')[1];
  const target = join(dirname(file), spec).split(sep).join('/');
  return target.startsWith('src/features/') ? target.split('/')[2] : null;
};
for (const file of files.filter(path => /^src\/features\/[^/]+\/.*\.tsx?$/.test(path))) {
  const own = file.split('/')[2];
  for (const [, spec] of readFileSync(join(ROOT, file), 'utf8').matchAll(SPECIFIER)) {
    const target = featureOf(file, spec);
    if (target !== null && target !== own) {
      fail(
        'feature-isolation',
        `${file}: imports ${spec} — features never import each other; move shared code to src/shared`
      );
    }
  }
}

const owners = new Map();
for (const file of files.filter(path => path.endsWith('.tsx'))) {
  const name = basename(file);
  owners.set(name, [...(owners.get(name) ?? []), file]);
}
for (const [name, paths] of owners) {
  if (paths.length > 1 && !ALLOWED_TWINS.has(name)) {
    fail(
      'unique-name',
      `${name} is used more than once — rename so each says what it is, or move a shared one to src/shared:\n    ${paths.join('\n    ')}`
    );
  }
}

if (findings.length === 0) {
  console.log(
    'Architecture OK: no barrels, every component in its own folder, every feature has pages/ and imports only itself, hooks are .tsx, component names unique.'
  );
} else {
  console.error(`${findings.length} architecture finding(s):`);
  for (const [rule, message] of findings) console.error(`  [${rule}] ${message}`);
  if (!process.argv.includes('--report-only')) process.exit(1);
  console.error('(--report-only: not failing.)');
}

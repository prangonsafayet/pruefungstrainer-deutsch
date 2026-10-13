import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Colour in CSS comes from the design tokens, never from a literal. The tokens are defined in
 * src/styles/index.css inside `:root`, `.dark` and `@theme` blocks; a raw colour (hex, a colour
 * function, or the keywords white/black) anywhere else in any src/ stylesheet fails this check.
 * `color-mix(in oklab, var(--token) …)` is token-based and passes.
 *
 * The ESLint twin for class names and inline styles is `local/no-raw-colours`.
 * `--report-only` prints the findings and exits 0 (used while the redesign clears them).
 */

/* fileURLToPath, not `.pathname`: a checkout path with a space would stay `%20`. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TOKEN_FILE = 'src/styles/index.css';
const TOKEN_BLOCK = /^(?::root|\.dark|@theme)\b/;
const RAW_COLOUR = [
  [/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/, 'hex colour'],
  [/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/, 'colour function'],
  [/:\s*(?:[^;]*\s)?(?:white|black)\b/i, 'named colour']
];

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.css') ? [path] : [];
  });

/** Every declaration in a stylesheet, with its line and the block preludes around it. */
const declarations = css => {
  /* Blank out comments but keep their newlines, so line numbers stay true. */
  const source = css.replace(/\/\*[\s\S]*?\*\//g, comment => comment.replace(/[^\n]/g, ' '));
  const found = [];
  const stack = [];
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch !== '{' && ch !== '}' && ch !== ';') continue;
    const raw = source.slice(start, i);
    const text = raw.trim();
    const line = source.slice(0, start + raw.length - raw.trimStart().length).split('\n').length;
    if (ch === '{') stack.push(text);
    else if (text) found.push({ text, line, preludes: [...stack] });
    if (ch === '}') stack.pop();
    start = i + 1;
  }
  return found;
};

const findings = walk(join(ROOT, 'src')).flatMap(file => {
  const name = relative(ROOT, file);
  return declarations(readFileSync(file, 'utf8'))
    .filter(({ preludes }) => !(name === TOKEN_FILE && preludes.some(p => TOKEN_BLOCK.test(p))))
    .flatMap(({ text, line }) => {
      const hit = RAW_COLOUR.find(([pattern]) => pattern.test(text));
      return hit ? [`${name}:${line}  ${hit[1]}  ${text.replace(/\s+/g, ' ')}`] : [];
    });
});

if (findings.length === 0) {
  console.log('CSS tokens OK: no raw colour outside the token blocks.');
} else {
  console.error(`${findings.length} raw colour(s) outside the token blocks — use a var(--token):`);
  for (const finding of findings) console.error(`  ${finding}`);
  if (!process.argv.includes('--report-only')) process.exit(1);
  console.error('(--report-only: not failing.)');
}

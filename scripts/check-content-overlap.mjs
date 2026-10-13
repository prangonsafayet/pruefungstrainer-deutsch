#!/usr/bin/env node
/**
 * Originality check: compares word 7-gram shingles between official reference texts in
 * `_reference/` (gitignored — never commit it) and every file under `src/content/`.
 *
 *   node scripts/check-content-overlap.mjs [--n 7] [--ref _reference] [--min 2]
 *
 * Reference files: any `.txt` / `.md` under the reference dir (extract PDFs to text first,
 * e.g. `pdftotext -layout test.pdf test.txt`). Shingles made only of generic instruction
 * wording ("Lesen Sie den Text …") are ignored. A file is reported when it shares at least
 * `--min` shingles with one reference; hits are grouped by line so a cluster (a copied or
 * lightly reworded passage) stands out from a stray stock phrase. Exits 1 when a file has a
 * cluster of 3+ hits within 10 lines, so it can gate CI on a machine that has the texts.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const N = Number(arg('n', '7'));
const REF_DIR = arg('ref', '_reference');
const MIN = Number(arg('min', '2'));
const CONTENT_DIR = 'src/content';

/* Instruction and rubric wording every exam in the format shares. A shingle consisting
   mostly of these words is format, not content. */
const GENERIC = new Set(
  (
    'lesen sie den text die texte und lösen entscheiden ob aufgaben aufgabe richtig falsch ' +
    'hören hörtext kreuzen an markieren auf dem antwortbogen schreiben sprechen teil ' +
    'sie haben minuten zeit welche anzeige passt zu welcher situation zu jeder es gibt ' +
    'nur eine lösung lösungen beispiel dazu das zum für jede jeden ist nicht im in der die ' +
    'zweimal einmal sätze satz wörter wort lücken lücke ergänzen sie a b c d e f g h i j k l x'
  ).split(' ')
);
const words = text => text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const isGeneric = gram => gram.filter(w => GENERIC.has(w)).length / gram.length >= 0.7;

const shinglesByLine = text => {
  const out = new Map();
  /* Tokens keep their line number, so a shingle may span a line break. */
  const lines = text.split('\n');
  const tokens = [];
  lines.forEach((line, i) => words(line).forEach(w => tokens.push([w, i + 1])));
  for (let k = 0; k + N <= tokens.length; k += 1) {
    const gram = tokens.slice(k, k + N).map(t => t[0]);
    if (isGeneric(gram)) continue;
    const key = gram.join(' ');
    if (!out.has(key)) out.set(key, tokens[k][1]);
  }
  return out;
};

const walk = (dir, exts) =>
  readdirSync(dir).flatMap(name => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return walk(p, exts);
    return exts.some(e => p.endsWith(e)) ? [p] : [];
  });

if (!existsSync(REF_DIR)) {
  console.log(`No ${REF_DIR}/ directory — nothing to compare. Put extracted official texts there.`);
  process.exit(0);
}

const refs = walk(REF_DIR, ['.txt', '.md']).map(f => ({
  file: f,
  grams: new Set(shinglesByLine(readFileSync(f, 'utf8')).keys())
}));
let clustered = 0;

for (const file of walk(CONTENT_DIR, ['.ts', '.tsx', '.json'])) {
  const mine = shinglesByLine(readFileSync(file, 'utf8'));
  for (const ref of refs) {
    const hits = [...mine].filter(([g]) => ref.grams.has(g)).sort((a, b) => a[1] - b[1]);
    if (hits.length < MIN) continue;
    /* Group hits whose lines are within 10 of each other. */
    const clusters = [];
    for (const hit of hits) {
      const last = clusters.at(-1);
      if (last && hit[1] - last.at(-1)[1] <= 10) last.push(hit);
      else clusters.push([hit]);
    }
    const big = clusters.filter(c => c.length >= 3);
    if (big.length) clustered += 1;
    console.log(
      `\n${file}  ↔  ${ref.file}: ${hits.length} shared ${N}-grams${big.length ? '  ⚠ CLUSTER' : ''}`
    );
    for (const c of clusters) console.log(`  L${c[0][1]}–${c.at(-1)[1]} (${c.length}): "${c[0][0]}"`);
  }
}

console.log(
  clustered ? `\n${clustered} file/reference pair(s) with clustered overlap.` : '\nNo clustered overlap.'
);
process.exit(clustered ? 1 : 0);

#!/usr/bin/env node
/**
 * Bundle budget, run after `npm run build`: prints every JS chunk's gzip size and fails when
 *
 *   - the entry chunk (the module script `dist/index.html` loads) grows past its baseline
 *     plus 10% — every visitor pays for it before the first paint; or
 *   - any per-trainer content chunk (`content-<id>-*.js`) passes 160 kB gzip — one trainer's
 *     exams, curriculum and vocabulary must stay a download a phone can afford.
 *
 *   npm run build && npm run check:bundle
 *
 * Raise ENTRY_BASELINE_BYTES deliberately, in the commit that explains the growth.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

/** Entry chunk gzip size when the budget was set (2026-10-13), in bytes. */
export const ENTRY_BASELINE_BYTES = 55_192;
export const ENTRY_HEADROOM = 1.1;
export const CONTENT_CHUNK_LIMIT_BYTES = 160_000;

const kB = bytes => `${(bytes / 1000).toFixed(2)} kB`;

/**
 * @param {{ file: string, gzip: number }[]} chunks
 * @param {string} entry file name of the entry chunk
 * @returns {string[]} one message per broken budget
 */
export const budgetFailures = (chunks, entry) => {
  const failures = [];
  const entryChunk = chunks.find(chunk => chunk.file === entry);
  if (!entryChunk) failures.push(`entry chunk ${entry} not found in dist/assets`);
  else if (entryChunk.gzip > ENTRY_BASELINE_BYTES * ENTRY_HEADROOM)
    failures.push(
      `entry ${entry} is ${kB(entryChunk.gzip)} gzip — over its budget of ${kB(ENTRY_BASELINE_BYTES * ENTRY_HEADROOM)} (baseline ${kB(ENTRY_BASELINE_BYTES)} + 10%)`
    );
  for (const chunk of chunks.filter(candidate => /^content-.+\.js$/.test(candidate.file)))
    if (chunk.gzip > CONTENT_CHUNK_LIMIT_BYTES)
      failures.push(
        `content chunk ${chunk.file} is ${kB(chunk.gzip)} gzip — over ${kB(CONTENT_CHUNK_LIMIT_BYTES)}`
      );
  return failures;
};

const main = () => {
  const assets = path.join('dist', 'assets');
  const entry = /<script type="module"[^>]*src="\/assets\/([^"]+)"/.exec(
    readFileSync('dist/index.html', 'utf8')
  )?.[1];
  if (!entry) throw new Error('dist/index.html loads no module script — run npm run build first');

  const chunks = readdirSync(assets)
    .filter(file => file.endsWith('.js'))
    .map(file => ({ file, gzip: gzipSync(readFileSync(path.join(assets, file))).length }))
    .sort((a, b) => b.gzip - a.gzip);

  console.table(
    chunks
      .filter(chunk => chunk.file === entry || chunk.gzip >= 5_000)
      .map(chunk => ({
        chunk: chunk.file,
        gzip: kB(chunk.gzip),
        budget:
          chunk.file === entry
            ? `entry ≤ ${kB(ENTRY_BASELINE_BYTES * ENTRY_HEADROOM)}`
            : chunk.file.startsWith('content-')
              ? `content ≤ ${kB(CONTENT_CHUNK_LIMIT_BYTES)}`
              : ''
      }))
  );

  const failures = budgetFailures(chunks, entry);
  if (failures.length > 0) {
    for (const failure of failures) console.error(`Bundle budget: ${failure}`);
    process.exit(1);
  }
  console.log('Bundle budget ok.');
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();

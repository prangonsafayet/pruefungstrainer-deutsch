#!/usr/bin/env node
/**
 * The CSP in `public/_headers` allows inline scripts by hash only (`script-src 'self'
 * 'sha256-…'`). Edit the pre-paint theme script in `index.html` — or let Vite rewrite it — and
 * the hash goes stale: the browser blocks the script and dark mode flashes on every load.
 * This recomputes the hash of every inline script in the BUILT `dist/index.html` and fails
 * unless `script-src` lists exactly those hashes.
 *
 *   npm run build && npm run check:csp
 *
 * Data blocks (`type="application/ld+json"`) are not executed, so CSP ignores them and so
 * does this check.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import { parseHeaders } from './serve-dist-with-headers.mjs';

const EXECUTABLE = new Set(['', 'module', 'text/javascript', 'application/javascript']);

/** `'sha256-…'` source expressions for every inline, executable `<script>` in `html`. */
export const inlineScriptHashes = html =>
  [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attributes]) => !/\bsrc=/.test(attributes ?? ''))
    .filter(([, attributes]) => EXECUTABLE.has(/\btype="([^"]*)"/.exec(attributes ?? '')?.[1] ?? ''))
    .map(
      ([, , body]) =>
        `'sha256-${createHash('sha256')
          .update(body ?? '', 'utf8')
          .digest('base64')}'`
    );

/** The `'sha256-…'` sources listed in the `script-src` of the `/*` CSP. */
export const cspScriptHashes = headersText => {
  const csp = parseHeaders(headersText)
    .filter(block => block.pattern === '/*')
    .flatMap(block => block.headers)
    .find(([name]) => name.toLowerCase() === 'content-security-policy')?.[1];
  if (!csp) throw new Error('public/_headers sets no Content-Security-Policy for /*');
  const scriptSrc = csp
    .split(';')
    .map(directive => directive.trim().split(/\s+/))
    .find(([name]) => name === 'script-src');
  if (!scriptSrc) throw new Error('the CSP has no script-src directive');
  return scriptSrc.filter(source => source.startsWith("'sha256-"));
};

const main = () => {
  const html = readFileSync('dist/index.html', 'utf8');
  const headers = readFileSync('public/_headers', 'utf8');
  const want = inlineScriptHashes(html).sort();
  const have = cspScriptHashes(headers).sort();

  if (JSON.stringify(want) !== JSON.stringify(have)) {
    console.error(
      'public/_headers is stale: its script-src hashes do not match the inline scripts in dist/index.html.\n' +
        `  built inline scripts: ${want.join(' ') || '(none)'}\n` +
        `  script-src lists:     ${have.join(' ') || '(none)'}\n` +
        'Replace the sha256 sources in the Content-Security-Policy line of public/_headers with the first list.'
    );
    process.exit(1);
  }
  if (readFileSync('dist/_headers', 'utf8') !== headers) {
    console.error('dist/_headers differs from public/_headers — rebuild first (npm run build).');
    process.exit(1);
  }
  console.log(
    `CSP ok: script-src allows exactly the ${String(want.length)} inline script(s) in dist/index.html.`
  );
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();

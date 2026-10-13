import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  budgetFailures,
  CONTENT_CHUNK_LIMIT_BYTES,
  ENTRY_BASELINE_BYTES
} from '../../scripts/check-bundle-size.mjs';
import { cspScriptHashes, inlineScriptHashes } from '../../scripts/check-csp.mjs';
import { headersFor, parseHeaders } from '../../scripts/serve-dist-with-headers.mjs';
import { trainerDescriptors } from '../../scripts/trainerRegistry.mjs';

/* The release checks are code too: the _headers parser the CSP suite serves with, the inline
   script hashing that keeps the CSP in step with index.html, and the bundle budget. */

const sha = body => `'sha256-${createHash('sha256').update(body).digest('base64')}'`;

describe('_headers', () => {
  const blocks = parseHeaders(
    [
      '# comment',
      '/*',
      '  X-A: 1',
      '  X-B: two: parts',
      '',
      '/assets/*',
      '  Cache-Control: immutable',
      '/',
      '  X-A: again'
    ].join('\n')
  );

  it('parses blocks and keeps colons inside a value', () => {
    expect(blocks.map(block => block.pattern)).toEqual(['/*', '/assets/*', '/']);
    expect(blocks[0]?.headers).toEqual([
      ['X-A', '1'],
      ['X-B', 'two: parts']
    ]);
  });

  it('applies every matching block, splat or exact', () => {
    expect(headersFor(blocks, '/assets/app.js').map(([name]) => name)).toEqual([
      'X-A',
      'X-B',
      'Cache-Control'
    ]);
    expect(headersFor(blocks, '/settings').map(([name]) => name)).toEqual(['X-A', 'X-B']);
  });

  it('refuses one header set by two matching blocks', () => {
    expect(() => headersFor(blocks, '/')).toThrow(/X-A is set twice/);
  });

  it('the real public/_headers never sets one header twice for any path', () => {
    const real = parseHeaders(readFileSync('public/_headers', 'utf8'));
    for (const path of ['/', '/index.html', '/settings', '/assets/index-abc.js', '/favicon.svg', '/sw.js'])
      expect(() => headersFor(real, path)).not.toThrow();
  });

  it('serves the service worker no-cache, so an update is never hidden behind a cache', () => {
    const real = parseHeaders(readFileSync('public/_headers', 'utf8'));
    expect(headersFor(real, '/sw.js')).toContainEqual(['Cache-Control', 'no-cache']);
  });
});

describe('web app manifest', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));

  it('is installable: standalone, scoped to the site, with 192, 512 and a maskable 512 icon on disk', () => {
    expect(manifest).toMatchObject({ id: '/', start_url: '/', scope: '/', display: 'standalone' });
    const pngs = manifest.icons.filter(icon => icon.type === 'image/png');
    expect(pngs.map(icon => `${icon.sizes} ${icon.purpose}`).sort()).toEqual([
      '192x192 any',
      '512x512 any',
      '512x512 maskable'
    ]);
    for (const icon of [...manifest.icons, ...manifest.shortcuts.flatMap(shortcut => shortcut.icons)])
      expect(existsSync(`public${icon.src}`), icon.src).toBe(true);
  });

  it("has a shortcut to every trainer's dashboard, and to Learn", () => {
    const urls = manifest.shortcuts.map(shortcut => shortcut.url);
    for (const { basePath } of trainerDescriptors()) expect(urls).toContain(basePath || '/');
    expect(urls).toContain('/learn');
  });
});

describe('CSP script hashes', () => {
  it('hashes inline executable scripts only — not data blocks, not external scripts', () => {
    const html =
      '<script type="application/ld+json">{"a":1}</script><script>\n  theme();\n</script>' +
      '<script type="module" src="/assets/x.js"></script><script type="module">boot()</script>';
    expect(inlineScriptHashes(html)).toEqual([sha('\n  theme();\n'), sha('boot()')]);
  });

  it('reads the hashes listed in script-src of the /* policy', () => {
    const headers =
      "/*\n  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-abc='; style-src 'self'\n";
    expect(cspScriptHashes(headers)).toEqual(["'sha256-abc='"]);
  });

  it('the source index.html inline script is what public/_headers allows', () => {
    /* Vite copies the theme script through untouched; check-csp re-proves it on the build. */
    expect(inlineScriptHashes(readFileSync('index.html', 'utf8'))).toEqual(
      cspScriptHashes(readFileSync('public/_headers', 'utf8'))
    );
  });
});

describe('bundle budget', () => {
  const entry = 'index-abc.js';

  it('passes at the edge and fails just past it', () => {
    const limit = Math.floor(ENTRY_BASELINE_BYTES * 1.1);
    expect(budgetFailures([{ file: entry, gzip: limit }], entry)).toEqual([]);
    expect(budgetFailures([{ file: entry, gzip: limit + 1 }], entry)).toHaveLength(1);
  });

  it('caps every content chunk, and only content chunks', () => {
    const chunks = [
      { file: entry, gzip: 1 },
      { file: 'content-b2-x.js', gzip: CONTENT_CHUNK_LIMIT_BYTES + 1 },
      { file: 'react-x.js', gzip: CONTENT_CHUNK_LIMIT_BYTES * 2 }
    ];
    expect(budgetFailures(chunks, entry)).toEqual([expect.stringContaining('content-b2-x.js')]);
  });

  it('fails when the entry chunk is missing', () => {
    expect(budgetFailures([], entry)).toEqual([expect.stringContaining('not found')]);
  });
});

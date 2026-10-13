#!/usr/bin/env node
/**
 * Serves `dist/` the way Netlify does as far as the security headers go: every block of
 * `dist/_headers` whose path pattern matches the request contributes its headers, and any path
 * with no file behind it falls back to `index.html` (the SPA rewrite in `_redirects`).
 * `vite preview` ignores `_headers`, so without this the CSP is never exercised before deploy.
 *
 *   node scripts/serve-dist-with-headers.mjs [--port 4174] [--dir dist]
 *
 * No dependency: node:http plus a narrow `_headers` parser. Two matching blocks that set the
 * same header are refused — Netlify's merge of such a pair is not something to rely on.
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const arg = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : (process.argv[index + 1] ?? fallback);
};

const ROOT = path.resolve(arg('dir', 'dist'));
const PORT = Number(arg('port', '4174'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml'
};

/**
 * `_headers` → `[{ pattern, headers: [[name, value]] }]`. A non-indented line opens a block
 * with its path; indented `Name: value` lines belong to it; `#` lines are comments.
 *
 * @param {string} text
 */
export const parseHeaders = text => {
  /** @type {{ pattern: string, headers: [string, string][] }[]} */
  const blocks = [];
  for (const raw of text.split('\n')) {
    if (raw.trim() === '' || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      blocks.push({ pattern: raw.trim(), headers: [] });
      continue;
    }
    const block = blocks.at(-1);
    const colon = raw.indexOf(':');
    if (!block || colon === -1) throw new Error(`_headers: cannot parse line "${raw}"`);
    block.headers.push([raw.slice(0, colon).trim(), raw.slice(colon + 1).trim()]);
  }
  return blocks;
};

/** Netlify path patterns: exact, or a trailing `*` splat matching any rest. */
export const matches = (pattern, urlPath) =>
  pattern.endsWith('*') ? urlPath.startsWith(pattern.slice(0, -1)) : urlPath === pattern;

/** Headers for one path; throws if two matching blocks both set one header. */
export const headersFor = (blocks, urlPath) => {
  /** @type {Map<string, [string, string]>} */
  const out = new Map();
  for (const block of blocks.filter(candidate => matches(candidate.pattern, urlPath))) {
    for (const [name, value] of block.headers) {
      const key = name.toLowerCase();
      if (out.has(key)) throw new Error(`_headers: ${name} is set twice for ${urlPath}`);
      out.set(key, [name, value]);
    }
  }
  return [...out.values()];
};

const serve = () => {
  const blocks = parseHeaders(readFileSync(path.join(ROOT, '_headers'), 'utf8'));
  createServer((request, response) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname);
    } catch {
      /* A malformed escape (`/%`) would otherwise throw out of the handler and kill the server. */
      response.writeHead(400).end();
      return;
    }
    let file = path.join(ROOT, urlPath);
    /* `ROOT + sep`: a bare prefix test let `/%2e%2e/dist-evil/…` out into a sibling folder. */
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
      response.writeHead(400).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!existsSync(file)) file = path.join(ROOT, 'index.html');
    try {
      for (const [name, value] of headersFor(blocks, urlPath)) response.setHeader(name, value);
    } catch (error) {
      response.writeHead(500).end(String(error));
      return;
    }
    response.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
    createReadStream(file).pipe(response);
  }).listen(PORT, () => {
    console.log(`Serving ${ROOT} with its _headers on http://localhost:${String(PORT)}`);
  });
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) serve();

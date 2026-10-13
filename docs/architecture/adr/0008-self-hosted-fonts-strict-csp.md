# ADR 0008: Self-hosted fonts and a strict Content Security Policy

- **Status:** Accepted
- **Date:** 2026-10-12 (fonts), 2026-10-13 (CSP in `public/_headers`)

## Context

The redesign uses Nunito and Nunito Sans. Loading them from Google Fonts would:

- send every learner's IP address to a third party;
- need `font-src` and `style-src` exceptions;
- break offline use.

The app holds a learner's auth session in `localStorage`, so script injection is the
attack that matters most.

## Decision

- **Self-hosted fonts.** The fonts ship through `@fontsource-variable/nunito` and
  `@fontsource-variable/nunito-sans`, imported in `src/styles/index.css` (wght axis only).
  The service worker precaches only the latin subsets.
- **One header source.** `public/_headers` is the only source of response headers
  (`netlify.toml` sets none). The `/*` block sets:
  - `default-src 'self'`;
  - `script-src 'self'` plus **one hash**, for the pre-paint theme script in `index.html`.
    There is no `unsafe-inline` for scripts;
  - `font-src 'self'` and `object-src 'none'`;
  - `frame-ancestors 'none'`, `base-uri 'self'` and `form-action 'self'`;
  - `worker-src 'self'` and `manifest-src 'self'`;
  - `upgrade-insecure-requests`;
  - `connect-src` limited to `'self'`, `https://*.supabase.co` and
    `https://api.languagetool.org`;
  - `img-src` adding only the two OAuth avatar hosts;
  - `media-src 'self' blob:`, for recorder playback;
  - HSTS (2 years, preload), `nosniff`, `X-Frame-Options: DENY`, a `Permissions-Policy`
    that allows only `microphone=(self)`, and `Cross-Origin-Opener-Policy: same-origin`.
- **The service worker adds no inline script.** It is registered from the bundle, not by
  an injected `registerSW.js`.

## Consequences

- **`style-src` keeps `'unsafe-inline'`.** Sonner and Radix's scroll lock inject `<style>`
  elements with runtime content, so a hash cannot cover them. A tighter split was tested
  and broke every page.
- **Changing the inline script means a new hash.** `npm run check:csp` prints the new hash
  for `script-src`.
- **CI holds the CSP to the build.** `npm run test:csp` serves `dist/` with the real
  headers and fails on any violation, across every screen, both themes, sign-in, Hören
  playback and a Sprechen recording.
- **Some origins must be added by hand.** A Supabase custom domain or a self-hosted
  LanguageTool must be added to `connect-src`, or it is blocked.

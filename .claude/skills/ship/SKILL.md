---
name: ship
description: Pre-deployment checklist for this app — verification, build artefacts, SEO and env configuration for Netlify plus Supabase auth. Use before deploying or when a deployed build misbehaves in a way local dev does not.
---

# Ship

## 1. Verify

Run the `verify` skill (it includes `npm run guards`, whose `audit:prod` must be clean). Do not
deploy on a red pipeline.

## 2. Check what the build actually contains

```bash
npm run build
```

Read the build log for the `supabase-env-check` line. It says one of:

- `Supabase cloud sync will be enabled (https://…)` — good.
- `Building WITHOUT Supabase credentials` — the deployed site will have sync off,
  regardless of what the hosting dashboard shows.

`VITE_*` values are **inlined at build time**. Setting an env var somewhere does
nothing until a new build runs. This is the single most common cause of "sync
worked locally but not in production".

Then confirm the SEO artefacts came out with absolute URLs (they are dropped
rather than emitted wrong when `VITE_SITE_URL` is unset):

```bash
grep -o 'rel="canonical" href="[^"]*"' dist/index.html
cat dist/robots.txt dist/sitemap.xml
```

## 3. Netlify

`netlify.toml` already sets the build command (`npm run build`), publish
directory (`dist`) and the catch-all rewrite to `index.html`. That rewrite is not
optional — without it, reloading a deep route (a trainer's history or an attempt review)
returns 404.
`public/_redirects` carries the same rewrite for a drag-and-dropped `dist`.
`public/_headers` is the only source of response headers (CSP, HSTS, caching) for both
routes. Before deploying: `npm run check:bundle`, `npm run check:csp` and `npm run test:csp`
after the build; after deploying, `curl -sI` the preview for `content-security-policy` and
check the browser console for CSP errors (see the tooling-ci rule).

Environment variables must be set under **Site configuration → Environment
variables**, then a **new deploy triggered**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` — the anon/publishable key only
- `VITE_AUTH_PROVIDERS` — e.g. `google,github`
- `VITE_SITE_URL` — the public URL

## 4. Supabase

- **Authentication → URL Configuration**: Site URL set to the deployment, and
  Redirect URLs listing every origin sign-in happens from (production and
  `http://localhost:5173/**`). This is the allowlist that stops a tampered link
  redirecting a sign-in elsewhere.
- **Authentication → Providers**: Google and/or GitHub enabled, each with its
  client id and secret. The provider's own OAuth app must list Supabase's
  `/auth/v1/callback` URL as an authorised redirect.
- **SQL Editor**: `supabase-setup.sql` run at least once. It is idempotent. It
  creates the `progress` table with row-level security scoping every read and
  write to `auth.uid()`, and deliberately grants no delete.

## 5. Never

Ship a `sb_secret_` or `service_role` key. The build and the Settings panel both
reject one, but the reason matters: it bypasses row-level security entirely.

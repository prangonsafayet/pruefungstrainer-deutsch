---
paths:
  - 'src/shared/ui/**'
  - 'src/**/components/**'
  - 'src/**/pages/**'
  - 'src/styles/**'
  - '**/*.css'
---

# UI and design system

A redesign ("warm & friendly") is in progress; the `ui-designer` agent owns it and fills in the
token details below as they land. Verify appearance in a real browser (Playwright MCP), never
from a passing unit test.

## Design tokens

Tokens live in `src/styles/index.css`, in the `:root`, `.dark` and `@theme inline` blocks,
expressed as shadcn variables so every primitive inherits them. Domain colours carry both an
on-tint and an on-fill ink (`--destructive-on-tint`, `--success-on-fill`) — a tint and a solid
fill of one colour need opposite inks. Specific palette, type scale and spacing: _to be filled
in by the redesign_.

**Raw colours are forbidden outside those blocks.**

- CSS: `npm run check:css` (`scripts/check-css-tokens.mjs`) fails on a hex, colour function or
  white/black in any `src/**/*.css` outside the token blocks. `color-mix(…, var(--x) …)` is fine.
- TS/TSX: the `local/no-raw-colours` ESLint rule flags Tailwind palette classes
  (`bg-red-500`, `text-white`), arbitrary colours (`bg-[#fff]`), colour functions and bare hex
  values (inline styles). It is in the TODO(redesign) block: 11 literals remain in
  `shared/components/AppLogo/AppLogo.tsx` (6), `shared/account-sync/components/icons/GoogleIcon/GoogleIcon.tsx` (4, brand
  colours — an `eslint-disable-next-line` with a reason is acceptable there) and
  `shared/ui/alert-dialog.tsx` (1). Use semantic utilities (`bg-primary`,
  `text-muted-foreground`) or `var(--token)`.

## Primitives

Import each primitive from its own file — `@shared/ui/button.tsx`, `@shared/ui/card.tsx`; there
is no barrel. No raw `<button>`, `<input>`,
`<select>`, `<textarea>`, `<form>`, `<table>`, `<label>` outside `src/shared/ui` — the
`no-raw-html-controls` rule (it shares `no-restricted-syntax` with the trainer-id rule, so it
is subject to replace-not-merge). A missing primitive is added to `src/shared/ui` in the same
style, with `npx shadcn add <name>`: the root `tsconfig.json` carries the path map so the CLI
writes into `src/shared/ui`. Then fix what it generates — it imports `cn` from a bare `"cn"`
(make it `@shared/lib/cn.ts`) and siblings without an extension (`@shared/ui/toggle` →
`@shared/ui/toggle.tsx`); typecheck and lint name both. `Pressable` is for a whole card or row that is itself the
control. `src/shared/ui/*.tsx` are written by the shadcn CLI: vendored, flat kebab-case filenames so
`npx shadcn add` keeps working — the one exception to folder-per-component. Every other
component lives in its own folder (`components/ScoreMeter/ScoreMeter.tsx`).

## Accessibility and motion

- `eslint-plugin-jsx-a11y` runs its **strict** preset on all app source.
- Interactive elements need accessible names; a `<Label htmlFor>` on a control that names
  itself hides its value.
- Contrast: `e2e/contrast.spec.js` measures every ink and mark against its WCAG minimum in both
  themes by painting onto a canvas (computed styles return `oklch()`/`color-mix()`). White on
  `--primary` holds 4.72:1 only at L=0.55 — lightening it re-breaks the default button.
- Every animation sits behind `prefers-reduced-motion`; `e2e/reducedMotion.spec.js` asserts it
  via `page.emulateMedia` (the `test.use({ reducedMotion })` fixture did not reach the query).
- Theme switches through the app's storage key (`telcTrainerTheme`), not a class toggle.

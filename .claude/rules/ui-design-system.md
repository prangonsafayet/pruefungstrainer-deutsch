---
paths:
  - 'src/shared/ui/**'
  - 'src/**/components/**'
  - 'src/**/pages/**'
  - 'src/styles/**'
  - '**/*.css'
---

# UI and design system

A redesign ("warm & friendly", `design-system/pruefungstrainer-deutsch/MASTER.md`) is in progress;
the `ui-designer` agent owns it. Pass 5A landed tokens, fonts, primitives and the app shell.
Verify appearance in a real browser (Playwright MCP), never from a passing unit test.

## Design tokens

Tokens live in `src/styles/index.css`, in the `:root`, `.dark` and `@theme inline` blocks,
expressed as shadcn variables so every primitive inherits them. Domain colours carry both an
on-tint and an on-fill ink (`--destructive-on-tint`, `--success-on-fill`) — a tint and a solid
fill of one colour need opposite inks.

| Token                           | Light                                | Dark                       | Role                                                     |
| ------------------------------- | ------------------------------------ | -------------------------- | -------------------------------------------------------- |
| `--background`                  | `#fbf7f1`                            | `#1b1714`                  | canvas (warm cream / warm charcoal)                      |
| `--foreground`                  | `#2b2420`                            | `#f4ede5`                  | ink                                                      |
| `--card` / `--popover`          | `#fffdf9`                            | `#26211d`                  | cards, menus                                             |
| `--muted` / `--secondary`       | `#f3ece3`                            | `#332c27`                  | quiet surfaces, tracks                                   |
| `--muted-foreground`            | `#6b5e55`                            | `#b9aca1`                  | secondary text; checkbox/radio edge                      |
| `--primary` / `--ring`          | `#4338ca`                            | `#a5b4fc`                  | indigo: actions, links, focus                            |
| `--primary-foreground`          | `#ffffff`                            | `#1e1b4b`                  | label on primary                                         |
| `--accent` / `-foreground`      | `#e9e8fb` / `#3730a3`                | `#2a2847` / `#c7d2fe`      | soft tint: hover, active nav, secondary button           |
| `--brand-2`                     | `#a21caf`                            | `#e879f9`                  | magenta second voice (charts), never status              |
| `--success` / `-on-fill`        | `#2f7d52` / `#ffffff`                | `#5cc08a` / `#0d2618`      | fill and its label                                       |
| `--success-foreground`          | `#1e6440`                            | `#9be0b8`                  | ink on the success tint                                  |
| `--warning` / `-foreground`     | `#e3a21a` / `#7a4e00`                | `#f0b93a` / `#f5d58a`      | tint source / ink, ring and meter stroke                 |
| `--destructive` / `-foreground` | `#c0362c` / `#ffffff`                | `#f07468` / `#2a0a07`      | fill and its label                                       |
| `--destructive-on-tint`         | `#a62e25`                            | `#ff9a8f`                  | ink on the destructive tint                              |
| `--border` / `--input`          | `#e8ddd0` / `#98877a`                | 12% warm white / `#7a6c62` | hairlines / field boundary (input ≥ 3:1 on card, 1.4.11) |
| `--scrim`                       | ink at 45%                           | near-black at 62%          | behind dialogs (`bg-scrim`)                              |
| `--chart-1..5`                  | indigo, magenta, green, ochre, slate | lighter set                | charts, both themes                                      |
| `--logo-*`                      | fixed, no dark override              | —                          | the brand mark only                                      |

- **Shadows** (warm-tinted; utilities `shadow-soft` resting card, `shadow-lift` hover/raised,
  `shadow-pop` menus/dialogs). In dark each carries a 1px warm hairline, because shadows do
  not read on charcoal — that is why `Card` has no dark border class (a border colour would
  override a caller's `border-l-primary`).
- **Radius** (`--radius: 1rem`): `sm` 6px · `md` 8px · `lg` 10px · `xl` 12px (controls: buttons,
  inputs, selects) · `2xl` 16px (cards, dialogs) · `3xl` 24px · pills `rounded-full`.
- **Type**: `font-sans` = Nunito Sans Variable (body, 1.6 line-height), `font-heading` =
  Nunito Variable (h1–h4 via the base layer; buttons, nav, card titles explicitly). Both
  self-hosted through `@fontsource-variable/*` (wght axis only). Scale per MASTER; the page h1
  is `text-3xl sm:text-4xl` (`PageTitle`).
- **Prose**: the typography plugin's palette is re-pointed at the tokens in an unlayered
  `.prose { --tw-prose-*: var(--…) }` block, and the guide classes (`.guide-toc`, `.card`,
  `.callout`, `.chip`) are unlayered too — the plugin's own link/margin rules outrank the
  components layer. Do not add `prose-stone`/`prose-invert` at call sites.

**Raw colours are forbidden outside those blocks** — both checks are enforced.

- CSS: `npm run check:css` (`scripts/check-css-tokens.mjs`) fails on a hex, colour function or
  white/black in any `src/**/*.css` outside the token blocks. `color-mix(…, var(--x) …)` is fine.
- TS/TSX: the `local/no-raw-colours` ESLint rule (error since pass 5A) flags Tailwind palette
  classes (`bg-red-500`, `text-white`), arbitrary colours (`bg-[#fff]`), colour functions and
  bare hex values (inline styles). The only exemption is `GoogleIcon`'s four brand colours, each
  under an `eslint-disable-next-line` with its reason. Use semantic utilities (`bg-primary`,
  `text-muted-foreground`) or `var(--token)` (`fill-[var(--logo-tile)]`).

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
  `--primary` measures 7.9:1 (indigo since 2026-10-13, replacing a terracotta that read as
  telc's red-orange). A class
  used only by that spec (`bg-brand-2`) is still generated: Tailwind scans `e2e/`.
- Focus: 3px `ring-ring` (≥ 5:1 on canvas and card) with a 2px offset on filled controls; text
  fields swap their border to `--ring` plus a soft halo.
- Every animation sits behind `prefers-reduced-motion`; `e2e/reducedMotion.spec.js` asserts it
  via `page.emulateMedia` (the `test.use({ reducedMotion })` fixture did not reach the query).
- Theme switches through the app's storage key (`telcTrainerTheme`), not a class toggle.

# Design system — telc Deutsch Trainer (MASTER)

Source of truth for the visual layer. Page-specific overrides go in `pages/<page>.md` next to
this file and win over it. Tokens are implemented in `src/styles/index.css`; components consume
them only through Tailwind utilities generated from `@theme inline` (`bg-primary`,
`text-muted-foreground`, …). No raw colour literal, Tailwind palette class (`bg-orange-600`) or
arbitrary colour (`bg-[#…]`) is allowed outside the token blocks — lint and `npm run check:css`
enforce it.

Generated with the UI UX Pro Max skill (`--design-system`, variance 4, motion 3, density 5),
then corrected by hand: the skill's default for "education" is a children's claymorphism style
with Comic Neue, which is wrong for adult learners — including immigrants preparing for the
DTZ — who need calm, legible, encouraging, never childish.

## Direction: warm & friendly, grown-up

- Warm cream canvas, white-warm cards, ink that is brown-black rather than blue-black.
- One warm brand colour (terracotta) for action and focus; teal as the quiet second voice for
  charts and secondary emphasis. Green/amber/red carry status only.
- Generous rounding (cards 16px, controls 12px, pills full), soft warm-tinted shadows, no hard
  1px grey boxes everywhere — separate with space and surface tone first, borders second.
- Friendly type: rounded humanist sans. Large, calm headings; comfortable 16px body at 1.6.
- Motion is subtle (150–250ms, ease-out), explains state changes, and disappears under
  `prefers-reduced-motion`.
- Icons: lucide only, `aria-hidden` when decorative. No emoji as icons.

## Typography

| Role           | Font                       | Weight  | Notes                                  |
| -------------- | -------------------------- | ------- | -------------------------------------- |
| Headings / UI  | **Nunito** (variable)      | 700–800 | page titles, card titles, nav, buttons |
| Body / reading | **Nunito Sans** (variable) | 400–600 | exam texts, guide prose, forms         |
| Numerals       | Nunito, `tabular-nums`     | 700     | scores, timer, stats                   |
| Mono           | system mono                | 500     | build label only                       |

Self-hosted via `@fontsource-variable/*` (no third-party font request: privacy, offline PWA,
CSP). Both families ship full Latin incl. ä ö ü ß.

Scale (rem): 0.75 caption · 0.875 small · 1 body · 1.125 lead · 1.25 h3 · 1.5 h2 · 1.875–2.25 h1.
Body line-height 1.6, headings 1.2, letter-spacing −0.01em on h1/h2. Reading texts in exams cap
at ~68ch.

## Colour tokens

All pairs below were measured (WCAG 2.x relative luminance): text pairs ≥ 4.5:1, meter/ring
strokes ≥ 3:1. `e2e/contrast.spec.js` re-measures them in a real browser.

### Light

| Token                   | Value     | Use                                       |
| ----------------------- | --------- | ----------------------------------------- |
| `--background`          | `#FBF7F1` | canvas (warm cream)                       |
| `--foreground`          | `#2B2420` | ink — 14.3:1                              |
| `--card`                | `#FFFDF9` | cards, popovers                           |
| `--muted`/`--secondary` | `#F3ECE3` | quiet surfaces, tracks                    |
| `--muted-foreground`    | `#6B5E55` | secondary text — 5.9:1 on bg              |
| `--primary`             | `#B4441C` | terracotta: actions, focus, links — 5.2:1 |
| `--primary-foreground`  | `#FFFFFF` | on primary — 5.6:1                        |
| `--accent`              | `#F7E6DA` | soft terracotta tint (hover, active nav)  |
| `--accent-foreground`   | `#8A3416` | on accent — 6.7:1                         |
| `--brand-2`             | `#17716B` | teal second voice (charts, highlights)    |
| `--success`             | `#2F7D52` | fill; white label 5.0:1                   |
| `--success-foreground`  | `#1E6440` | ink on success tint                       |
| `--warning`             | `#E3A21A` | fill/tint source                          |
| `--warning-foreground`  | `#7A4E00` | ink on warning tint, ring/meter stroke    |
| `--destructive`         | `#C0362C` | fill; white label 5.5:1                   |
| `--destructive-on-tint` | `#A62E25` | ink on destructive tint                   |
| `--border`              | `#E8DDD0` |                                           |
| `--input`               | `#DCCFBF` |                                           |
| `--ring`                | `#B4441C` |                                           |

### Dark (warm charcoal, never pure black)

| Token                   | Value                                                |
| ----------------------- | ---------------------------------------------------- |
| `--background`          | `#1B1714`                                            |
| `--foreground`          | `#F4EDE5`                                            |
| `--card`                | `#26211D`                                            |
| `--muted`/`--secondary` | `#332C27`                                            |
| `--muted-foreground`    | `#B9ACA1`                                            |
| `--primary`             | `#F0895B` (ink `#2A1206`, 7.1:1)                     |
| `--accent`              | `#3A2A22` (ink `#F8C9AE`)                            |
| `--brand-2`             | `#4FB8AE`                                            |
| `--success`             | `#5CC08A` (ink on fill `#0D2618`; on tint `#9BE0B8`) |
| `--warning`             | `#F0B93A` (ink on tint `#F5D58A`)                    |
| `--destructive`         | `#F07468` (ink on fill `#2A0A07`; on tint `#FF9A8F`) |
| `--border`              | `rgb(255 240 225 / 0.12)`                            |
| `--input`               | `rgb(255 240 225 / 0.18)`                            |

Charts get their own `--chart-1..5` in **both** themes (the old palette forgot dark).

## Shape, depth, space

- `--radius: 1rem` (cards, `rounded-2xl`). Controls `rounded-xl` = `--radius-xl` (0.75rem);
  chips/pills full.
- Shadows are warm-tinted and soft, as tokens: `--shadow-soft` (resting card),
  `--shadow-lift` (hover/raised), `--shadow-pop` (menus, dialogs). No default grey shadows.
- Spacing: 4px base; cards `p-5 sm:p-6`; page gutter 16px mobile / 24px desktop; sections
  separated by 32–40px.
- Touch targets ≥ 44×44px on mobile (buttons default h-10, lg h-12).

## Layout & navigation — phones, tablets, desktop (all first-class)

Mobile-first Tailwind breakpoints; every screen is designed and verified at each band, in
portrait and landscape where it applies.

| Band    | Width      | Reference devices (verify at)              | Navigation                                           |
| ------- | ---------- | ------------------------------------------ | ---------------------------------------------------- |
| Phone   | 360–639px  | 360×740, 390×844 (iPhone), 412×915         | compact top bar + **bottom tab bar**                 |
| Tablet  | 640–1023px | 768×1024 portrait, 820×1180, 1024×768 land | top bar + **side rail** (icons + labels) or pill row |
| Desktop | ≥ 1024px   | 1280×800, 1440×900                         | top bar + pill nav row                               |

- **Phone:** bottom tab bar ≤ 5 items (icon + label), safe-area padding
  (`env(safe-area-inset-*)`), secondary items in a "More" sheet. Single column. Cards full-bleed
  minus 16px gutter. No horizontal scroll at 360px. Sticky elements must not cover more than ~20%
  of the viewport height together.
- **Tablet:** 2-column grids for dashboard tiles/cards; settings as 2 columns where it reads well.
  Exam runner in **landscape** splits reading/listening material and questions side by side
  (text left, scrollable questions right) when both fit at ≥ 1024px wide; portrait stays single
  column with the reading text above its items. Touch targets stay ≥ 44px — tablets are touch.
- **Desktop:** up to 3-column dashboard grids, `max-w-6xl` content.
- Exam runner on every band: distraction-free — the main nav collapses, the module toolbar
  (timer, progress, submit) is sticky; on phones it sits at the bottom within thumb reach.
- Reading surfaces cap at ~68ch (`max-w-3xl`); long German compounds must wrap
  (`hyphens: auto` with `lang="de"`, `overflow-wrap: anywhere` on narrow cards).
- Inputs: 16px minimum font size on phones (prevents iOS zoom on focus).
- Hover is never the only affordance; every hover state has a focus/active equivalent.
- Verification: Playwright projects for phone (Pixel 7 / iPhone 14), tablet (iPad portrait +
  landscape) and desktop; the existing no-horizontal-overflow smoke check runs at 360, 768,
  1024 and 1280; screenshots of every screen at each band in light and dark before merge.

## Accessibility — screen readers and keyboard (target WCAG 2.2 AA)

**Structure**

- One `<h1>` per screen, no skipped heading levels; landmarks `header`, `nav` (labelled
  "Main" / "Trainer"), `main`, `footer`. A **"Skip to content"** link is the first focusable
  element.
- Route changes move focus to the new page's `<h1>` (tabIndex -1) and update `document.title`
  ("Lesen · Modelltest 3 · DTZ — telc Deutsch Trainer").
- **Language:** the UI chrome is English, exam content is German → every German content block
  carries `lang="de"` so screen readers switch voice and pronunciation. `<html lang>` matches the
  chrome.

**Keyboard**

- Everything operable by keyboard alone, in a logical tab order; no keyboard traps outside open
  dialogs (Radix handles dialog/menus focus trapping and return).
- Visible focus on every interactive element (3px `--ring`, ≥ 3:1 against its surface); never
  `outline: none` without a replacement.
- Exam runner: answer options are native radio groups (arrow keys move within a group, Tab moves
  between items); matching/LetterSelect usable with keyboard; audio play/stop on Space/Enter; the
  bottom tab bar and side rail are reachable; Submit asks for confirmation in a focus-trapped dialog.
- Flashcards: flip with Space/Enter, "knew it / didn't" as buttons, never swipe-only.

**Screen readers**

- Every control has an accessible name; icon-only buttons have `aria-label`; decorative lucide
  icons `aria-hidden`.
- Form fields: visible `<Label>`, errors linked via `aria-describedby` and announced
  (`role="alert"` once, not on every keystroke); required fields marked in text, not colour.
- **Live regions:** the exam timer is NOT announced every second — announce at 10, 5 and 1 minutes
  remaining (`aria-live="polite"`) and at time-up (`assertive`); toasts are polite; score/result
  screens announce the verdict once.
- Selected/correct/incorrect states are conveyed in text (e.g. "Richtig — your answer: b"), not by
  colour or icon alone; review rows say "correct"/"incorrect" in the accessible name.
- Score history chart has a visually-hidden data table (or `role="img"` + full `aria-label`
  summary) — bar heights alone convey nothing to a screen reader.
- Progress bars/meters use `role="progressbar"`/`meter` with `aria-valuenow/min/max` and a text
  value; the pass line is stated in text.
- Countdown ring exposes remaining time as text.

**Verification (gates)**

- `eslint-plugin-jsx-a11y` strict (already on).
- **`@axe-core/playwright`** e2e spec over every route of every trainer, light and dark, at phone
  and desktop widths — zero serious/critical violations.
- Keyboard-only e2e: complete one Lesen Teil and submit a module without a mouse.
- Manual pass with VoiceOver (macOS/iOS) on: dashboard, one full module in the runner, results,
  review, flashcards, settings sign-in form — notes recorded in the PR.

## Components (intent)

- **Button**: rounded-xl, Nunito 700, gentle press (`active:scale-[0.98]`), visible 3px focus
  ring in `--ring`. Variants: default, secondary (soft tint), outline, ghost, link, success,
  destructive.
- **Card**: `rounded-2xl bg-card shadow-soft`, border only where surfaces would merge.
- **Badge/Chip**: pill, tinted backgrounds via `color-mix` of a token, ink tokens for text.
- **Teil section (exam)**: numbered header chip, calm card, reading text on `--muted` with 68ch
  measure; options as large tappable cards with clear selected state (border + tint + check).
- **Meters/progress**: rounded-full tracks on `--secondary`, status-coloured fills, pass-line
  marker labelled in text, never colour alone.
- **Empty states & notices**: friendly sentence + one clear next action.
- **Encouragement**: results and streaks speak in a warm, honest voice; never shame.

## Motion

| Use                 | Duration | Easing                    |
| ------------------- | -------- | ------------------------- |
| hover/press         | 150ms    | ease-out                  |
| enter (cards, page) | 220ms    | cubic-bezier(.22,1,.36,1) |
| exit                | 150ms    | ease-in                   |
| progress fill       | 600ms    | ease-out                  |

Only `transform` and `opacity` animate. The existing reduced-motion override zeroes everything,
and `e2e/reducedMotion.spec.js` asserts it; the `grow-up` keyframe name is load-bearing.

## Anti-patterns

Childish styling (claymorphism, Comic-style fonts, cartoon mascots); emoji as icons; grey-on-
grey text; colour as the only signal; hover-only affordances; raw colour literals in
components; animating width/height; removing focus rings.

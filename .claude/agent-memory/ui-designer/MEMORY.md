# ui-designer memory

One dated line per lesson. Read before designing; append after a retry.

- 2026-10-12: (5A palette) White on terracotta `--primary` #b4441c measures 5.55:1; lightening it re-breaks the default button.
- 2026-10-12: A tint and a solid fill of one colour need opposite inks — `--*-on-tint` and `--*-on-fill` tokens.
- 2026-10-12: Computed styles return `oklch()`/`color-mix()`; contrast is measured by painting to a canvas (`e2e/contrast.spec.js`).
- 2026-10-12: `test.use({ reducedMotion })` did not reach the media query; use `page.emulateMedia` and assert it.
- 2026-10-12: Switch theme through the app's storage key (`telcTrainerTheme`), not a class on `documentElement`.
- 2026-10-12: `absolute right-0` inside `px-4` sits flush — absolute offsets use the padding box.
- 2026-10-12: Raw colours cleared in 5A; `rawColours` and `componentHooks` are enforced. GoogleIcon keeps brand hex under reasoned disables.
- 2026-10-12: StrictMode runs mount effects twice: a "first render" ref reads the rerun as a navigation and steals focus — key on the previous pathname.
- 2026-10-12: `dark:border-border` on Card outranked callers' `border-l-primary` (variant specificity) — dark hairline lives in `--shadow-soft` instead.
- 2026-10-12: Typography plugin rules beat anything in `@layer components` (`.guide-toc a` stayed underlined) — guide/prose rules are unlayered.
- 2026-10-12: Radix DropdownMenu aria-hides the page until its exit animation ends — e2e must wait for `menu` hidden before the next getByRole.
- 2026-10-12: Tailwind only generates classes it finds in the repo (it scans e2e/) — a contrast probe from a scratch script outside the repo measures nothing; add the pair to the spec.
- 2026-10-12: Playwright MCP here has no key-press tool and saves files only inside the repo — keyboard checks via a node Playwright script.
- 2026-10-12: `git mv` stages the rename; when told "do not git add", unstage with `git restore --staged`.
- 2026-10-12: (5B) `npx shadcn add sheet` also npm-installed a bogus `cn` package and the `radix-ui` umbrella — uninstall both, add `@radix-ui/react-dialog`, rewrite the file in house style.
- 2026-10-12: `qlmanage` zooms a non-square SVG (og-image was cropped to its top-left for months) — `npm run images` now renders it with `npx playwright screenshot`.
- 2026-10-12: Radix Dialog closed by an in-sheet button returned focus to body — move focus in `onCloseAutoFocus` (preventDefault, focus the target).
- 2026-10-12: `Button`/`Badge` carry `shrink-0` + nowrap: a long label overflows a 390px card until it gets `max-w-full whitespace-normal`.
- 2026-10-12: Render-test `findByText(/^Open/)` missed "<Icon/> Open …" — JSX text after an icon starts with a space; never anchor `^`.
- 2026-10-12: MCP screenshots right after navigate show the Suspense skeleton; for a screen matrix use a node Playwright script (wait for `main h1` + networkidle).

# ui-designer memory

One dated line per lesson. Read before designing; append after a retry.

- 2026-10-12: White on `--primary` clears 4.5:1 only at L=0.55 (4.72:1); lightening it re-breaks the default button.
- 2026-10-12: A tint and a solid fill of one colour need opposite inks — `--*-on-tint` and `--*-on-fill` tokens.
- 2026-10-12: Computed styles return `oklch()`/`color-mix()`; contrast is measured by painting to a canvas (`e2e/contrast.spec.js`).
- 2026-10-12: `test.use({ reducedMotion })` did not reach the media query; use `page.emulateMedia` and assert it.
- 2026-10-12: Switch theme through the app's storage key (`telcTrainerTheme`), not a class on `documentElement`.
- 2026-10-12: `absolute right-0` inside `px-4` sits flush — absolute offsets use the padding box.
- 2026-10-12: Raw colours left at handover: Logo.tsx (6), GoogleIcon.tsx (4, brand colours), shared/ui/alert-dialog.tsx (1).

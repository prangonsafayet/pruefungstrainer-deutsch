# ADR 0011: Hooks are `.tsx` files

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

Hooks were a mix of `.ts` and `.tsx`, decided by whether a hook happened to return JSX at
the time. Renaming a file when a hook started or stopped returning JSX churned imports.
The extension was also not a reliable signal of what a file is: a `.ts` file could be a
hook or a pure util. The project wanted the extension alone to separate React code from
plain logic.

## Decision

Every hook is `use<Thing>.tsx`, whether or not it renders JSX. Non-hook logic (lib, model,
config, types, context objects) stays `.ts`. Two checks enforce this:
`check-file/filename-blocklist` in ESLint and `scripts/check-architecture.mjs`. Both
refuse a `use*.ts` file.

## Consequences

- **The extension tells React code from pure code.** `.ts` files are plain logic, and the
  vitest `logic` project and coverage globs rely on that.
- **Generic arrows need `<T,>`.** In a `.tsx` file a generic arrow must be written `<T,>`,
  or it parses as JSX.
- **Exempt from visual-only.** A hook beside its component
  (`AudioSettingsCard/useAudioSettings.tsx`) is not a `PascalCase.tsx` file, so the
  `components-visual-only` rule does not apply to it.

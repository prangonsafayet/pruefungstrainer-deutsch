# ADR 0007: Components are visual only, enforced by lint

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

The app has a timed exam engine, persisted progress, date maths and a sync client. When
that logic sits inside JSX it cannot be unit-tested without rendering. It also tends to
read the clock or storage during render, which caused real bugs:

- the exam clock stalled while the learner typed;
- an infinite loop came from `speechSynthesis.getVoices()` being called in render.

## Decision

A component renders, and nothing more. Anything derived, persisted, timed or networked
goes in a `use*.tsx` hook or a pure `.ts` util, beside the component when only it uses
them. Trivial UI state is fine (`useState`, `useRef`, `useId`).

The `components-visual-only` entry in `eslint.config.js` enforces this for every
`PascalCase.tsx` under `components/` or `pages/`. It refuses:

- `localStorage`, `sessionStorage`, `indexedDB`, `fetch`, `XMLHttpRequest`, `setTimeout`
  and `setInterval`;
- `new Date()` and `Date.now`;
- imports of `zustand`, `immer` and `@supabase/*`;
- `useEffect`, `useLayoutEffect`, `useReducer` and `useSyncExternalStore`.

It also refuses `import * as React`, so a namespace import cannot bypass the hook ban.
Primitives come from `src/shared/ui` (no raw `<button>`, `<input>`, `<form>`, `<table>` or
`<label>`).

## Consequences

- **Logic is testable without a DOM.** Logic lives in pure functions (`buildScheduleFrom`,
  `srs.ts`, `dtzCertificate`, `summarizeAttempt`) and in hooks (`useExamRun`, the attempt
  state machine), and the vitest `logic` project tests most of it without a DOM.
- **Render tests are thin.** The happy-dom render tests and Playwright cover what is left.
- **A hook beside its component.** Most screens have a matching hook
  (`DashboardPage/useDashboardStats.tsx`), and that hook may use effects.
- **No exceptions.** The rule left the TODO(redesign) block when the tree went clean.

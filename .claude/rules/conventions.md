---
paths:
  - 'src/**/*.{ts,tsx}'
---

# Conventions

## Components are visual only — a lint rule

A component renders. Anything derived, persisted, timed or networked goes in a hook
(`use*.ts`) or a pure util in `lib/`. Trivial open/closed UI state (`useState`, `useRef`,
`useId`) is fine. References: `useExamRun` (the attempt state machine), `buildReviewSections`,
`summarizeAttempt`, `useDashboardStats`.

The `components-visual-only` entry in `eslint.config.js` enforces it for every `.tsx` under a
`components/` or `routes/` folder (vendored `src/shared/ui` exempt):

| Banned in a component                                                                                                                       | Status                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `localStorage`, `sessionStorage`, `indexedDB`, `fetch`, `XMLHttpRequest`, `setTimeout`, `setInterval` (bare or via `window.`/`globalThis.`) | error                                  |
| `new Date()`, `Date.now`                                                                                                                    | error                                  |
| `zustand`, `immer`, `@supabase/*` imports                                                                                                   | error                                  |
| `useEffect`, `useLayoutEffect`, `useReducer`, `useSyncExternalStore` (and `React.` forms)                                                   | TODO(redesign): 2 files still use them |

The react-hooks ban also refuses `import * as React from 'react'` in those files — import
names. `npm run lint:todo` lists everything still in the TODO(redesign) block.

## One component per file, default-exported

`react/no-multi-comp` plus the local `component-default-export` rule. Types may be named
exports from the same file; hooks, libs, config and providers stay named exports. Barrels
re-export defaults by name (`export { default as TeilSection } from './exam-ui/layout/TeilSection.tsx';`).
`src/shared/ui` is exempt from both. Group components by area:
`features/<f>/components/<group>/`, `shared/components/{actions,data-display,layout,exam-ui}/`.

## Shared exam machinery

Everything every exam format renders lives in `shared/components/exam-ui/` — inputs
(`RichtigFalsch`, `MultipleChoice`, `LetterSelect`), layout (`TeilSection`, `QuestionItem`,
`QuestionText`, `ReadingText`, `ExamCallout`), gaps (`InlineGapSelect`, `GapFillText`),
`MatchingOptionCards`, `PunkteGrid`, `RedemittelList`, `ModuleBriefingCard`, `ExamModuleToolbar`,
`CriteriaRatingPanel`, `CountdownRing`, `RecorderControls`, `ListeningTranscript` — consumed through
`@shared/components`. Module renderers keep no private copy.

## Design system

Primitives from `@shared/ui` only; no raw `<button>`, `<input>`, `<select>`, `<textarea>`,
`<form>`, `<table>`, `<label>` (`no-raw-html-controls`). Details: the ui-design-system rule.

## Naming (`check-file` + `@typescript-eslint/naming-convention`)

| Thing                        | Convention             | Example                 |
| ---------------------------- | ---------------------- | ----------------------- |
| Component / route module     | `PascalCase.tsx`       | `DashboardExamCard.tsx` |
| Hook                         | `useThing.ts`          | `useExamRun.ts`         |
| Util, config, types, context | `camelCase.ts`         | `dashboardModel.ts`     |
| Folder                       | `kebab-case`           | `exam-ui/`              |
| Module constant              | `SCREAMING_SNAKE_CASE` | `EXAM_MODULES`          |
| Type / interface             | `PascalCase`           | `SignUpOutcome`         |

PascalCase is allowed where a value is a component or namespace import; `snake_case` /
`UPPER_CASE` in type properties mirroring external contracts (Supabase columns, `VITE_` vars).
Every function is an arrow (`prefer-arrow-functions`).

## Types

Strict plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. No `any`, no non-null
assertions — narrow. Domain types live in `src/shared/types`; exam files are checked with
`satisfies`. A third-party prop lacking `| undefined` gets `optional()` from
`@shared/lib/optionalProps.ts`, never a looser tsconfig. A finite-keyed map parsed from
untrusted JSON goes through a helper whose return type admits `undefined` — do not delete the
guard or disable `no-unnecessary-condition`.

## Imports

One alias per layer — `@app/*`, `@features/*`, `@shared/*`, `@content/*` — with explicit
`.ts`/`.tsx` extensions; no catch-all `@/`. `import-x/order` groups and alphabetises
(`--fix`). `@shared/hooks` and `@shared/lib` have no barrel: import by file.

## Libraries over hand-rolled code

Before writing non-trivial generic machinery — charts, date maths, schema validation of
untrusted or persisted data, error boundaries, animation/count-up, drag and drop,
virtualisation, form state, i18n plurals, retries/backoff, IDs — check for a maintained, typed,
tree-shakeable library. Prefer one already in `package.json` (date-fns, Radix, sonner, zustand,
immer, lucide, react-day-picker, cva, tailwind-merge), then a small well-maintained one.
Criteria: active maintenance, TS types, bundle cost (check bundlephobia), MIT/Apache/ISC
licence, no paid service, no telemetry. A new dependency must pass `npm run audit:prod`. Never
add a dependency for a few lines; hand-roll only when the library costs more than the code,
and say why in a one-line comment.

## React traps that cost real time

- `speechSynthesis.getVoices()` returns a fresh array every call; reading it during render
  looped forever on machines with no German voice. It is read through `useSyncExternalStore`.
- An interval effect must not depend on an object that changes per keystroke (see the
  dates-timers rule).
- Absolutely positioned children resolve offsets against the padding box: `absolute right-0`
  inside `px-4` sits flush. Match the padding (`right-4`).

---
paths:
  - 'src/**/*.{ts,tsx}'
---

# Conventions

## Components are visual only — a lint rule

A component renders. Anything derived, persisted, timed or networked goes in a hook
(`use*.tsx`) or a pure `.ts` util — beside the component when only it uses them. Trivial open/closed UI state (`useState`, `useRef`,
`useId`) is fine. References: `useExamRun` (the attempt state machine), `buildReviewSections`,
`summarizeAttempt`, `useDashboardStats`.

The `components-visual-only` entry in `eslint.config.js` enforces it for every `PascalCase.tsx`
under a `components/` or `pages/` folder, at any depth (vendored `src/shared/ui` exempt; a
`use*.tsx` hook beside the component is not a component and is not covered):

| Banned in a component                                                                                                                       | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `localStorage`, `sessionStorage`, `indexedDB`, `fetch`, `XMLHttpRequest`, `setTimeout`, `setInterval` (bare or via `window.`/`globalThis.`) | error  |
| `new Date()`, `Date.now`                                                                                                                    | error  |
| `zustand`, `immer`, `@supabase/*` imports                                                                                                   | error  |
| `useEffect`, `useLayoutEffect`, `useReducer`, `useSyncExternalStore` (and `React.` forms)                                                   | error  |

The react-hooks ban also refuses `import * as React from 'react'` in those files — import
names. `npm run lint:todo` lists anything still in the TODO(redesign) block (empty since pass 5A).

## One component per file, default-exported, in its own folder

`react/no-multi-comp` plus the local `component-default-export` rule. Types may be named
exports from the same file; hooks, libs, config and providers stay named exports.
`src/shared/ui` is exempt from both.

Every component and page lives in a folder named after it — `components/ScoreMeter/ScoreMeter.tsx`,
`pages/DashboardPage/DashboardPage.tsx` — and that folder also holds the hooks, utils, types and
constants only it uses (`AudioSettingsCard/useAudioSettings.tsx`, `AudioSettingsCard/audio.ts`).
Screens live in `pages/`, never `routes/`. Group folders stay kebab-case and hold component
folders: `features/<f>/components/<group>/<Name>/`,
`shared/components/{actions,data-display,layout,exam-ui}/<Name>/`. `npm run check:architecture`
enforces the layout.

## No barrels

There is no `index.ts` anywhere in `src/` and no folder import. Import the file that defines the
thing, with its extension: `@shared/ui/button.tsx`, `@shared/types/exam.ts`,
`@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx`. Lint (`NO_BARRELS`,
`check-file/no-index`) and `check:architecture` refuse both.

## Shared exam machinery

Everything every exam format renders lives in `shared/components/exam-ui/` — inputs
(`RichtigFalsch`, `MultipleChoice` — both radio groups of `ChoiceOption` cards — and
`LetterSelect`, whose `label` is required), layout (`TeilSection`, `QuestionItem`,
`QuestionText`, `ReadingText`, `ExamCallout`, `SplitTeil` — shared material beside its items
from 1024px), `WritingField`, gaps (`InlineGapSelect`, `GapFillText`),
`MatchingOptionCards`, `PunkteGrid`, `RedemittelList`, `ModuleBriefingCard`, `ExamModuleToolbar`,
`CriteriaRatingPanel`, `CountdownRing`, `RecorderControls`, `ListeningTranscript`, `WritingTaskBrief` — each imported
from its own file. Module renderers keep no private copy.

## Design system

Primitives from `src/shared/ui` only, imported by file (`@shared/ui/card.tsx`); no raw `<button>`, `<input>`, `<select>`, `<textarea>`,
`<form>`, `<table>`, `<label>` (`no-raw-html-controls`). Details: the ui-design-system rule.

## Naming (`check-file` + `@typescript-eslint/naming-convention`)

| Thing                        | Convention             | Example                                   |
| ---------------------------- | ---------------------- | ----------------------------------------- |
| Component / page module      | `Name/Name.tsx`        | `DashboardExamCard/DashboardExamCard.tsx` |
| Hook                         | `useThing.tsx`         | `useExamRun.tsx`                          |
| Util, config, types, context | `camelCase.ts`         | `dashboardModel.ts`                       |
| Folder                       | `kebab-case`           | `exam-ui/`                                |
| A component's own folder     | `PascalCase`           | `ScoreMeter/`                             |
| Module constant              | `SCREAMING_SNAKE_CASE` | `EXAM_MODULES`                            |
| Type / interface             | `PascalCase`           | `SignUpOutcome`                           |

PascalCase is allowed where a value is a component or namespace import; `snake_case` /
`UPPER_CASE` in type properties mirroring external contracts (Supabase columns, `VITE_` vars).
Every function is an arrow (`prefer-arrow-functions` + `func-style`, at error for `src/`,
`tests/`, `e2e/`, `scripts/` and root configs). Classes are refused in `src/` (`local/no-classes`),
with no exemption: error boundaries come from `react-error-boundary`. Hooks are `.tsx` like components — a
`use*.ts` file fails lint (`check-file/filename-blocklist`) and `check:architecture`; a generic
arrow in a `.tsx` file needs `<T,>`. Non-hook logic (lib, model, config, types) stays `.ts`.

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
(`--fix`). Import by file, never by folder. A feature imports only its own alias, `@shared/*`
and `@content/*`; a sibling in the same folder is `./file.ts`, a sibling component folder one
level up may be `../Other/Other.tsx`.

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

## Errors

Every failure the learner can act on reaches them as a toast or Alert with a next action —
never a raw message or stack. I/O boundaries (storage, import, sync, recorder, speech) return
or classify into an `AppError` (`@shared/lib/appError.ts`: `code`, learner `message`,
`recoverable`, `cause`) or a `Result`; the cause goes to `logger` (`@shared/lib/logger.ts`,
local only, redacted — never log answers, passwords, tokens or emails, never pass it an object
you have not reduced to an error). Lint refuses an empty catch and a catch that neither
rethrows, returns, nor calls `logger.*` / `toAppError` (`local/no-swallowed-catch`), plus
floating and misused promises. Render crashes land in the route's `ErrorBoundary`.

## React traps that cost real time

- `speechSynthesis.getVoices()` returns a fresh array every call; reading it during render
  looped forever on machines with no German voice. It is read through `useSyncExternalStore`.
- An interval effect must not depend on an object that changes per keystroke (see the
  dates-timers rule).
- Absolutely positioned children resolve offsets against the padding box: `absolute right-0`
  inside `px-4` sits flush. Match the padding (`right-4`).

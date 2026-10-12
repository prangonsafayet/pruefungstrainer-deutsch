import fs from 'node:fs';

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import checkFile from 'eslint-plugin-check-file';
import importX from 'eslint-plugin-import-x';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import prettier from 'eslint-config-prettier';

import { trainerIds } from './scripts/trainerRegistry.mjs';

/* Architecture rules, enforced rather than documented.
 *
 *   src/app       the composition root: entry point, providers, router. May import anything.
 *   src/features  vertical slices, each with pages/. A feature imports only ITSELF, src/shared
 *                 and src/content — never another feature. Anything two features need lives
 *                 in src/shared. The header, nav and layout are a feature too (app-shell).
 *   src/shared    reusable building blocks and the cross-feature domains (progress-store,
 *                 study-schedule, account-sync, exam-run, …). May not import features or app.
 *   src/content   plain data. Imports nothing but @shared/types.
 *
 * There are no barrels: every import names a file, with its extension.
 *
 * `no-restricted-imports` is configured, not accumulated: when two flat-config entries
 * both set it for the same file, the later entry replaces the earlier one's options
 * outright instead of merging the pattern lists. So every entry below restates each
 * pattern that applies to its files. Leaving that out is silent: the old repo-wide barrel
 * rule matched `src/**` and switched the layer rules off for every file it also matched.
 */

/* No barrels, no folder imports. An alias import whose every segment lacks a dot names a
   folder (`@shared/ui`, `@shared/components/data-display`, `@features/dashboard`), and an
   `index` file is a barrel by another name. A regex rather than a group pattern: gitignore
   semantics cannot ban `@shared/ui` without also banning `@shared/ui/button.tsx`. */
const NO_BARRELS = [
  {
    regex: '^@(app|features|shared|content)(/[^/.]+)*/?$',
    message:
      "Import the file, not the folder: '@shared/ui/button.tsx', '@shared/types/exam.ts'. There are no barrels in src/."
  },
  {
    regex: '(^|/)index(\\.[cm]?[jt]sx?)?$|^\\.{1,2}/?$',
    message: 'There are no index barrels in src/: import the file that defines the thing, by its own name.'
  }
];

const APP_SHELL = {
  group: ['@app/**'],
  message:
    'Features must not import @app — src/app is the composition root above every feature; importing it inverts the dependency direction.'
};

/* Features never use each other's code. Anything two features need moves to src/shared. */
const OTHER_FEATURES = name => ({
  regex: `^@features/(?!${name}/)`,
  message: `A feature imports only itself, @shared and @content. If ${name} needs another feature's code, that code belongs in src/shared — move it there.`
});

const FEATURES_AND_APP = {
  group: ['@features/**', '@app/**'],
  message: 'src/shared must stay feature-agnostic. If it needs feature knowledge it belongs in that feature.'
};

/* Content is inert data: the only thing it may import is the types that describe it. */
const CONTENT_TYPES_ONLY = {
  regex: '^@(?!shared/types/)',
  message: 'src/content is inert data. It may import @shared/types/* and nothing else from the app.'
};

/* Relative imports may step up one level at most. Anything deeper is unreadable and
   breaks when files move; the aliases exist precisely for those paths. Because
   `no-restricted-imports` options replace rather than merge, this pattern is restated in
   EVERY restrict(...) entry below. */
const DEEP_RELATIVE = {
  group: ['../../**'],
  message:
    'Relative imports may climb at most one level; use a path alias (@features/<name>/…, @shared/…) instead.'
};

const restrict = (...patterns) => ({ 'no-restricted-imports': ['error', { patterns: patterns.flat() }] });

/* The repo-wide baseline (src/app is covered only by this); the layer entries below restate it. */
const NO_BARREL_IMPORTS = {
  name: 'no-barrel-imports',
  files: ['src/**/*.{ts,tsx}'],
  rules: restrict(NO_BARRELS, DEEP_RELATIVE)
};

/* One entry per feature directory: the feature may deep-import ITSELF through its own alias
   and nothing under any other `@features/<name>`. */
const FEATURE_ISOLATION = fs.readdirSync('src/features').map(name => ({
  name: `feature-isolation-${name}`,
  files: [`src/features/${name}/**/*.{ts,tsx}`],
  rules: restrict(OTHER_FEATURES(name), APP_SHELL, NO_BARRELS, DEEP_RELATIVE)
}));

/* The module renderers come in twin pairs, one per paper
   (`modules/dual-level/DualLevelLesenModule/DualLevelLesenModule.tsx` and
   `modules/single-level/SingleLevelLesenModule/…`). Only a format's own descriptor may
   import them — everything else (a screen, another format) goes through the format object
   instead, which is exactly what stops the twins being mixed up. */
const MODULE_RENDERERS = {
  group: ['@features/mock-exam/components/modules/**', '**/mock-exam/components/modules/**'],
  message:
    "Import a module renderer only from its own format's lib/formats/<format>/format.ts. Reaching into components/modules/ anywhere else bypasses the format descriptor and risks mixing up the dual-level and single-level twins."
};

/* Restated because this entry's files overlap feature-isolation-mock-exam above; the later
   entry replaces rather than merges, so every pattern that still applies here is repeated
   alongside the module-renderer restriction. A renderer may import its own colocated files
   relatively (`./audio.ts`), which the alias patterns do not match. */
const EXAM_MODULES_THROUGH_FORMAT = {
  name: 'exam-modules-through-format',
  files: ['src/features/mock-exam/**/*.{ts,tsx}'],
  ignores: ['src/features/mock-exam/lib/formats/*/format.ts'],
  rules: restrict(OTHER_FEATURES('mock-exam'), APP_SHELL, NO_BARRELS, DEEP_RELATIVE, MODULE_RENDERERS)
};

const SHARED_STAYS_GENERIC = {
  name: 'shared-stays-generic',
  files: ['src/shared/**/*.{ts,tsx}'],
  rules: restrict(FEATURES_AND_APP, NO_BARRELS, DEEP_RELATIVE)
};

/* A trainer's facts live in its registry descriptor, never in a comparison against its id.
   Naming 'b1' anywhere else is how the three trainers grew special cases in the first
   place, so it is refused: read the fact from `TRAINERS[trainer]`, or add it there.

   The id list is READ from the registry rather than restated here — see
   `scripts/trainerRegistry.mjs`. A hardcoded copy was the single most dangerous edit point in
   the whole design: miss it when adding a trainer and this rule silently stops covering the
   new id, so `mode === 'c1'` becomes legal everywhere and nothing fails.

   Four exempt places. The registry itself and the content folders are keyed by trainer by
   definition. The other two are the persisted document's own plumbing —
   `progress-store/lib/progressDb.ts` and `account-sync/lib/mergeProgress.ts` — which the new-trainer skill
   (.claude/skills/new-trainer) measured as irreducible: `exactOptionalPropertyTypes` means a trainer nobody has opened
   must be an ABSENT key rather than an explicit undefined, so the merge is spelled out per
   trainer instead of looped. Widening this rule is what surfaced them; they are exempted by
   name rather than silenced line by line, so the count stays visible here.

   The selector deliberately excludes `TSLiteralType`, so the union declarations that DEFINE
   the ids (`type TrainerId = 'a2b1' | 'b1' | 'b2'`) still typecheck — it is trainer ids used
   as VALUES that are banned. Unlike no-restricted-imports this is a different rule key, so
   it neither replaces nor is replaced by the layer entries above. */
const TRAINER_IDS = trainerIds();

const TRAINER_ID_SYNTAX = TRAINER_IDS.flatMap(id =>
  [
    /* `'b1'` as a value, including a computed key: `mode === 'b1'`, `db['b1']`. */
    `:not(TSLiteralType) > Literal[value='${id}']`,
    /* An object key that names one: `{ b1: … }`. A TYPE member is a different node
       (`TSPropertySignature`), so the unions and `ProgressDatabase` still declare theirs. */
    `Property > Identifier.key[name='${id}']`,
    /* Reaching one out by name: `db.b1`, `TRAINERS.a2b1`. */
    `MemberExpression > Identifier.property[name='${id}']`
  ].map(selector => ({
    selector,
    message: `'${id}' is a trainer id: read the fact you need from TRAINERS[trainer] in @shared/config/trainers.ts instead of naming the trainer. If the fact does not exist yet, add it to the descriptor — that is what makes a fourth trainer one registry entry.`
  }))
);

/* Primitives come from `@shared/ui`, and until now that was prose only: CLAUDE.md and
   .claude/rules/conventions.md both list it as a non-negotiable, but no rule matched a JSX element name,
   so a raw `<button>` shipped in the flip card and nothing said a word. The import rules
   next door were made real for the same reason — .claude/rules/architecture.md: "Dependency
   rules are ESLint rules."

   `JSXOpeningElement > JSXIdentifier` matches only the element's own name: attribute names
   hang off `JSXAttribute`, not off the opening element, so `<Input type="text" />` is fine.
   A lowercase name is always an intrinsic element, so `<Table>` from `@shared/ui/table.tsx`
   does not match while `<table>` does. */
const RAW_HTML_CONTROLS = ['button', 'input', 'select', 'textarea', 'form', 'table', 'label'].map(
  element => ({
    selector: `JSXOpeningElement > JSXIdentifier[name='${element}']`,
    message: `<${element}> is a design-system primitive: import it from its file in src/shared/ui ('@shared/ui/button.tsx'). If the one you need is missing, add it to src/shared/ui in the same style (\`npx shadcn add\`) — do not reach for raw HTML.`
  })
);

const syntax = (...groups) => ({ 'no-restricted-syntax': ['error', ...groups.flat()] });

const NO_TRAINER_ID_LITERALS = {
  name: 'no-trainer-id-literals',
  files: ['src/**/*.{ts,tsx}'],
  ignores: [
    'src/shared/config/trainers.ts',
    'src/content/**',
    'src/shared/progress-store/lib/progressDb.ts',
    'src/shared/account-sync/lib/mergeProgress.ts'
  ],
  rules: syntax(TRAINER_ID_SYNTAX)
};

/* `no-restricted-syntax` is configured, not accumulated, exactly like `no-restricted-imports`
   above: this entry matches every `.tsx` the entry above matches, so it has to restate the
   trainer-id selectors or it would switch them off for every component in the app. None of
   the four trainer-id exemptions is a `.tsx` file, so restating them here changes nothing
   about which files they cover. Its own exemption is the design system itself — those files
   are where the raw elements are supposed to live. */
const NO_RAW_HTML_CONTROLS = {
  name: 'no-raw-html-controls',
  files: ['src/**/*.tsx'],
  ignores: ['src/shared/ui/**'],
  rules: syntax(TRAINER_ID_SYNTAX, RAW_HTML_CONTROLS)
};

const CONTENT_IS_DATA_ONLY = {
  name: 'content-is-data-only',
  files: ['src/content/**/*.ts'],
  rules: restrict(CONTENT_TYPES_ONLY, NO_BARRELS, DEEP_RELATIVE)
};

/* --- Architecture guardrails added for the redesign ---
 *
 * Each ban below carries an `enforced` flag. A ban whose flag is false is fully defined but
 * switched off because the tree still violates it: those flags live together in the
 * TODO(redesign) block, each with its violation count, so flipping one is a one-word diff.
 * `LINT_REDESIGN_TODO=1 npx eslint .` (or `npm run lint:todo`) turns every one of them on, so
 * the remaining work can be listed without editing this file. */
const REDESIGN_TODO = process.env.LINT_REDESIGN_TODO === '1';

/* check-file naming globs shared by the filename and folder rules. */
const PASCAL = '+([A-Z])*([a-zA-Z0-9])';
const HOOK = 'use+([A-Z])*([a-zA-Z0-9])';
const PASCAL_OR_HOOK = `@(${PASCAL}|${HOOK})`;
const KEBAB_OR_PASCAL = `@(+([a-z])*([a-z0-9])*(-+([a-z0-9]))|${PASCAL})`;
const live = ban => ban.enforced || REDESIGN_TODO;

/* TODO(redesign) block. A ban stays false while the tree still violates it, with its count;
   flip it to true once `npm run lint:todo` reports none for that ban. All clear since the
   redesign's pass 5A (GoogleIcon keeps its brand colours under a reasoned disable). */
const ENFORCED = {
  componentHooks: true,
  componentIo: true,
  componentClock: true,
  componentStateLibs: true,
  rawColours: true
};

/* Components are visual only — enforced, not documented. A component or page file renders;
   effects, reducers, external stores, storage, the network, timers and the clock belong in a
   `use*.tsx` hook or a pure `.ts` util. Trivial `useState` / `useRef` / `useId` stay legal.
   The file set is every PascalCase `.tsx` under a components/ or pages/ folder — at any depth,
   so a component in its own folder (`components/Foo/Foo.tsx`) is covered while the hook
   beside it (`components/Foo/useFoo.tsx`) is not — minus the vendored design system.

   The import and global bans use rule keys nothing else in this file sets —
   `@typescript-eslint/no-restricted-imports`, `no-restricted-globals` and
   `no-restricted-properties` — so they neither replace nor are replaced by the layer entries
   above. Only `new Date()` needs `no-restricted-syntax`, and that entry restates the
   trainer-id and raw-control selectors exactly as NO_RAW_HTML_CONTROLS does, because its files
   are a subset of that entry's. */
const COMPONENT_FILES = ['src/**/components/**/[A-Z]*.tsx', 'src/**/pages/**/[A-Z]*.tsx'];
const VENDORED_UI = ['src/shared/ui/**'];

const LOGIC_HOOKS = ['useEffect', 'useLayoutEffect', 'useReducer', 'useSyncExternalStore'];
const IO_GLOBALS = [
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'fetch',
  'XMLHttpRequest',
  'setInterval',
  'setTimeout'
];
const VISUAL_ONLY =
  'Components are visual only: move this into a use*.tsx hook or a pure .ts util beside the component and call that from it.';

const COMPONENT_BANS = {
  componentHooks: {
    imports: [{ name: 'react', importNames: LOGIC_HOOKS, message: VISUAL_ONLY }],
    properties: LOGIC_HOOKS.map(property => ({ object: 'React', property, message: VISUAL_ONLY }))
  },
  componentIo: {
    globals: IO_GLOBALS.map(name => ({ name, message: VISUAL_ONLY })),
    properties: ['window', 'globalThis', 'self'].flatMap(object =>
      IO_GLOBALS.map(property => ({ object, property, message: VISUAL_ONLY }))
    )
  },
  componentClock: {
    properties: [{ object: 'Date', property: 'now', message: VISUAL_ONLY }],
    syntax: [
      {
        selector: "NewExpression[callee.name='Date']",
        message: `${VISUAL_ONLY} Dates go through @shared/lib/format.ts (parseIsoDate, toIsoDate, daysUntil) — new Date('YYYY-MM-DD') is UTC midnight, a day early west of Greenwich.`
      }
    ]
  },
  componentStateLibs: {
    imports: [
      { name: 'zustand', message: VISUAL_ONLY },
      { name: 'immer', message: VISUAL_ONLY }
    ],
    patterns: [{ group: ['@supabase/*', 'zustand/*'], message: VISUAL_ONLY }]
  }
};

const liveBans = Object.entries(COMPONENT_BANS)
  .filter(([key]) => live({ enforced: ENFORCED[key] }))
  .map(([, ban]) => ban);
const collect = field => liveBans.flatMap(ban => ban[field] ?? []);

const COMPONENTS_VISUAL_ONLY = {
  name: 'components-visual-only',
  files: COMPONENT_FILES,
  ignores: VENDORED_UI,
  rules: {
    '@typescript-eslint/no-restricted-imports': [
      'error',
      { paths: collect('imports'), patterns: collect('patterns') }
    ],
    'no-restricted-globals': ['error', ...collect('globals')],
    'no-restricted-properties': ['error', ...collect('properties')],
    /* Restated: see the block comment above. */
    ...syntax(TRAINER_ID_SYNTAX, RAW_HTML_CONTROLS, collect('syntax'))
  }
};

/* Colour comes from the design tokens in src/styles/index.css, never from a literal. This is a
   local rule rather than another `no-restricted-syntax` entry so it cannot fall into the
   replace-not-merge trap with the selectors above: it matches string literals and template
   chunks holding a Tailwind palette class (`bg-red-500`, `text-white`), an arbitrary colour
   (`bg-[#fff]`), a colour function (`rgb(`, `hsl(`, `oklch(`) or a bare hex value (`'#fff'`,
   as in an inline style). `color-mix(…, var(--token) …)` is token-based and allowed. */
const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const COLOUR_UTILITY =
  'bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|divide|placeholder|caret|accent|shadow';
const RAW_COLOUR_PATTERNS = [
  [new RegExp(`\\b(?:${COLOUR_UTILITY})-(?:${PALETTE})-\\d{2,3}\\b`), 'a Tailwind palette colour class'],
  [new RegExp(`\\b(?:${COLOUR_UTILITY})-(?:black|white)\\b`), 'a Tailwind black/white colour class'],
  [/-\[#/, 'a Tailwind arbitrary colour value'],
  [/\b(?:rgba?|hsla?|oklch|oklab|hwb)\(/, 'a raw colour function'],
  [/(?:^|[\s:(,])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![-\w])/, 'a raw hex colour']
];

const noRawColours = {
  meta: {
    type: 'problem',
    messages: {
      raw: 'This string holds {{what}}. Use a design token instead (a semantic utility such as bg-primary / text-muted-foreground, or var(--token)); tokens live in src/styles/index.css.'
    }
  },
  create: context => {
    const check = (node, text) => {
      if (typeof text !== 'string') return;
      const hit = RAW_COLOUR_PATTERNS.find(([pattern]) => pattern.test(text));
      if (hit) context.report({ node, messageId: 'raw', data: { what: hit[1] } });
    };
    return {
      Literal: node => check(node, node.value),
      TemplateElement: node => check(node, node.value.cooked)
    };
  }
};

const NO_RAW_COLOURS = {
  name: 'no-raw-colours',
  files: ['src/**/*.{ts,tsx}'],
  rules: { 'local/no-raw-colours': live({ enforced: ENFORCED.rawColours }) ? 'error' : 'off' }
};

/* Component files default-export their component, so imports and lazy() routes are
   uniform. Defined inline: the rule is three lines and not worth a package. The raw-colour
   rule rides in the same local plugin, registered by reference in both entries that use it
   (flat config refuses two different objects under one plugin name). */
const componentDefaultExport = {
  rules: {
    'component-default-export': {
      meta: {
        type: 'problem',
        messages: { missing: 'Component files must default-export their component.' }
      },
      create: context => ({
        'Program:exit': node => {
          const hasDefault = node.body.some(s => s.type === 'ExportDefaultDeclaration');
          if (!hasDefault) context.report({ node, messageId: 'missing' });
        }
      })
    },
    'no-raw-colours': noRawColours,
    'no-classes': {
      meta: {
        type: 'problem',
        messages: { cls: 'No classes: write arrow functions and hooks. Only the error boundary is a class.' }
      },
      create: context => ({
        ClassDeclaration: node => context.report({ node, messageId: 'cls' }),
        ClassExpression: node => context.report({ node, messageId: 'cls' })
      })
    }
  }
};

export default tseslint.config(
  /* `.claude/worktrees/` holds agent worktrees — whole checkouts of this repo. Linting one
     lints every file twice, against whatever revision it sits on. */
  {
    ignores: ['dist', 'coverage', 'playwright-report', 'test-results', 'node_modules', '.claude/worktrees']
  },

  js.configs.recommended,

  {
    name: 'app-source',
    files: ['src/**/*.{ts,tsx}'],
    /* Type-aware linting is scoped to the app source: it needs a tsconfig, and the
       tooling/tests are plain JS outside any project. */
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser },
      /* The project service, not `project: [...]`: it builds the program the way tsserver
         does, so an editor's ESLint server follows mass file moves instead of reporting
         against a cached program (stale `no-unsafe-*` "error typed value" after a refactor). */
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ project: './tsconfig.app.json', alwaysTryTypes: true })
      ]
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'import-x': importX,
      'check-file': checkFile
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      /* strict, not recommended: it adds six stricter interaction/role rules and the tree was
         already clean against them when it was switched on. */
      ...jsxA11y.flatConfigs.strict.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /* --- file and folder naming ---
       *
       * The filename says what a module is, so the convention is enforced rather than
       * hoped for:
       *   components and pages           PascalCase.tsx   (each in its own PascalCase folder)
       *   hooks                          useThing.tsx     (`use` prefix, always .tsx)
       *   utils, config, types, providers camelCase.ts
       *   folders                        kebab-case, except a component's own folder
       *
       * A component's folder holds its own hooks (`useThing.tsx`) and its own camelCase
       * utils, types and constants, so those globs admit both. A `use*.ts` file anywhere is
       * refused by filename-blocklist below: hooks are `.tsx`.
       *
       * `src/shared/ui` is exempt — the shadcn CLI writes kebab-case there and fighting it
       * would break `npx shadcn add`. It is exempt by matching none of the patterns below
       * rather than by an ignore entry, which is why no pattern names it.
       */
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/components/**/*.tsx': PASCAL_OR_HOOK,
          'src/**/pages/**/*.tsx': PASCAL_OR_HOOK,
          'src/**/components/**/*.ts': 'CAMEL_CASE',
          'src/**/pages/**/*.ts': 'CAMEL_CASE',
          'src/**/hooks/**/*.{ts,tsx}': HOOK,
          'src/**/lib/**/*.ts': 'CAMEL_CASE',
          'src/**/config/**/*.ts': 'CAMEL_CASE',
          'src/**/types/**/*.ts': 'CAMEL_CASE',
          'src/**/providers/*.ts': 'CAMEL_CASE',
          'src/**/providers/*.tsx': PASCAL_OR_HOOK,
          'src/content/**/*.ts': 'CAMEL_CASE'
        },
        { ignoreMiddleExtensions: true }
      ],
      'check-file/filename-blocklist': [
        'error',
        { 'src/**/use[A-Z]*.ts': '*.tsx' },
        { errorMessage: 'Hooks use the .tsx extension, like components: rename {{ target }} to .tsx.' }
      ],
      'check-file/no-index': ['error', { ignoreMiddleExtensions: true }],
      /* Every pattern applies, so the repo-wide one admits a component's PascalCase folder;
         `npm run check:architecture` refuses a PascalCase folder anywhere but directly holding
         its own component under components/ or pages/. */
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/features/*/': 'KEBAB_CASE',
          'src/**/!(__)*/': KEBAB_OR_PASCAL
        }
      ],

      /* --- naming convention --- */
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
        /* PascalCase is allowed wherever the value is a component or a namespace:
           `const Icon = ...`, `function StatTile()`, `import * as SelectPrimitive`. */
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow'
        },
        { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['PascalCase'] },
        /* Answer keys ("l1.0"), CSS custom properties and provider ids are data. */
        { selector: 'objectLiteralProperty', format: null },
        /* Type properties also model external contracts: Supabase returns snake_case,
           Vite env vars are SCREAMING_SNAKE, and `_updatedAt` is a persisted field name. */
        {
          selector: 'typeProperty',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
          leadingUnderscore: 'allow'
        }
      ],

      /* --- types --- */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: false }
      ],
      /* The DOM APIs this app uses (speechSynthesis, MediaRecorder) are riddled with
         legitimately-unawaited promises and void returns. */
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],

      /* --- imports --- */
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: '@content/**', group: 'internal', position: 'after' },
            { pattern: '@shared/**', group: 'internal', position: 'after' },
            { pattern: '@features/**', group: 'internal', position: 'after' },
            { pattern: '@app/**', group: 'internal', position: 'after' }
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-cycle': ['error', { maxDepth: 4 }],
      'import-x/no-self-import': 'error',

      /* --- general hygiene --- */
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      curly: ['error', 'multi-line'],
      'prefer-const': 'error',
      'object-shorthand': 'error'
    }
  },

  /* Order matters: the repo-wide barrel rule first, then the layer entries that
     restate it, so the more specific configuration is the one that survives. */
  NO_BARREL_IMPORTS,
  ...FEATURE_ISOLATION,
  EXAM_MODULES_THROUGH_FORMAT,
  SHARED_STAYS_GENERIC,
  CONTENT_IS_DATA_ONLY,
  NO_TRAINER_ID_LITERALS,
  NO_RAW_HTML_CONTROLS,
  /* After the two entries above: it restates their selectors, so it must come later. */
  COMPONENTS_VISUAL_ONLY,
  { ...NO_RAW_COLOURS, plugins: { local: componentDefaultExport } },

  {
    /* One component per file. The vendored shadcn files ship several per file and are
       exempt below. */
    name: 'one-component-per-file',
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/ui/*.tsx'],
    plugins: { react },
    rules: { 'react/no-multi-comp': 'error' }
  },
  {
    name: 'component-files-default-export',
    files: COMPONENT_FILES,
    ignores: VENDORED_UI,
    plugins: { local: componentDefaultExport },
    rules: { 'local/component-default-export': 'error' }
  },

  {
    /* Ambient declarations for Vite's build-time defines use the conventional
       __NAME__ form, which the naming rule would otherwise reject. */
    name: 'ambient-declarations',
    files: ['src/**/*.d.ts'],
    rules: { '@typescript-eslint/naming-convention': 'off' }
  },
  {
    /* Exam data files are enormous literals; naming rules there are pure noise. The path is
       `src/content/<id>/exams/` — the pre-registry `src/content/exams/` this used to
       name has not existed since the content moved, so the exemption was dead and passed only
       because `objectLiteralProperty` is `format: null` globally. */
    name: 'content-data',
    files: ['src/content/*/exams/**/*.ts'],
    rules: { '@typescript-eslint/naming-convention': 'off' }
  },
  {
    /* The shadcn CLI writes named function expressions inside `forwardRef`; the arrow
       rule strips the inline name, so the display-name heuristic can no longer infer
       one. Display names only matter in devtools, and these files are vendored. */
    name: 'vendored-ui-display-names',
    files: ['src/shared/ui/*.tsx'],
    rules: { 'react/display-name': 'off' }
  },
  {
    /* Provider modules and the vendored primitives intentionally export types, hooks and
       constants alongside components, and a hook file (`use*.tsx`) exports no component at
       all; the fast-refresh heuristic cannot know that. */
    name: 'module-surfaces',
    files: ['src/**/providers/*.tsx', 'src/shared/ui/*.tsx', 'src/**/use*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' }
  },
  {
    /* Every function is an arrow (below), and classes are how a method sneaks back in. Error
       boundaries come from react-error-boundary, so no exemption is left. */
    name: 'no-classes',
    files: ['src/**/*.{ts,tsx}'],
    plugins: { local: componentDefaultExport },
    rules: { 'local/no-classes': 'error' }
  },

  /* Tooling, tests and E2E specs run in Node and are not part of the app tsconfig.
     Extensions are listed explicitly: a directory pattern that names no extension counts
     as universal and opts none in, so the .ts suites under tests/unit went unlinted. */
  {
    name: 'node-tooling',
    files: [
      '*.{js,cjs,mjs,ts}',
      'scripts/**/*.{js,cjs,mjs,ts}',
      'tests/**/*.{js,cjs,mjs,ts}',
      'e2e/**/*.{js,cjs,mjs,ts}'
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tseslint.parser,
      /* The render suites run in happy-dom, the rest in Node, so both sets apply. */
      globals: { ...globals.node, ...globals.browser }
    },
    rules: {
      'no-console': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-undef': 'off'
    }
  },
  {
    name: 'commonjs-tooling',
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } }
  },

  {
    /* Every function is an arrow: declarations and `function` expressions are rejected
       and autofixed to `const fn = () => …`. Class methods are exempt — React lifecycle
       methods cannot be converted in place, and a method is not a free function. Ambient
       `.d.ts` declarations are excluded because `declare function` has no arrow form. */
    name: 'arrow-functions-only',
    files: [
      'src/**/*.{ts,tsx}',
      /* tests/unit holds plain .js suites too; `.ts` alone left them unchecked. */
      'tests/**/*.{js,mjs,cjs,ts,tsx}',
      /* The e2e specs are plain JS — `.ts` alone matched nothing, so the rule was inert. */
      'e2e/**/*.{js,mjs,cjs,ts}',
      'scripts/**/*.{js,mjs,cjs,ts}',
      '*.{js,mjs,cjs,ts}'
    ],
    ignores: ['**/*.d.ts'],
    plugins: { 'prefer-arrow-functions': preferArrowFunctions },
    rules: {
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: true,
          returnStyle: 'unchanged'
        }
      ]
    }
  },

  prettier
);

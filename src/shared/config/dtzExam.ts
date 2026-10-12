/**
 * Structure, points and level lines of the Deutsch-Test für Zuwanderer (DTZ, A2–B1), as the
 * g.a.s.t. Übungssatz this trainer follows states them (see `docs/dtz-format.local.md`).
 * What the trainer decides for itself — its timings, its briefing copy, its listening speed —
 * lives on its `TrainerPaper` in `src/content/trainers/dtz/paper.ts`.
 */

import { type DtzModule, type ExamModule } from '@shared/types';

/** Module order of a full sitting: Hören, Lesen, Schreiben, Sprechen. No Sprachbausteine. */
export const DTZ_MODULES: readonly DtzModule[] = ['hoeren', 'lesen', 'schreiben', 'sprechen'];

interface DtzModuleMeta {
  readonly name: string;
  readonly short: string;
}

/* A total record over `ExamModule`, so every format reads module names the same way. The
   `sprachbausteine` entry is unreachable: it is in no DTZ queue, so the runner never asks. */
export const DTZ_MODULE_META: Readonly<Record<ExamModule, DtzModuleMeta>> = {
  hoeren: { name: 'Hören', short: 'Hören' },
  lesen: { name: 'Lesen', short: 'Lesen' },
  schreiben: { name: 'Schreiben', short: 'Schreiben' },
  sprechen: { name: 'Sprechen', short: 'Sprechen' },
  sprachbausteine: { name: 'Sprachbausteine', short: 'Sprachbausteine' }
};

/** Points per module: Hören 20 items, Lesen 25 items (1 point each), Schreiben 20, Sprechen 100. */
export const DTZ_SECTION_MAX: Readonly<Record<DtzModule, number>> = {
  hoeren: 20,
  lesen: 25,
  schreiben: 20,
  sprechen: 100
};

/** Where one Teilergebnis starts to count as B1 and as A2. */
export interface DtzPartLine {
  readonly max: number;
  readonly b1From: number;
  readonly a2From: number;
}

/**
 * The three Teilergebnisse and their level lines (spec p. 47): Hören + Lesen 33/20 of 45,
 * Schreiben 15/7 of 20, Sprechen 75/35 of 100.
 */
export const DTZ_PART_LINES = {
  hoerenLesen: { max: 45, b1From: 33, a2From: 20 },
  schreiben: { max: 20, b1From: 15, a2From: 7 },
  sprechen: { max: 100, b1From: 75, a2From: 35 }
} as const satisfies Readonly<Record<string, DtzPartLine>>;

/**
 * The DTZ Sprechen criteria with their maximum points (spec p. 44–48): Aufgabenbewältigung
 * per sub-task (1A 5, 1B 5, 2A 10, 2B 10, 3 20), then four language criteria over the whole
 * exam (10, 10, 15, 15). Every scale has six steps, so one 0–5 slider step is max / 5 points.
 */
export const DTZ_SPRECHEN_MAX: readonly number[] = [5, 5, 10, 10, 20, 10, 10, 15, 15];

/**
 * Self-assessment criteria. Schreiben: the four official criteria, 0–5 each → 20 points.
 * Sprechen: the nine official scales, weighted by `DTZ_SPRECHEN_MAX` → 100 points.
 */
export const DTZ_RATING_CRITERIA: Readonly<
  Record<'schreiben' | 'sprechen', readonly (readonly [string, string])[]>
> = {
  schreiben: [
    ['Aufgabenbewältigung', 'All four Leitpunkte covered precisely, on topic'],
    ['Kommunikative Gestaltung', 'Fitting Anrede and Gruß, connected sentences, right register'],
    ['Korrektheit', 'Verb positions, endings and spelling mostly right'],
    ['Wortschatz', 'Varied, fitting words for the situation']
  ],
  sprechen: [
    ['Teil 1A — Über sich sprechen', 'Talked about every Stichwort, in full sentences'],
    ['Teil 1B — Auf Nachfragen reagieren', "Answered the examiner's follow-up questions"],
    ['Teil 2A — Bild beschreiben', 'Described the photo and the situation it shows'],
    ['Teil 2B — Über Erfahrungen sprechen', 'Answered the follow-up questions from your own experience'],
    ['Teil 3 — Gemeinsam etwas planen', 'Made suggestions, reacted to your partner, reached a plan'],
    ['Aussprache & Intonation', 'Understandable throughout, natural rhythm'],
    ['Flüssigkeit', 'Kept talking, few long pauses'],
    ['Korrektheit', 'Verb positions and endings mostly right'],
    ['Wortschatz', 'Varied, fitting words; used the Redemittel']
  ]
};

/** The Stichworte of Sprechen Teil 1A — the same on every paper (spec p. 33). */
export const DTZ_SPRECHEN_STICHWORTE: readonly string[] = [
  'Name',
  'Geburtsort',
  'Wohnort',
  'Arbeit/Beruf',
  'Familie',
  'Sprachen'
];

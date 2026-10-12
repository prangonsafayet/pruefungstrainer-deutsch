/** Reading a stored DTZ attempt's scores — shared by the results, dashboard, history and chart. */

import { DTZ_PART_LINES, type DtzPartLine } from '@shared/config/dtzExam.ts';
import { type DtzModule, type DtzSectionScores } from '@shared/types';

/** Hören + Lesen out of 45 — the one summed Teilergebnis — or null unless both were sat. */
export const dtzHoerenLesen = (scores: DtzSectionScores): number | null =>
  scores.hoeren == null || scores.lesen == null ? null : scores.hoeren + scores.lesen;

export interface DtzModuleLine {
  readonly percent: number;
  readonly label: string;
}

const b1Line = (line: DtzPartLine): DtzModuleLine => ({
  percent: (line.b1From / line.max) * 100,
  label: `B1 ab ${String(line.b1From)}`
});

/*
 * Hören and Lesen have no line of their own — only their sum does (33 of 45 for B1). Each is
 * marked at the same share as a target this trainer sets, and labelled so, never as official.
 */
const SHARE = b1Line(DTZ_PART_LINES.hoerenLesen).percent;
const SHARE_LINE: DtzModuleLine = {
  percent: SHARE,
  label: `B1 pace — this trainer's target (${String(Math.round(SHARE))}%)`
};

/** Where a module's bar or meter marks B1. */
export const dtzModuleLine = (module: DtzModule): DtzModuleLine => {
  switch (module) {
    case 'hoeren':
    case 'lesen':
      return SHARE_LINE;
    case 'schreiben':
      return b1Line(DTZ_PART_LINES.schreiben);
    case 'sprechen':
      return b1Line(DTZ_PART_LINES.sprechen);
    default:
      return SHARE_LINE;
  }
};

/** The Hören + Lesen bar's line: B1 from 33 of 45. */
export const DTZ_HOEREN_LESEN_LINE: DtzModuleLine = b1Line(DTZ_PART_LINES.hoerenLesen);

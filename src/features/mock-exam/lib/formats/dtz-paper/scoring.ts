/**
 * How a DTZ paper is marked (spec p. 42–49): one point per Hören and Lesen item, three
 * Teilergebnisse each placed at B1, A2 or unter A2, and a certificate decided from those
 * three levels — not from a total.
 */

import { DTZ_PART_LINES, type DtzPartLine } from '@shared/config/dtzExam.ts';
import {
  type AnswerMap,
  type DtzExam,
  type DtzLevel,
  type DtzResult,
  type DtzSectionScores,
  type ExamModule
} from '@shared/types';

import { dtzItems, type DtzMarkedModule } from './items.ts';

/** Correct answers of one marked module — one point each, so also its points. */
export const scoreModule = (exam: DtzExam, module: DtzMarkedModule, answers: AnswerMap): number =>
  dtzItems(exam, module).filter(item => answers[item.key] === item.expected).length;

/** Where a Teilergebnis is placed, against its own lines. */
export const dtzLevel = (points: number, line: DtzPartLine): DtzLevel => {
  if (points >= line.b1From) return 'B1';
  if (points >= line.a2From) return 'A2';
  return 'unter A2';
};

export interface DtzPartLevels {
  readonly hoerenLesen: DtzLevel;
  readonly schreiben: DtzLevel;
  readonly sprechen: DtzLevel;
}

/**
 * The certificate rule (spec p. 49). Sprechen below A2 rules out any certificate. B1 needs
 * Sprechen at B1 and one of the two written results at B1; A2 needs Sprechen at A2 or above
 * and one of the two written results at A2 or above.
 */
export const dtzCertificate = ({ hoerenLesen, schreiben, sprechen }: DtzPartLevels): DtzResult => {
  if (sprechen === 'unter A2') return 'unter A2';
  if (sprechen === 'B1' && (hoerenLesen === 'B1' || schreiben === 'B1')) return 'Zertifikat B1';
  if (hoerenLesen !== 'unter A2' || schreiben !== 'unter A2') return 'Zertifikat A2';
  return 'unter A2';
};

export interface DtzGrade {
  /** Hören + Lesen, out of 45 — the one summed Teilergebnis. */
  readonly hoerenLesen: number;
  readonly levels: DtzPartLevels;
  readonly result: DtzResult;
}

/** The three Teilergebnisse of a full sitting and the certificate they add up to. */
export const gradeFullExam = (scores: DtzSectionScores): DtzGrade => {
  const hoerenLesen = (scores.hoeren ?? 0) + (scores.lesen ?? 0);
  const levels: DtzPartLevels = {
    hoerenLesen: dtzLevel(hoerenLesen, DTZ_PART_LINES.hoerenLesen),
    schreiben: dtzLevel(scores.schreiben ?? 0, DTZ_PART_LINES.schreiben),
    sprechen: dtzLevel(scores.sprechen ?? 0, DTZ_PART_LINES.sprechen)
  };
  return { hoerenLesen, levels, result: dtzCertificate(levels) };
};

/** How many items of a module are still blank — drives the submit warning. */
export const countUnanswered = (exam: DtzExam, module: ExamModule, answers: AnswerMap): number => {
  /* Schreiben and Sprechen are self-scored; DTZ has no Sprachbausteine. */
  if (module !== 'hoeren' && module !== 'lesen') return 0;
  return dtzItems(exam, module).filter(item => {
    const value = answers[item.key];
    return value == null || value === '';
  }).length;
};

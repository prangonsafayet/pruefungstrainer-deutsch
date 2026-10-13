/**
 * The shape of one Deutsch-Test für Zuwanderer (DTZ, A2–B1) mock exam, as authored in
 * `src/content/dtz/exams`. Every count here comes from the g.a.s.t. Übungssatz the
 * trainer follows (see `docs/dtz-format.local.md`): Hören 4+5+8+3 items, Lesen 5+5+6+3+6, one
 * writing task chosen from two, a three-part oral. There is no Sprachbausteine module — the
 * gap-fill is Lesen Teil 5.
 */

import {
  type AttemptMode,
  type AudioScript,
  type ExamModule,
  type GrammarGap,
  type LesenTeil4,
  type ListeningChoiceItem,
  type MultipleChoiceQuestion,
  type TrueFalseStatement
} from './exam.ts';
import { type AnswerMap, type ModuleTimes } from './progress.ts';
import { type SingleLevelWritingTask } from './singleLevelExam.ts';

/** One Hören Teil 3 conversation: a richtig/falsch statement and an a/b/c question on it. */
export interface DtzGespraech {
  readonly audio: AudioScript;
  readonly statement: TrueFalseStatement;
  readonly question: MultipleChoiceQuestion;
}

/** One opinion in Hören Teil 4, matched to a sentence a–f. */
export interface DtzAussage {
  readonly audio: AudioScript;
  /** Index into `sentences`. */
  readonly answer: number;
}

export interface DtzHoerenSection {
  /** 4 telephone messages / public announcements, one a/b/c question each. */
  readonly teil1: { readonly anweisung: string; readonly items: readonly ListeningChoiceItem[] };
  /** 5 short radio items, one a/b/c question each. */
  readonly teil2: { readonly anweisung: string; readonly items: readonly ListeningChoiceItem[] };
  /** 4 everyday conversations, each with one richtig/falsch and one a/b/c item. */
  readonly teil3: { readonly anweisung: string; readonly gespraeche: readonly DtzGespraech[] };
  /** Opinions on one topic: 6 sentences a–f, a worked example, then 3 statements to match. */
  readonly teil4: {
    readonly anweisung: string;
    readonly thema: string;
    readonly sentences: readonly string[];
    /** Uses one of the six sentences, which no scored statement may then use. */
    readonly beispiel: DtzAussage;
    readonly aussagen: readonly DtzAussage[];
  };
}

/** One Lesen Teil 3 text with its richtig/falsch and a/b/c item. */
export interface DtzPressText {
  readonly titel: string;
  readonly text: string;
  readonly statement: TrueFalseStatement;
  readonly question: MultipleChoiceQuestion;
}

export interface DtzLesenSection {
  /** A directory / register (e.g. a building's Wegweiser) and 5 a/b/c situations. */
  readonly teil1: {
    readonly anweisung: string;
    readonly titel: string;
    readonly verzeichnis: string;
    readonly questions: readonly MultipleChoiceQuestion[];
  };
  /**
   * 5 situations, 8 ads a–h. Exactly one situation has no matching ad: its answer is
   * `NO_MATCH_ANSWER` (-1, see `@shared/lib/answers.ts`), shown as X.
   */
  readonly teil2: {
    readonly anweisung: string;
    readonly situations: readonly string[];
    readonly ads: readonly string[];
    readonly answers: readonly number[];
  };
  /** 3 press texts / formal notices, each with a richtig/falsch and an a/b/c item. */
  readonly teil3: { readonly anweisung: string; readonly texts: readonly DtzPressText[] };
  /** One information brochure, 3 richtig/falsch statements. */
  readonly teil4: LesenTeil4;
  /** A letter with gaps `[1]`–`[6]`, 3 options each. */
  readonly teil5: { readonly anweisung: string; readonly text: string; readonly gaps: readonly GrammarGap[] };
}

export interface DtzSchreibenSection {
  readonly anweisung: string;
  /** Exactly two: Aufgabe A and Aufgabe B. The candidate writes one. No incoming letter. */
  readonly tasks: readonly SingleLevelWritingTask[];
  readonly tipps: string;
}

/** A Sprechen Teil 2 photo. The app ships no images, so the photo is described in words. */
export interface DtzBild {
  readonly beschreibung: string;
  /** The examiner's follow-up questions at A2 level. */
  readonly fragenA2: readonly string[];
  /** The examiner's follow-up questions at B1 level. */
  readonly fragenB1: readonly string[];
}

export interface DtzSprechenSection {
  /** Über sich sprechen. The Stichworte are fixed for the paper and live in config. */
  readonly teil1: {
    readonly anweisung: string;
    readonly nachfragen: readonly string[];
    readonly redemittel: readonly string[];
  };
  /** Über Erfahrungen sprechen — one photo per candidate. */
  readonly teil2: {
    readonly anweisung: string;
    readonly bilder: readonly DtzBild[];
    readonly redemittel: readonly string[];
  };
  /** Gemeinsam etwas planen. */
  readonly teil3: {
    readonly situation: string;
    readonly aufgabe: string;
    /** The planning notes; the last one is an open "…?". */
    readonly notizen: readonly string[];
    readonly redemittel: readonly string[];
  };
}

export interface DtzExam {
  /** 1–10 within the trainer. */
  readonly id: number;
  readonly title: string;
  readonly theme: string;
  readonly hoeren: DtzHoerenSection;
  readonly lesen: DtzLesenSection;
  readonly schreiben: DtzSchreibenSection;
  readonly sprechen: DtzSprechenSection;
}

/* --- Attempts --- */

/** Where one Teilergebnis is placed. */
export type DtzLevel = 'B1' | 'A2' | 'unter A2';

/** The verdict of a full sitting. */
export type DtzResult = 'Zertifikat B1' | 'Zertifikat A2' | 'unter A2';

/** The modules the DTZ actually runs. */
export type DtzModule = Exclude<ExamModule, 'sprachbausteine'>;

/** Points per module: hoeren /20, lesen /25, schreiben /20, sprechen /100. */
export type DtzSectionScores = Partial<Record<DtzModule, number>>;

/** One completed DTZ attempt, as stored inside the trainer document. */
export interface DtzAttempt {
  /** `Date.now()` at completion; also the route parameter. */
  readonly id: number;
  readonly examId: number;
  readonly mode: AttemptMode;
  /** ISO timestamp. */
  readonly date: string;
  readonly times: ModuleTimes;
  readonly scores: DtzSectionScores;
  readonly answers: AnswerMap;
  /** Self-assessed: schreiben /20, sprechen /100. */
  readonly ratings: Partial<Record<'schreiben' | 'sprechen', number>>;
  /** 0 = Aufgabe A, 1 = Aufgabe B. */
  readonly writingTask?: number;
  /** Full attempts only. Part levels are derived from `scores`, never stored. */
  readonly result?: DtzResult;
}

import { type TrainerPaper } from '@shared/types';

/* How the DTZ sitting runs in this trainer. Every figure stated as the exam's own comes from
   the g.a.s.t. Übungssatz (docs/dtz-format.local.md); the source does NOT state how often a
   Hören text plays, how long each Teil takes, a Schreiben word count or a Sprechen preparation
   time, so none of those is asserted here. Plain text throughout — only the guide, the
   curriculum intro and the cheatsheets are injected as HTML. */

export const DTZ_PAPER: TrainerPaper = {
  /* Hören ca. 25, Lesen 45, Schreiben 30, Sprechen ca. 16 (pair exam) — spec p. 6 and p. 8.
     The DTZ has no Sprachbausteine: the 0 is unreachable, since no DTZ queue contains it. */
  minutes: { hoeren: 25, lesen: 45, schreiben: 30, sprechen: 16, sprachbausteine: 0 },

  briefing: {
    hoeren:
      '4 parts, 20 items, 1 point each, about 25 minutes in the real exam. Teil 1: 4 telephone messages and announcements, one a/b/c question each. Teil 2: 5 short radio items, one a/b/c question each. Teil 3: 4 everyday conversations, each with one richtig/falsch and one a/b/c item. Teil 4: opinions on one topic — match 3 statements to the sentences a–f. How often each text plays here is your setting: the DTZ material this trainer follows does not state it. Read the items before you press play.',
    lesen:
      '5 parts, 25 items, 1 point each, 45 minutes. Teil 1: a directory, 5 a/b/c situations. Teil 2: match 5 situations to 8 ads a–h — exactly one situation has no matching ad: mark it X. Teil 3: 3 press texts, each with one richtig/falsch and one a/b/c item. Teil 4: one brochure, 3 richtig/falsch statements. Teil 5: a letter with 6 gaps, a/b/c each. Hören and Lesen together make one result out of 45: B1 from 33, A2 from 20.',
    schreiben:
      'Choose Aufgabe A or Aufgabe B and write a half-formal or formal message (e-mail or letter), 20 points, 30 minutes. Cover all four Leitpunkte and do not forget the Anrede and the Gruß. The DTZ asks you to write as much as you can and gives no word count. B1 from 15 points, A2 from 7. You will score yourself against the sample answer afterwards.',
    sprechen:
      '3 parts, 100 points, about 16 minutes as a pair exam. Teil 1: talk about yourself (1A) and answer follow-up questions (1B). Teil 2: describe a photo (2A) and talk about your own experience (2B). Teil 3: plan something together with your partner. Record yourself if you allow microphone access, then rate yourself on the nine DTZ scales. B1 from 75 points, A2 from 35.',
    /* Unreachable: the DTZ has no Sprachbausteine module. */
    sprachbausteine: ''
  },

  /* This trainer's choice — the source says nothing about speech rate. */
  listeningRate: 0.95,

  /* The DTZ states no word count ("Schreiben Sie möglichst viel"), so the window is open and
     the DTZ Schreiben renderer shows a bare count instead of a target. */
  writingTarget: { min: 0, max: Number.POSITIVE_INFINITY },
  writingTitle: 'Schreiben — Mitteilung (Aufgabe A oder B)',
  writingPlaceholder: 'Sehr geehrte Damen und Herren, … / Liebe/r …',

  sprechenChips: [
    'ca. 4 Min. · 1A 5 + 1B 5 Punkte',
    'ca. 6 Min. · 2A 10 + 2B 10 Punkte',
    'ca. 6 Min. · 20 Punkte'
  ],
  prepNote: {
    lead: 'The DTZ material this trainer follows ',
    emphasis: 'states no preparation time',
    tail: ' — start when you are ready.'
  }
};

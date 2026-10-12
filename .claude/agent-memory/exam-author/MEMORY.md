# exam-author memory

One dated line per lesson. Read before authoring; append after a retry.

- 2026-10-12: Five invented telc facts (3-of-4 Leitpunkte, B1 "Kontaktaufnahme", B2 "Präsentation", B2 choice of two writing tasks, B2 formal letter) once spread to 20 papers — the verified `guide.ts` wins over `paper.ts`, curricula, exams and `validate.cjs`.
- 2026-10-12: DTZ "Not stated" — plays per Hören text, per-Teil minutes, Schreiben word count, Sprechen prep time. Never assert any of them.
- 2026-10-12: DTZ Lesen Teil 2 has 8 ads a–h for 5 situations and exactly one situation answers X.
- 2026-10-12: DTZ Schreiben offers Aufgabe A or B, each with 4 Leitpunkte; DTZ has no Sprachbausteine module (the gap-fill is Lesen Teil 5).
- 2026-10-12: The `DtzExam` type in `src/shared/types/dtzExam.ts` is the contract; read it before writing.
- 2026-10-12: richtig/falsch items must be mixed within a Teil — the validator checks it.
- 2026-10-12: Audio is TTS — `{ speaker, text }` turns, speakable sentences, no characters a voice mangles.
- 2026-10-12: No number the source lacks inside a German `anweisung`; app-owned numbers are named as the app's.
- 2026-10-12: Original texts only — never reproduce g.a.s.t. or telc Übungssatz material.
- 2026-10-12: Never renumber curriculum days/tasks (`learnDone` keys `d<day>t<index>`).

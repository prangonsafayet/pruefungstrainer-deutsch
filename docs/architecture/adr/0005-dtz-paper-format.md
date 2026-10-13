# ADR 0005: `dtz-paper` is its own format id with its own run key

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

The DTZ looks like the B1 paper from a distance: Hören, Lesen, Schreiben and Sprechen at
the A2–B1 level. Its facts come from the g.a.s.t. _Übungssatz 1_ (June 2024), and they
differ in every part the engine touches:

- there is no Sprachbausteine module;
- there are 45 one-point items numbered across Hören and Lesen;
- items are paired (richtig/falsch + MC per Gespräch or text);
- Lesen Teil 2 has an X answer;
- the oral scales are weighted unequally (5, 10, 15 or 20 points);
- the certificate comes from three Teilergebnisse, not a total.

Runs in progress are stored per paper. The B1 and B2 runs share `telcTrainerLevelRunV1`,
with one entry per trainer.

## Decision

- **A third format.** The DTZ is a third `ExamFormatId`, `dtz-paper`, with its own
  descriptor `DTZ_FORMAT`, renderers, `DtzAttempt`, `DtzTrainerDoc` slice (`db.dtz`) and
  scoring (`dtz-paper/scoring.ts`: `dtzLevel`, `gradeFullExam` and `dtzCertificate`).
- **Its own run key.** DTZ runs live under `telcTrainerDtzRunV1`, never under the shared
  single-level key. An older build's `parseRuns` reads only the trainers it knows from a
  key and rewrites the key without the others. A DTZ run filed under the shared key would
  be dropped the next time that build saved a B1 run.
- **New answer keys.** `h3m.n` and `l3m.n` are the MC halves of the paired items, and
  `NO_MATCH_ANSWER = -1` stands for X in `l2.n`.
- **Sourced numbers only.** A number the source does not state (plays per Hören text,
  per-Teil minutes, a Schreiben word count, Sprechen preparation time) is an app setting
  and is never called official.

## Consequences

- **Two new protected values.** `telcTrainerDtzRunV1` joins the protected storage keys,
  and the `dtz` slice joins `normalizeDatabase` and `mergeProgress`.
- **The cost of a new paper is now measured.** The `new-trainer` skill states it.
- **`moduleComponents` became `Partial`.** A run naming `sprachbausteine` for the DTZ goes
  home.
- **A gap with older builds.** A pre-3.0 build treats `dtz` as an unknown key (see
  [ADR 0003](0003-local-first-field-merge.md)).

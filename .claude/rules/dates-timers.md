---
paths:
  - 'src/shared/lib/format.ts'
  - 'src/shared/lib/srs.ts'
  - 'src/features/study-schedule/**'
  - 'src/shared/config/schedule.ts'
  - 'src/shared/types/schedule.ts'
  - 'src/features/mock-exam/hooks/**'
  - 'src/**/*{Date,Today,Countdown,Schedule,Timer,Clock}*'
  - 'tests/unit/{schedule,format,srs,distribute}*'
---

# Dates and timers

## Dates

`new Date('2026-09-12')` parses as **UTC midnight** — the previous day anywhere west of
Greenwich. Use `parseIsoDate` / `toIsoDate` / `daysUntil` from `@shared/lib/format.ts`. The
header countdown and the Settings hint once disagreed by a day (one rounded from 09:00, one
from midnight); they share one helper now. Components may not call `new Date()` or `Date.now`
at all (lint).

`addDays` builds the date from its parts, not `+ 86_400_000` ms, so a DST boundary cannot turn
"+1 day" into "same day, 23:00".

A hardcoded default date rots: `defaultExamDate()` is a runway from first open. Tests seed
`seedProgress({ daysUntilExam })`, never a literal date.

## The schedule

`daysUntil` reads the clock; `daysBetween` does not. Schedule maths uses `daysBetween` and takes
`today` as an argument — a pure engine is why the invariants can be swept across every runway
(5–90 days) in `tests/unit/schedule`. The tier rule is load-bearing: core days 1–14 are always
scheduled (compressed several to a day on a short runway); extension days 15–28 appear only
once every core day has its own day. Lesson-selection changes must preserve it — the sweep
will say so. `useToday` re-reads the date at local midnight and on `visibilitychange`.

## Timers

The exam clock stores an **absolute `deadline`**, not a countdown, so it survives a reload. Its
interval must not depend on the whole run object, which changes on every keystroke — the
effect tore the interval down before it could fire and the clock stalled while typing. Read
live values through refs; depend only on `phase` and `index`.

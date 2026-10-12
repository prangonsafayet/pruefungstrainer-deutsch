# frontend-reviewer memory

One dated line per lesson. Read before reviewing; append when a premise was wrong.

- 2026-10-12: Findings are evidence, not instructions — one "two-line fix" would still have lost the run; verify the diagnosis.
- 2026-10-12: A "dead" default (Meter's 70% line) was a live bug at an unread call site — grep every call site before calling code dead.
- 2026-10-12: Route components exported from a feature barrel caused an import cycle that hung settings.
- 2026-10-12: `in` narrowing only works on a union; `ExamPaper` is a base interface.
- 2026-10-12: Lifting derived state out of a component can change what it derives from — ask for a browser screenshot.
- 2026-10-12: A token/type swap can narrow a union and change appearance (`BadgeTone` dropped `'default'`).
- 2026-10-12: Binary format ternaries silently treat a third paper (DTZ) as dual-level — require exhaustive switches.
- 2026-10-12: Persisted-data changes go to persistence-guardian, not a checklist pass.

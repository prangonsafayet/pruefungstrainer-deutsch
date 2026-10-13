# ADR 0010: `Result` at I/O boundaries, a recovery key, no telemetry

- **Status:** Accepted
- **Date:** 2026-10-13

## Context

Before this decision, failures were handled ad hoc:

- a corrupt stored document loaded as an empty one, and the next write saved over it;
- a full disk lost progress without a word;
- sync errors showed raw PostgREST messages;
- a deploy left open tabs requesting chunks that no longer existed.

The app has no backend, and the project rule is no paid service and no telemetry.

## Decision

- **One error shape.** `AppError` (`shared/lib/appError.ts`) is a plain object with a
  `code` (`AppErrorCode`), a learner-facing `message` with a next action, a `recoverable`
  flag and a `cause` that is only ever logged. `Result<T, E = AppError>`, `tryCatch` and
  `tryCatchAsync` cover the boundaries where a throw would lose the reason.
- **Results at I/O boundaries.** `writeLocal` returns `Result<void>` and notifies its
  failure listeners, and failed writes land in an in-memory fallback that reads see first.
  `readBackup` returns a `Result`. `classifySyncError` maps Supabase failures to four
  codes. The recorder and speech map their own codes.
- **A recovery key.** `loadDatabase` copies unreadable stored text to
  `telcTrainerRecoveryV1` before anything replaces it. If the copy fails, every write is
  held until the learner downloads or discards the damaged data.
- **Boundaries.** `ErrorBoundary` (react-error-boundary) wraps the app root and every route,
  and resets on the path. `ErrorFallback` offers Retry, Home, or Reload for a stale chunk.
- **Global handlers.** `globalErrors.ts` listens for `error`, `unhandledrejection` and
  `vite:preloadError`. `staleChunk.ts` reloads at most once per 5 minutes, and never during
  an exam sitting or while offline.
- **A local log only.** `logger.ts` keeps the last 100 redacted entries, in memory and in
  this tab's `sessionStorage`. Settings → Diagnostics copies them for the learner to send
  if they choose. There is no third-party telemetry.
- **Lint backs the model.** `local/no-swallowed-catch` refuses a catch that neither
  rethrows, returns, nor logs. Floating promises are errors.

## Consequences

- **Every failure the learner can act on reaches them** as a toast or alert with a next
  action, never a stack trace.
- **We learn about errors only when learners send diagnostics.** We accept that for
  privacy and cost.
- **Logs never hold personal data.** Redaction is by construction: a log entry keeps an
  error's name, code and message, never an object. JSON parse failures of an import keep no
  cause, because V8's message quotes the file.

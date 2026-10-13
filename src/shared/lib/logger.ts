/**
 * A local-only log. Nothing here is ever sent anywhere: the entries live in memory and in
 * this tab's sessionStorage (so a reload after a crash still has them), bounded to the last
 * `LOG_CAPACITY`, and leave the device only when the learner copies them from Settings.
 *
 * PII-safe by construction: an entry keeps a scope, a short message and, from an error, only
 * its name, code and message — never an arbitrary object (answers, the progress document,
 * a session) — and every string is redacted before it is stored.
 */

import { isAppError } from './appError.ts';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  /** ISO timestamp. */
  readonly at: string;
  readonly level: LogLevel;
  /** Where it happened: `storage`, `sync`, `render`, `window`… */
  readonly scope: string;
  readonly message: string;
}

export const LOG_CAPACITY = 100;
const MAX_TEXT = 300;
/** sessionStorage, not localStorage: the log is per tab and gone when the tab closes. */
const LOG_SESSION_KEY = 'telcTrainerSessionLogV1';

const REDACTIONS: readonly (readonly [RegExp, string])[] = [
  [/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[email]'],
  /* JWTs (access/refresh tokens, the anon key) and Supabase keys. */
  [/\beyJ[\w-]+\.[\w-]+(?:\.[\w-]+)?/g, '[token]'],
  [/\bsb_(?:publishable|secret)_[\w-]+/gi, '[key]'],
  [/\bBearer\s+[\w.~+/-]+=*/gi, 'Bearer [token]'],
  /* A secret by name, in any of `key=value` (a query string), `key: value` and
     `"key": "value"` (JSON): an OAuth code, tokens, a password, a secret, an API key. */
  [
    /\b(password|passwd|secret|token|code|access_token|refresh_token|provider_token|apikey|api_key)("?\s*[=:]\s*"?)[^&\s"',}]+/gi,
    '$1$2[redacted]'
  ],
  /* Account ids, and opaque tokens with no name beside them (a refresh token, a hash). */
  [/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[id]'],
  [/\b[\w-]{32,}\b/g, '[token]']
];

export const redact = (text: string): string => {
  const clean = REDACTIONS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    text
  );
  return clean.length > MAX_TEXT ? `${clean.slice(0, MAX_TEXT)}…` : clean;
};

const isLogEntry = (value: unknown): value is LogEntry =>
  typeof value === 'object' &&
  value !== null &&
  'at' in value &&
  'level' in value &&
  'scope' in value &&
  'message' in value &&
  typeof value.message === 'string';

const readSession = (): LogEntry[] => {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(LOG_SESSION_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? (parsed as readonly unknown[]).filter(isLogEntry).slice(-LOG_CAPACITY)
      : [];
  } catch {
    /* No sessionStorage (or a damaged copy): the in-memory buffer is enough. */
    return [];
  }
};

let entries: LogEntry[] = readSession();

const writeSession = (): boolean => {
  try {
    sessionStorage.setItem(LOG_SESSION_KEY, JSON.stringify(entries));
    return true;
  } catch {
    /* The log must never be the thing that fails; memory still holds it. */
    return false;
  }
};

/** What of a thrown value is safe to keep: its name, code and message — never the object. */
const describe = (detail: unknown): string => {
  if (detail === undefined) return '';
  if (isAppError(detail)) {
    const cause = describe(detail.cause);
    return `[${detail.code}]${cause ? ` ${cause}` : ''}`;
  }
  /* A JSON SyntaxError quotes the text it failed on — a learner's backup file. */
  if (detail instanceof SyntaxError) return detail.name;
  if (detail instanceof Error) return `${detail.name}: ${detail.message}`;
  if (typeof detail === 'string' || typeof detail === 'number' || typeof detail === 'boolean') {
    return String(detail);
  }
  if (
    typeof detail === 'object' &&
    detail !== null &&
    'message' in detail &&
    typeof detail.message === 'string'
  ) {
    const code = 'code' in detail && typeof detail.code === 'string' ? ` (${detail.code})` : '';
    return `${detail.message}${code}`;
  }
  return typeof detail;
};

/* Dev only, and not under Vitest: a test that exercises a failure path should not print it. */
const ECHO = import.meta.env.DEV && import.meta.env.MODE !== 'test';

const write = (level: LogLevel, scope: string, message: string, detail?: unknown): void => {
  const extra = describe(detail);
  const entry: LogEntry = {
    at: new Date().toISOString(),
    level,
    scope,
    message: redact(extra ? `${message} — ${extra}` : message)
  };
  entries = [...entries, entry].slice(-LOG_CAPACITY);
  writeSession();
  if (ECHO) (level === 'error' ? console.error : console.warn)(`[${scope}] ${entry.message}`);
};

export const logger = {
  debug: (scope: string, message: string, detail?: unknown): void => {
    write('debug', scope, message, detail);
  },
  info: (scope: string, message: string, detail?: unknown): void => {
    write('info', scope, message, detail);
  },
  warn: (scope: string, message: string, detail?: unknown): void => {
    write('warn', scope, message, detail);
  },
  error: (scope: string, message: string, detail?: unknown): void => {
    write('error', scope, message, detail);
  }
};

/** The buffer, oldest first. */
export const getLogEntries = (): readonly LogEntry[] => entries;

/** Test seam: empties the buffer and its session copy. */
export const clearLog = (): void => {
  entries = [];
  writeSession();
};

import {
  LANGUAGE_TOOL_CACHE_ENTRIES,
  LANGUAGE_TOOL_LANGUAGE,
  LANGUAGE_TOOL_MAX_CHARS,
  LANGUAGE_TOOL_TIMEOUT_MS,
  getLanguageToolBase,
  isDynamicFeedbackEnabled
} from '@shared/config/languageTool.ts';
import { type LtMatch, type LtResult } from '@shared/types/languageTool.ts';

import { logger } from './logger.ts';

export const isLanguageToolConfigured = (): boolean => isDynamicFeedbackEnabled();

/* Same text, same answer. The generator checks one sentence per distractor, so the same
   authored sentence is submitted many times in a session. */
const cache = new Map<string, LtResult>();

const remember = (key: string, result: LtResult): LtResult => {
  if (result.kind === 'ok') {
    if (cache.size >= LANGUAGE_TOOL_CACHE_ENTRIES) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(key, result);
  }
  return result;
};

const isRecord = (value: unknown): value is Partial<Record<string, unknown>> =>
  typeof value === 'object' && value !== null;

/** Enough of a match to report — the fields the error report reads. The response is untrusted. */
const isLtMatch = (value: unknown): value is LtMatch => {
  if (!isRecord(value)) return false;
  const rule = value['rule'];
  return (
    typeof value['message'] === 'string' &&
    typeof value['offset'] === 'number' &&
    typeof value['length'] === 'number' &&
    Array.isArray(value['replacements']) &&
    isRecord(rule) &&
    typeof rule['id'] === 'string' &&
    typeof rule['issueType'] === 'string' &&
    isRecord(rule['category']) &&
    typeof rule['category']['id'] === 'string'
  );
};

const parseMatches = (payload: unknown): readonly LtMatch[] => {
  const matches = isRecord(payload) ? payload['matches'] : undefined;
  return Array.isArray(matches) ? (matches as readonly unknown[]).filter(isLtMatch) : [];
};

/**
 * @public Issue #18 (writing feedback): no screen calls it yet; its unit tests do.
 */
export const checkText = async (
  text: string,
  options: { readonly level?: 'default' | 'picky' } = {}
): Promise<LtResult> => {
  if (!isLanguageToolConfigured()) return { kind: 'unavailable', reason: 'not-configured' };
  if (text.length > LANGUAGE_TOOL_MAX_CHARS) return { kind: 'unavailable', reason: 'too-long' };

  const level = options.level ?? 'default';
  const key = `${level}:${text}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const body = new URLSearchParams({ text, language: LANGUAGE_TOOL_LANGUAGE, level });

  try {
    const response = await fetch(`${getLanguageToolBase()}/v2/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body,
      signal: AbortSignal.timeout(LANGUAGE_TOOL_TIMEOUT_MS)
    });
    if (response.status === 429) return { kind: 'unavailable', reason: 'rate-limited' };
    if (response.status === 413) return { kind: 'unavailable', reason: 'too-long' };
    if (!response.ok) {
      logger.warn('languagetool', `Check failed with HTTP ${String(response.status)}`);
      return { kind: 'unavailable', reason: 'error' };
    }
    return remember(key, { kind: 'ok', matches: parseMatches(await response.json()) });
  } catch (error) {
    /* A timeout and a dead server are the same thing to a learner: no feedback this time. */
    logger.info('languagetool', 'Check unavailable', error);
    return { kind: 'unavailable', reason: 'offline' };
  }
};

import { describe, expect, it } from 'vitest';

import {
  appError,
  isAppError,
  isChunkLoadError,
  toAppError,
  tryCatch,
  tryCatchAsync
} from '@shared/lib/appError.ts';

const domError = (name: string, message = name): Error => Object.assign(new Error(message), { name });

describe('appError', () => {
  it('carries a learner-facing default message, never the raw cause', () => {
    const cause = new Error('QuotaExceededError: the quota has been exceeded at line 7');
    const error = appError('storage-full', { cause });
    expect(error).toMatchObject({ kind: 'app-error', code: 'storage-full', recoverable: true, cause });
    expect(error.message).toMatch(/Export a backup, then free some space/);
    expect(error.message).not.toContain('line 7');
  });

  it('takes a specific message over the default, and marks only crash-level codes unrecoverable', () => {
    expect(appError('import-bad-field', { message: 'field x' }).message).toBe('field x');
    expect(appError('chunk-load').recoverable).toBe(false);
    expect(appError('unknown').recoverable).toBe(false);
    expect(appError('sync-offline').recoverable).toBe(true);
  });

  it('omits `cause` when none was given', () => {
    expect('cause' in appError('network')).toBe(false);
  });

  it('recognises its own shape only', () => {
    expect(isAppError(appError('network'))).toBe(true);
    for (const value of [null, undefined, 'x', new Error('x'), { kind: 'other' }])
      expect(isAppError(value)).toBe(false);
  });
});

describe('toAppError', () => {
  it('passes an AppError through untouched', () => {
    const original = appError('mic-denied');
    expect(toAppError(original)).toBe(original);
  });

  it('classifies a full quota in both spellings', () => {
    expect(toAppError(domError('QuotaExceededError')).code).toBe('storage-full');
    expect(toAppError(domError('NS_ERROR_DOM_QUOTA_REACHED')).code).toBe('storage-full');
  });

  it.each([
    'Failed to fetch dynamically imported module: https://x.test/assets/SettingsPage-abc.js',
    'error loading dynamically imported module: https://x.test/assets/a.js',
    'Importing a module script failed.',
    'Unable to preload CSS for /assets/index-abc.css'
  ])('classifies a stale chunk: %s', message => {
    expect(toAppError(new TypeError(message)).code).toBe('chunk-load');
    expect(isChunkLoadError(new TypeError(message))).toBe(true);
  });

  it("classifies webpack's ChunkLoadError by name", () => {
    expect(isChunkLoadError(domError('ChunkLoadError', 'x'))).toBe(true);
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false);
  });

  it('classifies a dead network, and falls back to the caller code otherwise', () => {
    expect(toAppError(new TypeError('Failed to fetch')).code).toBe('network');
    expect(toAppError(new Error('boom')).code).toBe('unknown');
    expect(toAppError(domError('SecurityError'), 'storage-unavailable').code).toBe('storage-unavailable');
    expect(toAppError('a string', 'sync-failed').code).toBe('sync-failed');
  });
});

describe('tryCatch', () => {
  it('wraps a value, and turns a throw into a typed failure', () => {
    expect(tryCatch(() => 4)).toEqual({ ok: true, value: 4 });
    const failed = tryCatch(() => {
      throw domError('QuotaExceededError');
    });
    expect(failed.ok).toBe(false);
    if (!failed.ok) expect(failed.error.code).toBe('storage-full');
  });

  it('never rejects in its async form', async () => {
    expect(await tryCatchAsync(() => Promise.resolve('x'))).toEqual({ ok: true, value: 'x' });
    const failed = await tryCatchAsync(() => Promise.reject(new Error('down')), 'sync-failed');
    expect(failed.ok ? null : failed.error.code).toBe('sync-failed');
  });
});

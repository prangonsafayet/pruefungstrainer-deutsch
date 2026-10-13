import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type AppError } from '@shared/lib/appError.ts';
import { clearLog, getLogEntries } from '@shared/lib/logger.ts';
import {
  readLocal,
  readLocalJson,
  removeLocal,
  subscribeToStorageFailures,
  writeLocal
} from '@shared/lib/storage.ts';

import { installMemoryStorage } from '../support/memoryStorage.ts';

installMemoryStorage();

const domError = (name: string): Error => Object.assign(new Error(name), { name });

/** Makes every `setItem` throw `name` until restored. */
const failWrites = (name: string): (() => void) => {
  const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
    throw domError(name);
  });
  return () => {
    spy.mockRestore();
  };
};

describe('storage', () => {
  let failures: AppError[];
  let unsubscribe: () => void;

  beforeEach(() => {
    installMemoryStorage();
    clearLog();
    failures = [];
    unsubscribe = subscribeToStorageFailures(error => failures.push(error));
  });

  afterEach(() => {
    unsubscribe();
    removeLocal('k');
  });

  it('writes and reads through localStorage', () => {
    expect(writeLocal('k', 'v')).toEqual({ ok: true, value: undefined });
    expect(localStorage.getItem('k')).toBe('v');
    expect(readLocal('k')).toBe('v');
    expect(failures).toEqual([]);
  });

  it('reports a full quota as storage-full, logs it and keeps the value for the session', () => {
    writeLocal('k', 'old');
    const restore = failWrites('QuotaExceededError');

    const result = writeLocal('k', 'new');

    expect(result.ok ? null : result.error.code).toBe('storage-full');
    expect(failures.map(failure => failure.code)).toEqual(['storage-full']);
    expect(getLogEntries().at(-1)).toMatchObject({ level: 'warn', scope: 'storage' });
    /* Regression: the read went to localStorage first and handed back "old" — the stored
       value from before the failed write — silently undoing everything since. */
    expect(readLocal('k')).toBe('new');
    restore();
  });

  it('forgets the in-memory copy once a write succeeds again', () => {
    const restore = failWrites('QuotaExceededError');
    writeLocal('k', 'memory');
    restore();
    writeLocal('k', 'disk');
    localStorage.setItem('k', 'changed elsewhere');
    expect(readLocal('k')).toBe('changed elsewhere');
  });

  it('reports blocked storage as storage-unavailable', () => {
    const restore = failWrites('SecurityError');
    const result = writeLocal('k', 'v');
    expect(result.ok ? null : result.error.code).toBe('storage-unavailable');
    expect(failures[0]?.message).toMatch(/export a backup/i);
    restore();
  });

  it('reads null, not a throw, when storage itself is disabled', () => {
    const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw domError('SecurityError');
    });
    expect(readLocal('absent')).toBeNull();
    spy.mockRestore();
  });

  it('reads corrupt JSON as null', () => {
    writeLocal('k', '{"half":');
    expect(readLocalJson('k')).toBeNull();
  });

  it('stops telling a listener once it unsubscribes', () => {
    unsubscribe();
    const restore = failWrites('QuotaExceededError');
    writeLocal('k', 'v');
    expect(failures).toEqual([]);
    restore();
  });
});

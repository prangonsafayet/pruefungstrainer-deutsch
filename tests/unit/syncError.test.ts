import { describe, expect, it } from 'vitest';

import { classifySyncError } from '@shared/account-sync/lib/syncError.ts';

const failure = (fields: Record<string, unknown>): Error =>
  Object.assign(new Error(String(fields['message'] ?? '')), fields);

describe('classifySyncError', () => {
  it('says offline whenever the browser is, whatever the error', () => {
    expect(classifySyncError(failure({ code: '42501' }), false).code).toBe('sync-offline');
  });

  it.each([
    [{ code: '42501', message: 'new row violates row-level security policy for table "progress"' }],
    [{ code: 'PGRST301', message: 'JWT expired' }],
    [{ message: 'x', status: 401 }],
    [{ message: 'x', status: 403 }]
  ])('maps an RLS denial or a dead session to sync-denied: %j', fields => {
    expect(classifySyncError(failure(fields), true).code).toBe('sync-denied');
  });

  it('maps a rate limit by status or wording', () => {
    expect(classifySyncError(failure({ message: 'x', status: 429 }), true).code).toBe('sync-rate-limited');
    expect(classifySyncError(failure({ message: 'Too many requests' }), true).code).toBe('sync-rate-limited');
  });

  it('maps a failed fetch while "online" to offline (a captive portal, a dead route)', () => {
    expect(classifySyncError(new TypeError('Failed to fetch'), true).code).toBe('sync-offline');
  });

  it('falls back to sync-failed, and every message says the data is safe', () => {
    const generic = classifySyncError(failure({ message: 'upstream 502', status: 502 }), true);
    expect(generic.code).toBe('sync-failed');
    for (const fields of [{ code: '42501' }, { status: 429 }, { status: 500 }]) {
      expect(classifySyncError(failure(fields), true).message).toMatch(/this browser|nothing is lost/);
    }
    expect(classifySyncError('weird', true).code).toBe('sync-failed');
  });
});

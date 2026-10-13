import { describe, expect, it } from 'vitest';

import { classifyAuthError } from '@shared/account-sync/lib/authError.ts';

/* Supabase Auth's raw text — and a provider's `error_description` from the address bar —
   used to be shown as is. Every failure now maps to one of our own messages, with the raw
   value kept only as `cause` for the local log. */
describe('classifyAuthError', () => {
  it.each([
    ['Failed to fetch', 'auth-offline'],
    ['Email rate limit exceeded', 'auth-rate-limited'],
    ['For security purposes, you can only request this after 51 seconds.', 'auth-rate-limited'],
    ['Invalid login credentials', 'auth-bad-credentials'],
    ['Email not confirmed', 'auth-email-not-confirmed'],
    ['Password should be at least 6 characters', 'auth-weak-password'],
    ['access_denied', 'auth-denied'],
    ['Database error saving new user', 'auth-failed'],
    ['', 'auth-failed']
  ] as const)('%j → %s', (message, code) => {
    const failure = classifyAuthError(new Error(message));
    expect(failure.code).toBe(code);
    expect(failure.message).not.toContain(message || '\u0000');
  });

  it('reads an offline browser as offline whatever the message', () => {
    expect(classifyAuthError(new Error('Invalid login credentials'), false).code).toBe('auth-offline');
  });

  it('takes plain strings and Supabase error objects, and keeps the raw value as the cause', () => {
    expect(classifyAuthError('access_denied').code).toBe('auth-denied');
    const raw = { message: 'Email not confirmed', status: 400 };
    const failure = classifyAuthError(raw);
    expect(failure.code).toBe('auth-email-not-confirmed');
    expect(failure.cause).toBe(raw);
    expect(classifyAuthError(42).code).toBe('auth-failed');
  });
});

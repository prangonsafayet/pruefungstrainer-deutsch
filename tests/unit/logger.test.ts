import { beforeEach, describe, expect, it } from 'vitest';

import { appError } from '@shared/lib/appError.ts';
import { clearLog, getLogEntries, LOG_CAPACITY, logger, redact } from '@shared/lib/logger.ts';

import { installMemoryStorage } from '../support/memoryStorage.ts';

installMemoryStorage();

describe('redact', () => {
  it.each([
    ['sign-in failed for anna.schmidt+tag@example.co.uk', 'anna.schmidt', '[email]'],
    ['token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc-DEF_123 expired', 'eyJhbGci', '[token]'],
    ['key sb_publishable_AbC123xyz rejected', 'sb_publishable_AbC123xyz', '[key]'],
    ['Authorization: Bearer abc.def-ghi', 'abc.def-ghi', 'Bearer [token]'],
    ['GET /?code=4f7a9b&state=1', '4f7a9b', 'code=[redacted]'],
    ['password=hunter2 refused', 'hunter2', 'password=[redacted]'],
    ['access_token=xyz&refresh_token=abc', 'xyz', 'access_token=[redacted]'],
    ['{"refresh_token":"v1q2w3e4r5t6","user":1}', 'v1q2w3e4r5t6', '"refresh_token":"[redacted]'],
    ['password: hunter2', 'hunter2', 'password: [redacted]'],
    ['{"secret": "s3cr3t-value"}', 's3cr3t-value', '"secret": "[redacted]'],
    ['code:abc123 failed', 'abc123', 'code:[redacted]'],
    ['token "x" opaque Zx8v2Lq9Wm4Rt7Yp1Ks6Hd3Fg5Jc0Nb2Vq', 'Zx8v2Lq9Wm4Rt7Yp1Ks6Hd3Fg5Jc0Nb2Vq', '[token]'],
    ['user 3f2b8c1e-9a4d-4e7f-b1c2-0d9e8f7a6b5c denied', '3f2b8c1e-9a4d', '[id]']
  ])('removes the secret from %j', (input, secret, marker) => {
    const clean = redact(input);
    expect(clean).not.toContain(secret);
    expect(clean).toContain(marker);
  });

  it('truncates a long message', () => {
    expect(redact('x '.repeat(500))).toHaveLength(301);
  });
});

describe('logger', () => {
  beforeEach(() => {
    clearLog();
  });

  it('keeps level, scope and a redacted message', () => {
    logger.warn('auth', 'Sign-in failed', new Error('Invalid login for a@b.de'));
    const [entry] = getLogEntries();
    expect(entry).toMatchObject({ level: 'warn', scope: 'auth' });
    expect(entry?.message).toBe('Sign-in failed — Error: Invalid login for [email]');
    expect(entry?.at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('keeps only the newest entries, bounded', () => {
    for (let i = 0; i < LOG_CAPACITY + 50; i++) logger.info('test', `entry ${String(i)}`);
    const entries = getLogEntries();
    expect(entries).toHaveLength(LOG_CAPACITY);
    expect(entries[0]?.message).toBe('entry 50');
    expect(entries.at(-1)?.message).toBe(`entry ${String(LOG_CAPACITY + 49)}`);
  });

  it('mirrors the buffer into sessionStorage, bounded the same way', () => {
    for (let i = 0; i < LOG_CAPACITY + 5; i++) logger.debug('test', String(i));
    const stored: unknown = JSON.parse(sessionStorage.getItem('telcTrainerSessionLogV1') ?? '[]');
    expect(Array.isArray(stored) ? stored.length : -1).toBe(LOG_CAPACITY);
  });

  it('never serialises an arbitrary object — answers or a progress document stay out', () => {
    logger.error('exam', 'Crashed', { answers: { 'w.text': 'Liebe Anna, ich schreibe dir' } });
    expect(getLogEntries()[0]?.message).toBe('Crashed — object');
  });

  it("keeps an AppError's code and its cause's message", () => {
    logger.warn('storage', 'Write failed', appError('storage-full', { cause: new Error('quota') }));
    expect(getLogEntries()[0]?.message).toBe('Write failed — [storage-full] Error: quota');
  });

  it("keeps a Supabase-style error's message and code", () => {
    logger.warn('sync', 'Sync failed', { message: 'permission denied', code: '42501' });
    expect(getLogEntries()[0]?.message).toBe('Sync failed — permission denied (42501)');
  });

  it("never keeps a JSON SyntaxError's message — V8 quotes the text it failed on", () => {
    let thrown: unknown;
    try {
      JSON.parse('{"w.text": "Liebe Anna, ich schreibe');
    } catch (error) {
      thrown = error;
    }
    logger.warn('import', 'Parse failed', thrown);
    expect(getLogEntries().at(-1)?.message).toBe('Parse failed — SyntaxError');
  });
});

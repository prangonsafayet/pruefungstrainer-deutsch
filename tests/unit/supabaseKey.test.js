import { describe, expect, it } from 'vitest';

import { isSecretSupabaseKey } from '../../scripts/supabaseKey.mjs';

/*
 * The build used to refuse only `sb_secret_` keys: a legacy `service_role` JWT passed and was
 * inlined into the public bundle. JWT segments are base64url, so the fixture is built until
 * its payload carries a `-` or `_` — the characters a plain base64 decoder chokes on.
 */

/** A JWT for `role` whose payload segment holds a base64url-only character. */
const jwt = role => {
  for (let filler = ''; filler.length < 8; filler += '?') {
    const payload = Buffer.from(JSON.stringify({ role, ref: 'abc', n: filler })).toString('base64url');
    if (/[-_]/.test(payload)) return `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
  }
  throw new Error('no fixture with a base64url-only character');
};

describe('isSecretSupabaseKey', () => {
  it('refuses a service_role JWT, even when its payload is base64url-only', () => {
    const key = jwt('service_role');
    expect(key.split('.')[1]).toMatch(/[-_]/);
    expect(isSecretSupabaseKey(key)).toBe(true);
  });

  it('refuses an sb_secret_ key', () => {
    expect(isSecretSupabaseKey('sb_secret_abc123')).toBe(true);
  });

  it('accepts the anon JWT and a publishable key', () => {
    expect(isSecretSupabaseKey(jwt('anon'))).toBe(false);
    expect(isSecretSupabaseKey('sb_publishable_abc123')).toBe(false);
    expect(isSecretSupabaseKey('')).toBe(false);
  });
});

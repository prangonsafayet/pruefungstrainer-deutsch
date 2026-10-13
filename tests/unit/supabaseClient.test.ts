import { describe, expect, it, vi } from 'vitest';

/*
 * The runtime twin of the build check: a `service_role` JWT must turn sync off. The decoder
 * used plain `atob`, which throws on base64url's `-`/`_`; the throw was caught as "not a
 * JWT", so exactly such a key was taken for an anon key.
 */

/** A JWT for `role` whose payload segment holds a base64url-only character. */
const jwt = (role: string): string => {
  for (let filler = ''; filler.length < 8; filler += '?') {
    const payload = btoa(JSON.stringify({ role, ref: 'abc', n: filler }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    if (/[-_]/.test(payload)) return `eyJhbGciOiJIUzI1NiJ9.${payload}.sig`;
  }
  throw new Error('no fixture with a base64url-only character');
};

const load = async (anonKey: string) => {
  vi.resetModules();
  vi.doMock('@shared/account-sync/lib/supabaseConfig.ts', () => ({
    SUPABASE_CONFIG: { url: 'https://abc.supabase.co', anonKey },
    CONFIGURED_PROVIDER_IDS: []
  }));
  return import('@shared/account-sync/lib/supabaseClient.ts');
};

describe('the Supabase key check at runtime', () => {
  it('refuses a service_role JWT whose payload is base64url-only', async () => {
    const key = jwt('service_role');
    expect(key.split('.')[1]).toMatch(/[-_]/);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const client = await load(key);

    expect(client.syncDiagnostics.keyIsSecret).toBe(true);
    expect(client.isSyncConfigured).toBe(false);
    expect(client.supabase).toBeNull();
    consoleError.mockRestore();
  });

  it('accepts the anon JWT', async () => {
    const client = await load(jwt('anon'));

    expect(client.syncDiagnostics.keyIsSecret).toBe(false);
    expect(client.isSyncConfigured).toBe(true);
  });
});

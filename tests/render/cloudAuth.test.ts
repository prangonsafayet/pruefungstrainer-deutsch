import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_SETTINGS } from '@shared/config/exam.ts';
import { type ProgressDatabase } from '@shared/types/progress.ts';

import { renderHook, settle } from './harness.ts';

/*
 * `useCloudSync`'s account and sync-failure paths, against a fake Supabase client: what the
 * learner is told for each answer the auth API can give (wrong password, unconfirmed email,
 * every sign-up outcome, a rate-limited resend, a provider that is not enabled), and how a
 * failed sync is classified — offline is a state, a refused session is an error with Retry.
 * Nothing here can be reached through the UI without a real project.
 */

interface Toast {
  readonly kind: string;
  readonly title: string;
  readonly description: string;
}

const toasts: Toast[] = [];

vi.mock('sonner', () => {
  const record =
    (kind: string) =>
    (title: string, options?: { readonly description?: string }): void => {
      toasts.push({ kind, title, description: options?.description ?? '' });
    };
  return {
    toast: {
      success: record('success'),
      error: record('error'),
      warning: record('warning'),
      info: record('info')
    }
  };
});

type Reply = {
  readonly data?: unknown;
  readonly error: { readonly message: string; readonly code?: string } | null;
};

const USER = { id: 'user-1', app_metadata: {}, user_metadata: {} };
let sessionUser: typeof USER | null = null;
const replies = new Map<string, Reply | 'throw'>();
let selects = 0;

const reply = (name: string, fallback: Reply = { data: {}, error: null }): Promise<Reply> => {
  const value = replies.get(name) ?? fallback;
  return value === 'throw' ? Promise.reject(new Error(`${name} crashed`)) : Promise.resolve(value);
};

vi.mock('@shared/account-sync/lib/supabaseClient.ts', () => ({
  isSyncConfigured: true,
  PROGRESS_TABLE: 'progress',
  syncDiagnostics: {},
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: sessionUser ? { user: sessionUser } : null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: () => reply('signIn'),
      signUp: () => reply('signUp'),
      resend: () => reply('resend'),
      resetPasswordForEmail: () => reply('reset'),
      signOut: () => reply('signOut'),
      signInWithOAuth: () => reply('oauth')
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => {
            selects += 1;
            return reply('select', { data: null, error: null });
          }
        })
      }),
      upsert: () => reply('upsert', { error: null })
    })
  }
}));

const { useCloudSync } = await import('@shared/account-sync/hooks/useCloudSync.tsx');

const DB: ProgressDatabase = {
  attempts: [],
  learnDone: {},
  settings: DEFAULT_SETTINGS,
  srs: {},
  activity: {},
  _updatedAt: '2026-01-01T00:00:00.000Z'
};

const mountSync = async () => {
  const dbRef = { current: DB };
  const hook = await renderHook(() =>
    useCloudSync({
      dbRef,
      replaceLocal: next => {
        dbRef.current = next;
      },
      updatedAt: dbRef.current._updatedAt
    })
  );
  unmount = hook.unmount;
  await settle(30);
  return hook;
};

let unmount: (() => Promise<void>) | null = null;
const online = vi.spyOn(navigator, 'onLine', 'get');

beforeEach(() => {
  toasts.length = 0;
  replies.clear();
  sessionUser = null;
  selects = 0;
  online.mockReturnValue(true);
});

afterEach(async () => {
  await unmount?.();
  unmount = null;
});

const lastToast = (): Toast | undefined => toasts.at(-1);

describe('password sign-in', () => {
  it.each([
    [null, true, 'Signed in', ''],
    ['Invalid login credentials', false, 'Could not sign in', 'Email or password is incorrect.'],
    [
      'Email not confirmed',
      false,
      'Could not sign in',
      'Confirm your email address first — check your inbox for the link.'
    ],
    ['Database error', false, 'Could not sign in', 'Database error']
  ])('%s → %s', async (message, succeeds, title, description) => {
    replies.set('signIn', { error: message === null ? null : { message } });
    const hook = await mountSync();

    let result: boolean | undefined;
    await hook.act(async () => {
      result = await hook.current().signInWithPassword('learner@example.test', 'pw');
    });

    expect(result).toBe(succeeds);
    expect(lastToast()?.title).toBe(title);
    if (!succeeds) expect(hook.current().status).toBe(description);
    expect(hook.current().busyWithEmail).toBe(false);
  });
});

describe('sign-up', () => {
  it.each([
    [{ data: { user: { identities: [{}] }, session: {} }, error: null }, 'signed-in', 'Account created'],
    [
      { data: { user: { identities: [{}] }, session: null }, error: null },
      'confirmation-sent',
      'Confirm your email'
    ],
    [
      { data: { user: { identities: [] }, session: null }, error: null },
      'already-registered',
      'You already have an account'
    ],
    [{ data: null, error: { message: 'Password is too weak' } }, 'failed', 'Could not create the account']
  ] as const)('%j → %s', async (answer, kind, title) => {
    replies.set('signUp', answer);
    const hook = await mountSync();

    let outcome: { readonly kind: string } | undefined;
    await hook.act(async () => {
      outcome = await hook.current().signUpWithPassword('learner@example.test', 'Correct-Horse-9');
    });

    expect(outcome?.kind).toBe(kind);
    expect(lastToast()?.title).toBe(title);
  });

  it('a crashed request is a failure with its reason, not an unhandled rejection', async () => {
    replies.set('signUp', 'throw');
    const hook = await mountSync();

    let outcome: { readonly kind: string; readonly message?: string } | undefined;
    await hook.act(async () => {
      outcome = await hook.current().signUpWithPassword('learner@example.test', 'Correct-Horse-9');
    });

    expect(outcome).toEqual({ kind: 'failed', message: 'signUp crashed' });
  });
});

describe('resending the confirmation and resetting the password', () => {
  it.each([
    [null, true, 'success', /Check the inbox/],
    [
      'For security purposes, you can only request this after 51 seconds.',
      false,
      'warning',
      /try again in 51 seconds/
    ],
    ['Email rate limit exceeded', false, 'warning', /wait a minute/],
    ['Mailer down', false, 'error', /^Mailer down$/]
  ])('resend with %s', async (message, succeeds, kind, description) => {
    replies.set('resend', { error: message === null ? null : { message } });
    const hook = await mountSync();

    let result: boolean | undefined;
    await hook.act(async () => {
      result = await hook.current().resendConfirmation('learner@example.test');
    });

    expect(result).toBe(succeeds);
    expect(lastToast()?.kind).toBe(kind);
    expect(lastToast()?.description).toMatch(description);
  });

  it('says a reset link is on its way, or why it is not', async () => {
    const hook = await mountSync();
    await hook.act(() => hook.current().sendPasswordReset('learner@example.test'));
    expect(lastToast()?.title).toBe('Password reset sent');

    replies.set('reset', { error: { message: 'Mailer down' } });
    await hook.act(() => hook.current().sendPasswordReset('learner@example.test'));
    expect(lastToast()).toMatchObject({ kind: 'error', description: 'Mailer down' });
  });
});

describe('provider sign-in', () => {
  it('names a provider that is not enabled, and clears the pending state', async () => {
    replies.set('oauth', { error: { message: 'Unsupported provider: provider is not enabled' } });
    const hook = await mountSync();

    await hook.act(() => hook.current().signInWithProvider('google'));

    expect(lastToast()?.title).toBe('Google sign-in is not enabled');
    expect(hook.current().status).toMatch(/Google is not enabled for this Supabase project/);
    expect(hook.current().pendingProvider).toBeNull();
  });

  it('reports any other failure as is', async () => {
    replies.set('oauth', { error: { message: 'network down' } });
    const hook = await mountSync();

    await hook.act(() => hook.current().signInWithProvider('github'));

    expect(lastToast()).toMatchObject({ title: 'Could not start sign-in', description: 'network down' });
  });
});

describe('a signed-in session', () => {
  beforeEach(() => {
    sessionUser = USER;
  });

  it('signs out even when the request fails, and says so', async () => {
    replies.set('signOut', { error: { message: 'offline' } });
    const hook = await mountSync();
    expect(hook.current().user?.id).toBe('user-1');

    await hook.act(() => hook.current().signOut());

    expect(lastToast()?.title).toBe('Could not sign out');
    expect(hook.current().user).toBeNull();
  });

  it('announces a sync that worked', async () => {
    const hook = await mountSync();

    await hook.act(() => hook.current().fullSync({ announce: true }));

    expect(lastToast()?.title).toBe('Progress synced');
    expect(hook.current().chip?.text).toMatch(/^synced /);
  });

  it('a refused session is an error with Retry; the chip goes offline', async () => {
    replies.set('select', { data: null, error: { message: 'JWT expired', code: 'PGRST301' } });
    const hook = await mountSync();

    await hook.act(() => hook.current().fullSync());

    expect(lastToast()).toMatchObject({ kind: 'error', title: 'Could not sync your progress' });
    expect(lastToast()?.description).toMatch(/refused this account/);
    expect(hook.current().chip?.text).toBe('offline');
  });

  it('offline is a state, not an error — unless the learner asked — and coming back retries', async () => {
    online.mockReturnValue(false);
    replies.set('select', { data: null, error: { message: 'Failed to fetch' } });
    const hook = await mountSync();
    const toastsAfterSignIn = toasts.length;

    await hook.act(() => hook.current().fullSync());
    expect(toasts).toHaveLength(toastsAfterSignIn);
    expect(hook.current().status).toMatch(/You're offline/);

    await hook.act(() => hook.current().fullSync({ announce: true }));
    expect(lastToast()?.title).toBe("You're offline");

    online.mockReturnValue(true);
    replies.delete('select');
    const before = selects;
    await hook.act(() => {
      window.dispatchEvent(new Event('online'));
    });
    await settle(30);
    expect(selects).toBeGreaterThan(before);
  });
});

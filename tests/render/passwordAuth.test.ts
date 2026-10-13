import { createElement, type ReactElement } from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePasswordAuth } from '@shared/account-sync/hooks/usePasswordAuth.tsx';
import { type CloudSyncState } from '@shared/account-sync/hooks/useCloudSync.tsx';
import { SyncContext } from '@shared/account-sync/hooks/useSync.tsx';
import { type SignUpOutcome } from '@shared/account-sync/lib/signUpOutcome.ts';

import { renderHook } from './harness.ts';

/*
 * The email/password form's state: what it lets through, what it says is wrong and about
 * which field, and what each sign-up outcome does to the form. Supabase is out of the
 * picture — the hook only ever talks to the sync context, faked here.
 */

const STRONG = 'Correct-Horse-9';

const fakeSync = (overrides: Partial<CloudSyncState> = {}): CloudSyncState => ({
  configured: true,
  user: null,
  status: '',
  lastSyncedAt: null,
  chip: null,
  syncing: false,
  providers: [],
  pendingProvider: null,
  busyWithEmail: false,
  signInWithProvider: vi.fn(() => Promise.resolve()),
  signInWithPassword: vi.fn(() => Promise.resolve(true)),
  signUpWithPassword: vi.fn(() => Promise.resolve<SignUpOutcome>({ kind: 'confirmation-sent' })),
  resendConfirmation: vi.fn(() => Promise.resolve(true)),
  sendPasswordReset: vi.fn(() => Promise.resolve()),
  fullSync: vi.fn(() => Promise.resolve()),
  clearRemote: vi.fn(() => Promise.resolve({ ok: true as const, value: undefined })),
  signOut: vi.fn(() => Promise.resolve()),
  ...overrides
});

const mountWith = async (sync: CloudSyncState) => {
  const wrap = (child: ReactElement): ReactElement =>
    createElement(SyncContext.Provider, { value: sync }, child);
  return renderHook(usePasswordAuth, wrap);
};

let unmount: (() => Promise<void>) | null = null;

afterEach(async () => {
  await unmount?.();
  unmount = null;
});

describe('usePasswordAuth — validation', () => {
  it('blames the email first, then (signing up) the password, then the confirmation', async () => {
    const hook = await mountWith(fakeSync());
    unmount = hook.unmount;

    expect(hook.current()).toMatchObject({ problem: null, problemField: null, canSubmit: false });

    await hook.act(() => hook.current().setEmail('not-an-email'));
    expect(hook.current()).toMatchObject({ problem: 'Enter a valid email address.', problemField: 'email' });

    await hook.act(() => hook.current().setEmail(' learner@example.test '));
    await hook.act(() => hook.current().setPassword('short'));
    /* Signing in: Supabase judges the password, the form does not. */
    expect(hook.current()).toMatchObject({ problem: null, canSubmit: true });

    await hook.act(() => hook.current().setMode('signup'));
    await hook.act(() => hook.current().setPassword('short'));
    expect(hook.current()).toMatchObject({ problem: 'Use at least 8 characters.', problemField: 'password' });

    await hook.act(() => hook.current().setPassword(STRONG));
    await hook.act(() => hook.current().setConfirmPassword('Correct-Horse-8'));
    expect(hook.current()).toMatchObject({
      problem: 'The two passwords do not match.',
      problemField: 'confirm'
    });
    expect(hook.current().canSubmit).toBe(false);

    await hook.act(() => hook.current().setConfirmPassword(STRONG));
    expect(hook.current()).toMatchObject({ problem: null, canSubmit: true });
  });

  it('cannot submit while an email request is already running', async () => {
    const sync = fakeSync({ busyWithEmail: true });
    const hook = await mountWith(sync);
    unmount = hook.unmount;

    await hook.act(() => hook.current().setEmail('learner@example.test'));
    await hook.act(() => hook.current().setPassword(STRONG));
    expect(hook.current()).toMatchObject({ canSubmit: false, busy: true });

    await hook.act(() => hook.current().submit());
    await hook.act(() => hook.current().resetPassword());
    await hook.act(() => hook.current().resendConfirmation());
    expect(sync.signInWithPassword).not.toHaveBeenCalled();
    expect(sync.sendPasswordReset).not.toHaveBeenCalled();
    expect(sync.resendConfirmation).not.toHaveBeenCalled();
  });

  it('toggles password visibility', async () => {
    const hook = await mountWith(fakeSync());
    unmount = hook.unmount;

    await hook.act(() => hook.current().toggleShowPassword());
    expect(hook.current().showPassword).toBe(true);
  });
});

describe('usePasswordAuth — submitting', () => {
  const ready = async (sync: CloudSyncState, mode: 'signin' | 'signup') => {
    const hook = await mountWith(sync);
    unmount = hook.unmount;
    await hook.act(() => hook.current().setMode(mode));
    await hook.act(() => hook.current().setEmail(' learner@example.test '));
    await hook.act(() => hook.current().setPassword(STRONG));
    await hook.act(() => hook.current().setConfirmPassword(STRONG));
    return hook;
  };

  it('signs in with the trimmed address on Enter and clears the password on success', async () => {
    const sync = fakeSync();
    const hook = await ready(sync, 'signin');
    const preventDefault = vi.fn();

    await hook.act(() =>
      hook
        .current()
        .onKeyDown({ key: 'Enter', preventDefault } as unknown as Parameters<
          ReturnType<typeof usePasswordAuth>['onKeyDown']
        >[0])
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(sync.signInWithPassword).toHaveBeenCalledWith('learner@example.test', STRONG);
    expect(hook.current().password).toBe('');
  });

  it('keeps the password when sign-in fails, so the learner can correct it', async () => {
    const sync = fakeSync({ signInWithPassword: vi.fn(() => Promise.resolve(false)) });
    const hook = await ready(sync, 'signin');

    await hook.act(() => hook.current().submit());

    expect(hook.current().password).toBe(STRONG);
  });

  it('a sent confirmation shows the notice, survives a tab switch, and resends to that address', async () => {
    const sync = fakeSync();
    const hook = await ready(sync, 'signup');

    await hook.act(() => hook.current().submit());
    expect(sync.signUpWithPassword).toHaveBeenCalledWith('learner@example.test', STRONG);
    expect(hook.current().signUpFeedback).toEqual({
      kind: 'awaiting-confirmation',
      email: 'learner@example.test'
    });
    expect(hook.current()).toMatchObject({ password: '', confirmPassword: '' });

    await hook.act(() => hook.current().setMode('signin'));
    expect(hook.current().signUpFeedback.kind).toBe('awaiting-confirmation');

    await hook.act(() => hook.current().setEmail('someone-else@example.test'));
    await hook.act(() => hook.current().resendConfirmation());
    expect(sync.resendConfirmation).toHaveBeenCalledWith('learner@example.test');
  });

  it('an existing account moves the form to sign-in, keeping the address, until the tab changes', async () => {
    const sync = fakeSync({
      signUpWithPassword: vi.fn(() => Promise.resolve<SignUpOutcome>({ kind: 'already-registered' }))
    });
    const hook = await ready(sync, 'signup');

    await hook.act(() => hook.current().submit());
    expect(hook.current()).toMatchObject({
      mode: 'signin',
      email: ' learner@example.test ',
      signUpFeedback: { kind: 'already-registered', email: 'learner@example.test' }
    });

    await hook.act(() => hook.current().setMode('signup'));
    expect(hook.current().signUpFeedback.kind).toBe('none');
  });

  it('a signed-in sign-up clears the form; a failed one leaves it as typed', async () => {
    const signedIn = fakeSync({
      signUpWithPassword: vi.fn(() => Promise.resolve<SignUpOutcome>({ kind: 'signed-in' }))
    });
    const hook = await ready(signedIn, 'signup');
    await hook.act(() => hook.current().submit());
    expect(hook.current()).toMatchObject({ password: '', signUpFeedback: { kind: 'none' } });
    await hook.unmount();

    const failed = fakeSync({
      signUpWithPassword: vi.fn(() => Promise.resolve<SignUpOutcome>({ kind: 'failed', message: 'nope' }))
    });
    const again = await ready(failed, 'signup');
    await again.act(() => again.current().submit());
    expect(again.current()).toMatchObject({ password: STRONG, confirmPassword: STRONG });
  });

  it('sends a reset link to the trimmed address, and resends to what is typed when nothing is pending', async () => {
    const sync = fakeSync();
    const hook = await ready(sync, 'signin');

    await hook.act(() => hook.current().resetPassword());
    await hook.act(() => hook.current().resendConfirmation());

    expect(sync.sendPasswordReset).toHaveBeenCalledWith('learner@example.test');
    expect(sync.resendConfirmation).toHaveBeenCalledWith('learner@example.test');
  });
});

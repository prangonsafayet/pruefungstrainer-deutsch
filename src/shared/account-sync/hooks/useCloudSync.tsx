import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { type User } from '@supabase/supabase-js';
import { toast } from 'sonner';

import { classifyAuthError } from '@shared/account-sync/lib/authError.ts';
import { mergeProgress } from '@shared/account-sync/lib/mergeProgress.ts';
import {
  enabledProviders,
  providerLabel,
  type OAuthProvider
} from '@shared/account-sync/lib/oauthProviders.ts';
import {
  interpretSignUp,
  isRateLimited,
  retryAfterSeconds,
  type SignUpOutcome
} from '@shared/account-sync/lib/signUpOutcome.ts';
import { isSyncConfigured, PROGRESS_TABLE, supabase } from '@shared/account-sync/lib/supabaseClient.ts';
import { classifySyncError } from '@shared/account-sync/lib/syncError.ts';
import { appError, err, ok, type AppErrorCode, type Result } from '@shared/lib/appError.ts';
import { logger } from '@shared/lib/logger.ts';
import { normalizeDatabase } from '@shared/progress-store/lib/progressDb.ts';
import { type ProgressDatabase } from '@shared/types/progress.ts';

/** Short status shown in the header. */
export interface SyncChip {
  readonly text: string;
  readonly title: string;
}

export interface CloudSyncState {
  readonly configured: boolean;
  readonly user: User | null;
  readonly status: string;
  readonly lastSyncedAt: Date | null;
  readonly chip: SyncChip | null;
  readonly syncing: boolean;
  readonly providers: readonly OAuthProvider[];
  readonly pendingProvider: OAuthProvider | null;
  readonly busyWithEmail: boolean;
  readonly signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  readonly signInWithPassword: (email: string, password: string) => Promise<boolean>;
  readonly signUpWithPassword: (email: string, password: string) => Promise<SignUpOutcome>;
  readonly resendConfirmation: (email: string) => Promise<boolean>;
  readonly sendPasswordReset: (email: string) => Promise<void>;
  readonly fullSync: (options?: { readonly announce?: boolean }) => Promise<void>;
  /**
   * Overwrites this account's cloud copy with `empty` and reads it back. `ok` only once the
   * stored row is that document; otherwise the error's message says why it could not be
   * cleared. Signed out (or sync not configured) there is no cloud copy, so it is `ok`.
   */
  readonly clearRemote: (empty: ProgressDatabase) => Promise<Result<void>>;
  readonly signOut: () => Promise<void>;
}

interface CloudSyncOptions {
  readonly dbRef: RefObject<ProgressDatabase>;
  readonly replaceLocal: (next: ProgressDatabase) => void;
  /** `_updatedAt` of the local document; a change here schedules a push. */
  readonly updatedAt: string | undefined;
}

const PUSH_DEBOUNCE_MS = 1500;

const NOT_CLEARED = 'The cloud copy could NOT be cleared';

/** Why a clear failed, in the words that tell the learner what to do next. */
const CLEAR_REASON: Partial<Record<AppErrorCode, string>> = {
  'sync-offline': "you're offline. Try again when you're back online.",
  'sync-denied': 'the database refused this account. Sign out and in again, then try again.',
  'sync-rate-limited': 'too many requests just now. Wait a minute, then try again.',
  'sync-failed': 'the database could not be reached. Try again in a moment.'
};

/** The stored row is the document just written: same stamp, no attempts. */
const isClearedCopy = (stored: unknown, empty: ProgressDatabase): boolean => {
  if (stored == null) return false;
  const copy = normalizeDatabase(stored);
  return copy._updatedAt === empty._updatedAt && copy.attempts.length === 0;
};

const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));

/** Drives cloud sync: session, pull/merge/push, and the OAuth handoff. */
export const useCloudSync = ({ dbRef, replaceLocal, updatedAt }: CloudSyncOptions): CloudSyncState => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [chip, setChip] = useState<SyncChip | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const [busyWithEmail, setBusyWithEmail] = useState(false);

  /** `_updatedAt` of the document last pushed; `null` until the first sync completes. */
  const pushedAtRef = useRef<string | null>(null);
  /** A callback is consumed once. StrictMode remounts the effect; the code is not reusable. */
  const callbackHandledRef = useRef(false);
  const pushTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** Syncs and pushes on the wire. A clear waits for them, so none lands after its read-back. */
  const inFlightRef = useRef(new Set<Promise<unknown>>());
  /** True while the cloud copy is being cleared: no sync or push may start. A ref, not state,
      because the clear is called from a closure taken before its confirm dialog opened. */
  const clearingRef = useRef(false);

  /** Records work that writes to the cloud row until it settles. */
  const track = useCallback(<T,>(work: Promise<T>): Promise<T> => {
    inFlightRef.current.add(work);
    /* Both arms forget it; `finally` would re-reject a failed push as an unhandled rejection. */
    const forget = (): void => {
      inFlightRef.current.delete(work);
    };
    void work.then(forget, forget);
    return work;
  }, []);

  /** Everything that only makes sense while signed in. */
  const clearSessionState = useCallback(() => {
    setChip(null);
    setLastSyncedAt(null);
    setStatus('');
    pushedAtRef.current = null;
  }, []);

  const push = useCallback(
    async (db: ProgressDatabase): Promise<void> => {
      if (!supabase || !user) return;
      const { error, status } = await supabase
        .from(PROGRESS_TABLE)
        .upsert({ user_id: user.id, data: db, updated_at: new Date().toISOString() });
      if (error) throw Object.assign(new Error(error.message), { code: error.code, status });

      pushedAtRef.current = db._updatedAt ?? null;
      const now = new Date();
      setLastSyncedAt(now);
      setChip({
        text: `synced ${now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`,
        title: 'Progress synced to your Supabase database'
      });
    },
    [user]
  );

  /* The failure toast's Retry outlives the render that made it, so it calls through a ref. */
  const fullSyncRef = useRef<(options?: { readonly announce?: boolean }) => Promise<void>>(() =>
    Promise.resolve()
  );

  const runFullSync = useCallback(
    async ({ announce = false }: { readonly announce?: boolean } = {}): Promise<void> => {
      if (!supabase || !user) return;
      setSyncing(true);
      setStatus('Syncing…');
      try {
        const { data, error, status } = await supabase
          .from(PROGRESS_TABLE)
          .select('data, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw Object.assign(new Error(error.message), { code: error.code, status });

        /* The stored row is JSON written by whichever build last synced, so it is coerced
           into a full document before it is merged rather than trusted field by field. */
        const remote = data?.data == null ? null : normalizeDatabase(data.data);
        const merged = mergeProgress(dbRef.current, remote);
        replaceLocal(merged);
        await push(merged);
        setStatus('');
        if (announce) {
          toast.success('Progress synced', {
            description: `${String(merged.attempts.length)} attempt(s) are up to date across your devices.`
          });
        }
      } catch (error) {
        const failure = classifySyncError(error, navigator.onLine);
        logger.warn('sync', 'Sync failed', failure);
        setStatus(failure.message);
        setChip({ text: 'offline', title: failure.message });
        /* Offline is a state, not an error: the header badge says it, and coming back online
           retries by itself. Everything else gets a toast with a way to try again. */
        if (failure.code !== 'sync-offline' || announce) {
          toast.error(failure.code === 'sync-offline' ? "You're offline" : 'Could not sync your progress', {
            id: 'sync-failed',
            description: failure.message,
            action: { label: 'Retry', onClick: () => void fullSyncRef.current({ announce: true }) }
          });
        }
      } finally {
        setSyncing(false);
      }
    },
    [user, dbRef, replaceLocal, push]
  );
  const fullSync = useCallback(
    (options?: { readonly announce?: boolean }): Promise<void> =>
      clearingRef.current ? Promise.resolve() : track(runFullSync(options)),
    [runFullSync, track]
  );
  useEffect(() => {
    fullSyncRef.current = fullSync;
  }, [fullSync]);

  /* Back online after a failed sync (the chip the header's offline badge reads): try again
     without being asked. */
  const failed = user !== null && chip?.text === 'offline';
  useEffect(() => {
    if (!failed) return undefined;
    const retry = (): void => {
      void fullSyncRef.current();
    };
    window.addEventListener('online', retry);
    return () => {
      window.removeEventListener('online', retry);
    };
  }, [failed]);

  /**
   * The one operation the union-only merge cannot express. The browser cannot delete the row:
   * `supabase-setup.sql` has no delete policy, so a `.delete()` removes 0 rows under RLS and
   * reports no error — it once told the learner the cloud copy was gone while every attempt
   * stayed in it. Instead the row is overwritten with the caller's fresh, stamped document
   * through the insert/update policies, then read back: only the stored copy proves it.
   *
   * Another signed-in device still holds its own copy and puts it back on its next sync or
   * push; the copy in Settings says so (`describeDelete`).
   */
  const clearRemote = useCallback(
    async (empty: ProgressDatabase): Promise<Result<void>> => {
      if (!supabase || !user) return ok(undefined);
      clearingRef.current = true;
      /* A push still waiting on its debounce would upload the old document over the cleared row. */
      clearTimeout(pushTimerRef.current);
      let wrote = false;
      try {
        /* A sync or push already on the wire lands first, so it cannot overwrite the row after
           the read-back below has passed. No new one starts while `clearingRef` is set. */
        await Promise.allSettled([...inFlightRef.current]);
        const write = await supabase
          .from(PROGRESS_TABLE)
          .upsert({ user_id: user.id, data: empty, updated_at: new Date().toISOString() });
        if (write.error) {
          throw Object.assign(new Error(write.error.message), {
            code: write.error.code,
            status: write.status
          });
        }
        wrote = true;
        const read = await supabase.from(PROGRESS_TABLE).select('data').eq('user_id', user.id).maybeSingle();
        if (read.error) {
          throw Object.assign(new Error(read.error.message), { code: read.error.code, status: read.status });
        }
        if (!isClearedCopy(read.data?.data, empty)) {
          const missing = read.data == null;
          logger.warn(
            'sync',
            missing ? 'No cloud row after clearing' : 'Cloud copy read back unchanged after clearing'
          );
          return err(
            appError('sync-failed', {
              message: missing
                ? `${NOT_CLEARED}: the database accepted the write but returned no copy, so it could not confirm the cloud copy was cleared.`
                : `${NOT_CLEARED}: the database accepted the write but still returns your old progress.`
            })
          );
        }
        /* The local document is about to become this very one; there is nothing left to push. */
        pushedAtRef.current = empty._updatedAt ?? null;
        return ok(undefined);
      } catch (error) {
        const failure = classifySyncError(error, navigator.onLine);
        logger.warn('sync', 'Could not clear the cloud copy', failure);
        const reason = CLEAR_REASON[failure.code] ?? CLEAR_REASON['sync-failed'];
        /* Written but not checked: the row may be empty while this browser still has everything,
           and the next sync merges it back up. Say so rather than "nothing happened". */
        return err({
          ...failure,
          message: wrote
            ? `The cloud copy was overwritten but could NOT be checked: ${reason ?? ''} Your progress here is untouched and is being put back in the cloud.`
            : `${NOT_CLEARED}: ${reason ?? ''}`
        });
      } finally {
        clearingRef.current = false;
      }
    },
    [user]
  );

  /*
   * Surface a failed sign-in instead of silently landing signed out. Two shapes arrive
   * here. The provider or GoTrue can bounce back with `error` / `error_description`, which
   * says plainly what went wrong. A PKCE callback instead carries an ordinary-looking
   * `?code=` whose *exchange* then fails — a verifier written on another origin, a code
   * already spent, an expired one. supabase-js runs that exchange itself
   * (`detectSessionInUrl`) and swallows the rejection, so this second shape used to drop
   * the user back on the sign-in card with nothing at all to read.
   */
  useEffect(() => {
    if (callbackHandledRef.current) return;
    callbackHandledRef.current = true;

    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    /* A spent code left in the address bar is re-tried on every refresh, and always fails. */
    const stripCallbackParams = (): void => {
      const url = new URL(window.location.href);
      for (const key of ['error', 'error_description', 'error_code', 'code']) url.searchParams.delete(key);
      url.hash = '';
      window.history.replaceState({}, '', url.toString());
    };

    const reported =
      query.get('error_description') ??
      query.get('error') ??
      hash.get('error_description') ??
      hash.get('error');
    if (reported) {
      /* Stripped first: anything below that throws would otherwise re-run on every reload. The
         value is already decoded by URLSearchParams, and anyone can put text in a link, so it
         is logged, never shown — the learner reads our own words for it. */
      stripCallbackParams();
      logger.warn('auth', 'The provider returned an error', reported);
      toast.error('Sign-in was not completed', { description: classifyAuthError(reported).message });
      return;
    }

    const code = query.get('code');
    if (code === null || !supabase) return;
    const client = supabase;

    /*
     * `getSession` resolves only once the client has finished its own URL exchange, so a
     * session still missing here means that exchange failed. Running it again is safe —
     * the first attempt consumed nothing — and it is the only way to read the reason. A
     * transient failure recovers the sign-in outright; a real one finally names itself.
     */
    void (async (): Promise<void> => {
      const { data } = await client.auth.getSession();
      if (data.session) return;

      const { error } = await client.auth.exchangeCodeForSession(code);
      stripCallbackParams();
      if (!error) return;

      logger.warn('auth', 'OAuth code exchange failed', error);
      toast.error('Sign-in could not be completed', {
        description: classifyAuthError(error, navigator.onLine).message
      });
    })().catch((error: unknown) => {
      logger.error('auth', 'OAuth callback crashed', error);
      toast.error('Sign-in could not be completed', { description: 'Try signing in again.' });
    });
  }, []);

  /*
   * Track the session. This is the standard external-subscription shape, but supabase-js
   * emits INITIAL_SESSION synchronously while subscribing, so the setState lands in the
   * effect body from the linter's point of view. There is nothing to restructure: the
   * alternative is deferring our own state behind a microtask for no benefit.
   */
  useEffect(() => {
    if (!supabase) return undefined;
    let alive = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (alive) setUser(data.session?.user ?? null);
      })
      .catch((error: unknown) => {
        logger.warn('auth', 'Could not read the session', error);
      });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;

      setUser(next);
      if (!next) clearSessionState();
    });

    return () => {
      alive = false;
      subscription.subscription.unsubscribe();
    };
  }, [clearSessionState]);

  const userId = user?.id;

  /* Pull, merge and push once per sign-in. Nothing is reset here: the signed-out state is
     cleared by `clearSessionState`, called from the auth listener and from signOut. */
  useEffect(() => {
    if (!userId) return undefined;
    /* Deferred by a tick so the sign-in render commits before the syncing flag flips —
       the effect's job is to trigger the sync, not to set state during it. */
    const handle = setTimeout(() => void fullSync(), 0);
    return () => {
      clearTimeout(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per signed-in user, not per fullSync identity
  }, [userId]);

  /* Debounced push whenever the local document changes after the first sync. */
  useEffect(() => {
    if (!supabase || !user || !updatedAt) return undefined;
    if (pushedAtRef.current === updatedAt) return undefined;

    clearTimeout(pushTimerRef.current);
    pushTimerRef.current = setTimeout(() => {
      /* Nothing has been pulled yet, so the sign-in sync failed (or has not finished).
         Pushing now would upsert this device's document over a remote nobody has merged
         with, so the retry is a full sync rather than a push. Gating the push alone on this
         meant one failed sync stalled every later change for the rest of the session. */
      if (clearingRef.current) return;
      if (pushedAtRef.current === null) {
        void fullSync();
        return;
      }
      track(push(dbRef.current)).catch((error: unknown) => {
        logger.warn('sync', 'Debounced push failed', classifySyncError(error, navigator.onLine));
        setChip({
          text: 'offline',
          title: 'Could not reach the database — data kept locally. It will sync next time.'
        });
      });
    }, PUSH_DEBOUNCE_MS);

    return () => {
      clearTimeout(pushTimerRef.current);
    };
  }, [updatedAt, user, push, fullSync, dbRef, track]);

  /**
   * Hands off to the provider's consent screen. On success the browser navigates away, so
   * nothing after the call runs. `redirectTo` is built from the page's own origin and can
   * never point elsewhere; Supabase's redirect allowlist is the second gate.
   */
  const signInWithProvider = useCallback(async (provider: OAuthProvider): Promise<void> => {
    if (!supabase) return;
    setPendingProvider(provider);
    setStatus(`Redirecting to ${providerLabel(provider)}…`);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + window.location.pathname,
          ...(provider === 'google' ? { queryParams: { prompt: 'select_account' } } : {})
        }
      });
      if (error) throw new Error(error.message);
    } catch (error) {
      logger.warn('auth', `OAuth sign-in with ${provider} did not start`, error);
      const notEnabled = /provider is not enabled|Unsupported provider/i.test(errorMessage(error));
      const message = classifyAuthError(error, navigator.onLine).message;
      setStatus(
        notEnabled
          ? `${providerLabel(provider)} is not enabled for this Supabase project yet.`
          : `Sign-in failed: ${message}`
      );
      toast.error(
        notEnabled ? `${providerLabel(provider)} sign-in is not enabled` : 'Could not start sign-in',
        {
          description: notEnabled
            ? 'Enable it in Supabase → Authentication → Providers, then try again.'
            : message
        }
      );
      setPendingProvider(null);
    }
  }, []);

  /**
   * Email + password sign-in. The password goes straight to Supabase Auth over TLS and is
   * never stored, logged or hashed here — Supabase holds only a server-side bcrypt hash.
   */
  const signInWithPassword = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!supabase) return false;
    setBusyWithEmail(true);
    setStatus('Signing in…');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      setStatus('');
      toast.success('Signed in', { description: 'Your progress is syncing now.' });
      return true;
    } catch (error) {
      logger.info('auth', 'Password sign-in failed', error);
      /* Supabase deliberately does not say which half was wrong; do not guess for it. */
      const friendly = classifyAuthError(error, navigator.onLine).message;
      setStatus(friendly);
      toast.error('Could not sign in', { description: friendly });
      return false;
    } finally {
      setBusyWithEmail(false);
    }
  }, []);

  /**
   * Creates an account. Three outcomes are possible and they are not distinguishable from
   * the presence of a session alone — see `interpretSignUp` for why.
   */
  const signUpWithPassword = useCallback(async (email: string, password: string): Promise<SignUpOutcome> => {
    if (!supabase) return { kind: 'failed', message: 'Cloud sync is not configured.' };
    setBusyWithEmail(true);
    setStatus('Creating your account…');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
      const outcome = interpretSignUp(data, error);

      switch (outcome.kind) {
        case 'signed-in':
          setStatus('');
          toast.success('Account created', {
            description: 'You are signed in and your progress is syncing.'
          });
          break;
        case 'confirmation-sent':
          setStatus('✓ Check your inbox (and spam) for the confirmation link, then sign in.');
          toast.success('Confirm your email', { description: `We sent a confirmation link to ${email}.` });
          break;
        case 'already-registered':
          setStatus('That email already has a confirmed account. Sign in instead, or reset the password.');
          toast.info('You already have an account', {
            description: 'Signing in is the way in — use "Forgot password?" if you need to.'
          });
          break;
        case 'failed':
          setStatus(outcome.message);
          toast.error('Could not create the account', { description: outcome.message });
          break;
      }

      return outcome;
    } catch (error) {
      logger.warn('auth', 'Sign-up failed', error);
      const message = classifyAuthError(error, navigator.onLine).message;
      setStatus(message);
      toast.error('Could not create the account', { description: message });
      return { kind: 'failed', message };
    } finally {
      setBusyWithEmail(false);
    }
  }, []);

  /**
   * Re-sends the sign-up confirmation.
   *
   * `signUp` is documented to resend for an unconfirmed account, but it is rate limited
   * and silently does nothing once the window is hit — which reads to the user as "the
   * email never arrived". `auth.resend` is the explicit API and surfaces the rate limit as
   * an error we can show.
   */
  const resendConfirmation = useCallback(async (email: string): Promise<boolean> => {
    if (!supabase) return false;
    setBusyWithEmail(true);
    setStatus('Re-sending the confirmation email…');
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
      if (error) throw new Error(error.message);
      setStatus('✓ Sent again — check your inbox and your spam folder.');
      toast.success('Confirmation email re-sent', { description: `Check the inbox for ${email}.` });
      return true;
    } catch (error) {
      logger.warn('auth', 'Could not re-send the confirmation', error);
      const message = errorMessage(error);
      if (isRateLimited(message)) {
        const wait = retryAfterSeconds(message);
        const friendly = wait
          ? `Too many requests — try again in ${String(wait)} seconds.`
          : 'Too many requests — wait a minute before trying again.';
        setStatus(friendly);
        toast.warning('Slow down a moment', { description: friendly });
      } else {
        const friendly = classifyAuthError(error, navigator.onLine).message;
        setStatus(friendly);
        toast.error('Could not re-send the email', { description: friendly });
      }
      return false;
    } finally {
      setBusyWithEmail(false);
    }
  }, []);

  /** Emails a reset link; the user sets a new password on Supabase's hosted page. */
  const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
    if (!supabase) return;
    setBusyWithEmail(true);
    setStatus('Sending reset link…');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (error) throw new Error(error.message);
      setStatus('✓ If that email has an account, a reset link is on its way.');
      toast.success('Password reset sent', { description: `Check the inbox for ${email}.` });
    } catch (error) {
      logger.warn('auth', 'Could not send the reset link', error);
      const message = classifyAuthError(error, navigator.onLine).message;
      setStatus(message);
      toast.error('Could not send the reset link', { description: message });
    } finally {
      setBusyWithEmail(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      toast.success('Signed out', { description: 'Your progress stays in this browser.' });
    } catch (error) {
      logger.warn('auth', 'Sign-out failed', error);
      toast.error('Could not sign out', { description: classifyAuthError(error, navigator.onLine).message });
    }
    setUser(null);
    clearSessionState();
  }, [clearSessionState]);

  return {
    configured: isSyncConfigured,
    user,
    status,
    lastSyncedAt,
    chip,
    syncing,
    providers: enabledProviders,
    pendingProvider,
    busyWithEmail,
    signInWithProvider,
    signInWithPassword,
    signUpWithPassword,
    resendConfirmation,
    sendPasswordReset,
    fullSync,
    clearRemote,
    signOut
  };
};

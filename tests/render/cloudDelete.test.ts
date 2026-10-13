import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PROGRESS_STORAGE_KEY } from '@shared/progress-store/lib/progressDb.ts';

import {
  bySelector,
  captureErrors,
  click,
  isoInDays,
  mount,
  seedProgress,
  settle,
  waitFor
} from './harness.ts';

/*
 * "Delete all progress" while signed in told the learner the cloud copy was gone when it was
 * not. It ran `.delete()`, but `supabase-setup.sql` has no delete policy, so row-level security
 * removed 0 rows and returned no error. When the sign-in sync had not completed, the next
 * debounced retry merged the untouched cloud copy straight back into the emptied browser.
 *
 * The fake table below behaves like the real one under RLS: a delete removes nothing and
 * succeeds, an upsert replaces the row, a select returns what is stored. Driven through the
 * Settings screen, because the toast the learner reads is half of the fix.
 */

const USER = {
  id: 'user-1',
  email: 'learner@example.test',
  app_metadata: { provider: 'email' },
  user_metadata: {}
};

interface Toast {
  readonly kind: string;
  readonly title: string;
  readonly description: string;
}

const toasts: Toast[] = [];
/** The cloud table, keyed by user id. Values are serialised, as Postgres would store them. */
const table = new Map<string, string>();
let selectFailures = 0;
let upsertError: { readonly message: string; readonly code: string } | null = null;
/** An upsert that reports success but stores nothing — what a read-back must catch. */
let upsertIgnored = false;
let deletes = 0;
/** Holds the next select's answer — taken when it was asked — until the test lets it go. */
let gateNextSelect: Promise<void> | null = null;

vi.mock('sonner', async importOriginal => {
  const actual = await importOriginal<typeof import('sonner')>();
  const record =
    (kind: string) =>
    (title: string, options?: { readonly description?: string }): number => {
      toasts.push({ kind, title, description: options?.description ?? '' });
      return toasts.length;
    };
  return {
    ...actual,
    toast: Object.assign(record('message'), {
      ...actual.toast,
      success: record('success'),
      error: record('error'),
      warning: record('warning'),
      info: record('info')
    })
  };
});

vi.mock('@shared/account-sync/lib/supabaseClient.ts', () => ({
  isSyncConfigured: true,
  PROGRESS_TABLE: 'progress',
  syncDiagnostics: {},
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: { user: USER } } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } })
    },
    from: () => ({
      select: () => ({
        eq: (_column: string, userId: string) => ({
          maybeSingle: () => {
            if (selectFailures > 0) {
              selectFailures -= 1;
              return Promise.resolve({ data: null, error: { message: 'gateway timeout' }, status: 504 });
            }
            const stored = table.get(userId);
            const answer = {
              data: stored === undefined ? null : { data: JSON.parse(stored) as unknown, updated_at: '' },
              error: null,
              status: 200
            };
            const gate = gateNextSelect;
            gateNextSelect = null;
            return gate ? gate.then(() => answer) : Promise.resolve(answer);
          }
        })
      }),
      upsert: (row: { readonly user_id: string; readonly data: unknown }) => {
        if (upsertError) return Promise.resolve({ error: upsertError, status: 403 });
        if (!upsertIgnored) table.set(row.user_id, JSON.stringify(row.data));
        return Promise.resolve({ error: null, status: 201 });
      },
      /* No delete policy: RLS filters every row out, and PostgREST reports success. */
      delete: () => ({
        eq: () => {
          deletes += 1;
          return Promise.resolve({ error: null, data: [], count: 0, status: 204 });
        }
      })
    })
  }
}));

interface StoredDoc {
  readonly attempts?: readonly unknown[];
  readonly _updatedAt?: string;
  readonly settings?: { readonly examDate?: string };
}

const cloudCopy = (): StoredDoc => JSON.parse(table.get(USER.id) ?? 'null') as StoredDoc;
const localCopy = (): StoredDoc =>
  JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}') as StoredDoc;

/** Longer than the hook's 1.5 s push debounce, so anything it scheduled has run. */
const AFTER_DEBOUNCE_MS = 1800;

const deleteEverything = async (): Promise<void> => {
  await click(bySelector('button').find(button => /Delete all progress/.test(button.textContent ?? '')));
  await click(
    bySelector('[role="alertdialog"] button').find(button =>
      /Delete all progress/.test(button.textContent ?? '')
    )
  );
  await waitFor(() => toasts.some(toast => toast.kind === 'success' || toast.kind === 'error'));
};

let errors: ReturnType<typeof captureErrors>;
/* Unmounted after each test even when it fails, or a live app keeps syncing into the next one. */
let view: Awaited<ReturnType<typeof mount>> | null = null;

beforeEach(() => {
  localStorage.clear();
  toasts.length = 0;
  table.clear();
  selectFailures = 0;
  upsertError = null;
  upsertIgnored = false;
  deletes = 0;
  gateNextSelect = null;
  errors = captureErrors();

  /* This browser has attempt 1; the cloud copy, from another session, has attempt 2 too. */
  seedProgress({ daysUntilExam: 30, attempts: [{ examId: 1 }, { examId: 2 }] });
  const remote = {
    ...JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}'),
    _updatedAt: '2026-01-01T00:00:00.000Z'
  };
  table.set(USER.id, JSON.stringify(remote));
  seedProgress({ daysUntilExam: 30, attempts: [{ examId: 1 }] });
});

afterEach(async () => {
  await view?.unmount();
  view = null;
  errors.restore();
});

describe('delete all progress while signed in', () => {
  it('clears the cloud copy, proves it by reading it back, and only then says so', async () => {
    view = await mount('/settings');
    /* Positive control: the sign-in sync ran, so this browser holds both attempts. */
    expect(await waitFor(() => localCopy().attempts?.length === 2)).toBe(true);
    expect(cloudCopy().attempts).toHaveLength(2);

    await deleteEverything();

    /* The claim and the table agree at the moment the toast is shown. */
    const success = toasts.find(toast => toast.kind === 'success');
    expect(success?.title).toBe('All progress deleted.');
    expect(cloudCopy().attempts).toEqual([]);
    expect(cloudCopy()._updatedAt).toBe(localCopy()._updatedAt);
    expect(success?.description).toMatch(/cloud copy is cleared too/i);
    expect(success?.description).toMatch(/other signed-in devices keep their own copy/i);
    expect(localCopy().attempts).toEqual([]);
    expect(deletes).toBe(0);

    await settle(AFTER_DEBOUNCE_MS);
    expect(localCopy().attempts).toEqual([]);
    expect(cloudCopy().attempts).toEqual([]);
    expect(errors.real()).toEqual([]);
  });

  it('does not let the next sync merge the old cloud copy back after a failed sign-in sync', async () => {
    /* The sign-in sync fails, so the next local change is retried as a full, merging sync. */
    selectFailures = 1;
    view = await mount('/settings');
    await settle(100);
    expect(localCopy().attempts).toHaveLength(1);

    await deleteEverything();
    await settle(AFTER_DEBOUNCE_MS);

    expect(localCopy().attempts).toEqual([]);
    expect(cloudCopy().attempts).toEqual([]);
  });

  it('deletes nothing and says why when the cloud copy cannot be written', async () => {
    view = await mount('/settings');
    expect(await waitFor(() => localCopy().attempts?.length === 2)).toBe(true);
    upsertError = { message: 'new row violates row-level security policy', code: '42501' };

    await deleteEverything();

    const failure = toasts.find(toast => toast.kind === 'error');
    expect(failure?.title).toBe('Nothing was deleted in this browser');
    expect(failure?.description).toMatch(
      /cloud copy could NOT be cleared: the database refused this account/
    );
    expect(toasts.some(toast => toast.kind === 'success')).toBe(false);
    expect(localCopy().attempts).toHaveLength(2);
    expect(cloudCopy().attempts).toHaveLength(2);
  });

  it('deletes nothing when the write is accepted but the read-back still holds the old copy', async () => {
    view = await mount('/settings');
    expect(await waitFor(() => localCopy().attempts?.length === 2)).toBe(true);
    upsertIgnored = true;

    await deleteEverything();

    const failure = toasts.find(toast => toast.kind === 'error');
    expect(failure?.description).toMatch(
      /could NOT be cleared: the database accepted the write but still returns/
    );
    expect(localCopy().attempts).toHaveLength(2);
  });

  it('waits for a sync that started after the dialog opened, so it cannot refill the cleared row', async () => {
    view = await mount('/settings');
    expect(await waitFor(() => localCopy().attempts?.length === 2)).toBe(true);

    await click(bySelector('button').find(button => /Delete all progress/.test(button.textContent ?? '')));
    /* While the dialog is open, "Sync now" starts a sync whose read of the old row is held. */
    let release = (): void => undefined;
    gateNextSelect = new Promise<void>(resolve => {
      release = resolve;
    });
    await click(bySelector('button').find(button => /^Sync now$/.test((button.textContent ?? '').trim())));
    await click(
      bySelector('[role="alertdialog"] button').find(button =>
        /Delete all progress/.test(button.textContent ?? '')
      )
    );
    /* The old row arrives only after the clear has been asked for. */
    release();
    await waitFor(() => toasts.some(toast => toast.title === 'All progress deleted.'));
    await settle(AFTER_DEBOUNCE_MS);

    expect(toasts.some(toast => toast.title === 'All progress deleted.')).toBe(true);
    expect(cloudCopy().attempts).toEqual([]);
    expect(localCopy().attempts).toEqual([]);
  });

  it('after a write that landed but could not be checked, puts this browser back in the cloud, settings included', async () => {
    view = await mount('/settings');
    expect(await waitFor(() => localCopy().attempts?.length === 2)).toBe(true);
    expect(localCopy().settings?.examDate).toBe(isoInDays(30));
    /* The upsert lands; the read-back that should confirm it fails. */
    selectFailures = 1;

    await deleteEverything();

    const failure = toasts.find(toast => toast.kind === 'error');
    expect(failure?.title).toBe('Nothing was deleted in this browser');
    expect(failure?.description).toMatch(/overwritten but could NOT be checked/);
    /* Without a newer local stamp the emptied row would win the next merge's settings. */
    await settle(AFTER_DEBOUNCE_MS);
    expect(cloudCopy().attempts).toHaveLength(2);

    await click(bySelector('button').find(button => /^Sync now$/.test((button.textContent ?? '').trim())));
    await settle(100);
    expect(localCopy().attempts).toHaveLength(2);
    expect(localCopy().settings?.examDate).toBe(isoInDays(30));
    expect(cloudCopy().settings?.examDate).toBe(isoInDays(30));
  });
});

import { describe, expect, it } from 'vitest';

import { claimStaleChunkReload, RELOAD_WINDOW_MS } from '@shared/lib/staleChunk.ts';

/** A sessionStorage stand-in that records every write. */
const fakeStorage = () => {
  const entries = new Map<string, string>();
  const storage = {
    writes: 0,
    getItem: (key: string): string | null => entries.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      storage.writes++;
      entries.set(key, value);
    }
  };
  return storage;
};

const T0 = 1_760_000_000_000;

describe('claimStaleChunkReload', () => {
  it('allows exactly one reload inside the window — the second failure shows the fallback', () => {
    const storage = fakeStorage();
    expect(claimStaleChunkReload(storage, T0, '/settings')).toBe(true);
    /* The reload happened; the chunk is still missing on the fresh page. */
    expect(claimStaleChunkReload(storage, T0 + 2_000, '/settings')).toBe(false);
    expect(claimStaleChunkReload(storage, T0 + RELOAD_WINDOW_MS - 1, '/learn')).toBe(false);
    expect(storage.writes).toBe(1);
  });

  it('allows another once the window has passed (a later deploy)', () => {
    const storage = fakeStorage();
    claimStaleChunkReload(storage, T0, '/');
    expect(claimStaleChunkReload(storage, T0 + RELOAD_WINDOW_MS, '/')).toBe(true);
  });

  it('never reloads during an exam sitting, and does not spend the guard there', () => {
    const storage = fakeStorage();
    expect(claimStaleChunkReload(storage, T0, '/b1/exam/3/full')).toBe(false);
    expect(storage.writes).toBe(0);
    /* Results and review are not sittings. */
    expect(claimStaleChunkReload(storage, T0, '/b1/results/7')).toBe(true);
  });

  it('refuses when the stored time lies in the future (a clock change) — never a loop', () => {
    const storage = fakeStorage();
    storage.setItem('telcTrainerChunkReloadAt', String(T0 + 60_000));
    expect(claimStaleChunkReload(storage, T0, '/')).toBe(false);
  });

  it('treats a garbled guard value as no previous reload', () => {
    const storage = fakeStorage();
    storage.setItem('telcTrainerChunkReloadAt', 'not a number');
    expect(claimStaleChunkReload(storage, T0, '/')).toBe(true);
  });
});

import { act, createElement } from 'react';

import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import RecorderControls from '@shared/components/exam-ui/RecorderControls/RecorderControls.tsx';
import { useAudioPlayback } from '@shared/hooks/useAudioPlayback.tsx';
import { clearLog, logger } from '@shared/lib/logger.ts';
import { useProgress } from '@shared/progress-store/hooks/useProgress.tsx';
import { PROGRESS_RECOVERY_KEY, PROGRESS_STORAGE_KEY } from '@shared/progress-store/lib/progressDb.ts';
import { ProgressProvider } from '@shared/progress-store/providers/ProgressProvider.tsx';

import { click, findByText, mount, settle } from './harness.ts';

const toast = vi.hoisted(() => ({ error: vi.fn(), warning: vi.fn(), success: vi.fn(), info: vi.fn() }));
vi.mock('sonner', async importOriginal => ({ ...(await importOriginal<typeof import('sonner')>()), toast }));

const download = vi.hoisted(() => vi.fn());
vi.mock('@shared/lib/download.ts', () => ({ downloadText: download }));

interface ToastOptions {
  readonly id?: string;
  readonly description?: string;
  readonly action?: { readonly label: string; readonly onClick: () => void };
}

/** The options of the last call to a toast mock. */
const lastOptions = (mock: ReturnType<typeof vi.fn>): ToastOptions =>
  (mock.mock.calls.at(-1)?.[1] ?? {}) as ToastOptions;

const render = async (element: ReturnType<typeof createElement>): Promise<HTMLElement> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    createRoot(container).render(element);
  });
  return container;
};

beforeEach(() => {
  for (const mock of [...Object.values(toast), download]) mock.mockReset();
  localStorage.clear();
  clearLog();
});

describe('damaged progress on boot', () => {
  it('starts fresh, keeps the app usable, sets the text aside and offers it for download', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, '{"attempts":[{"id":1,');
    const app = await mount('/');

    /* Usable: the dashboard rendered. */
    expect(app.container.querySelector('h1')).not.toBeNull();
    expect(localStorage.getItem(PROGRESS_RECOVERY_KEY)).toBe('{"attempts":[{"id":1,');
    expect(toast.warning).toHaveBeenCalledWith('Your saved progress could not be read', expect.anything());

    const { action } = lastOptions(toast.warning);
    expect(action?.label).toBe('Download the damaged data');
    action?.onClick();
    expect(download).toHaveBeenCalledWith(
      expect.stringMatching(/damaged/),
      '{"attempts":[{"id":1,',
      'text/plain'
    );
    await app.unmount();
  });

  it('says nothing when the stored document is fine', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ attempts: [] }));
    const app = await mount('/');
    expect(toast.warning).not.toHaveBeenCalled();
    await app.unmount();
  });
});

describe('damaged progress with no room to keep a copy', () => {
  it('writes nothing over the original until the learner discards it, and says so', async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, '{"attempts":');
    const realSetItem = localStorage.setItem.bind(localStorage);
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation((key: string, value: string) => {
      if (key === PROGRESS_RECOVERY_KEY)
        throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
      realSetItem(key, value);
    });

    let update: ReturnType<typeof useProgress>['update'] | undefined;
    const Probe = (): null => {
      ({ update } = useProgress());
      return null;
    };
    await render(createElement(ProgressProvider, null, createElement(Probe)));
    await act(async () => {
      update?.(db => ({ ...db, learnDone: { d2t0: true } }));
    });

    expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBe('{"attempts":');
    expect(toast.error).toHaveBeenCalledWith(
      'Your saved progress could not be read — download it now',
      expect.objectContaining({ duration: Infinity, dismissible: false })
    );
    const options = lastOptions(toast.error) as ToastOptions & {
      readonly cancel?: { readonly label: string; readonly onClick: () => void };
    };
    expect(options.description).toMatch(/no room to keep a copy/);
    expect(options.description).not.toMatch(/is kept in this browser/);
    expect(options.cancel?.label).toBe('Discard it and start fresh');

    options.cancel?.onClick();
    expect(JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? 'null')).toMatchObject({
      learnDone: { d2t0: true }
    });
    spy.mockRestore();
  });
});

describe('storage that stops accepting writes', () => {
  it('tells the learner once, and the action exports the live document', async () => {
    let update: ReturnType<typeof useProgress>['update'] | undefined;
    const Probe = (): null => {
      ({ update } = useProgress());
      return null;
    };
    await render(createElement(ProgressProvider, null, createElement(Probe)));

    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
    });
    await act(async () => {
      update?.(db => ({ ...db, learnDone: { d4t2: true } }));
    });
    spy.mockRestore();

    expect(toast.error).toHaveBeenCalledWith('Storage is full', expect.anything());
    const options = lastOptions(toast.error);
    expect(options.id).toBe('storage-failure');
    expect(options.description).toMatch(/Export a backup, then free some space/);
    options.action?.onClick();
    const exported = String(download.mock.calls.at(-1)?.[1] ?? '');
    expect(JSON.parse(exported)).toMatchObject({ learnDone: { d4t2: true } });
  });
});

describe('Settings → Copy diagnostics', () => {
  it('copies the build, the browser and the redacted log — nothing else', async () => {
    const writeText = vi.fn<Clipboard['writeText']>(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    logger.warn('auth', 'Sign-in failed for lena@example.de');

    const app = await mount('/settings');
    await click(findByText(/Copy diagnostics/));
    await settle();

    const report = String(writeText.mock.calls.at(0)?.[0] ?? '');
    expect(report).toMatch(/^telc trainer diagnostics\nBuild: v\d/);
    expect(report).toContain('Browser: ');
    expect(report).toMatch(/Sync: mode \w+, URL present (yes|no)/);
    expect(report).toContain('WARN [auth] Sign-in failed for [email]');
    expect(report).not.toContain('lena@example.de');
    expect(findByText(/Diagnostics copied/)).toBeDefined();
    await app.unmount();
  });
});

describe('listening audio with no speech synthesis', () => {
  /* Regression: a play was spent before speech was attempted, so with no German voice every
     click used up the budget and produced silence. happy-dom has no speechSynthesis. */
  it('does not spend a play, and explains what still works', async () => {
    expect('speechSynthesis' in window).toBe(false);
    const consume = vi.fn();
    let toggle: (() => void) | undefined;
    let playing: boolean | undefined;
    const Player = (): null => {
      ({ toggle, playing } = useAudioPlayback({
        script: 'Hallo',
        rate: 1,
        voiceName: '',
        itemKey: 'h1.0',
        playsLeft: 2,
        onConsumePlay: consume
      }));
      return null;
    };
    await render(createElement(Player));

    await act(async () => {
      toggle?.();
    });

    expect(consume).not.toHaveBeenCalled();
    expect(playing).toBe(false);
    expect(lastOptions(toast.error).description).toMatch(
      /plays are not used up.*transcript is in the review/
    );
  });
});

describe('the recorder', () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'mediaDevices');
    Reflect.deleteProperty(window, 'MediaRecorder');
  });

  it('explains how to allow a blocked microphone', async () => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: () =>
          Promise.reject(Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' }))
      },
      configurable: true
    });
    Object.defineProperty(window, 'MediaRecorder', { value: vi.fn(), configurable: true });

    const container = await render(
      createElement(RecorderControls, { part: 't1', recordingUrl: undefined, onRecorded: vi.fn() })
    );
    await click(findByText(/Record/));
    await settle();

    expect(toast.error).toHaveBeenCalledWith('Microphone access is blocked', expect.anything());
    expect(lastOptions(toast.error).description).toMatch(/lock icon in the address bar/);
    expect(container.textContent).toContain('Microphone not available');
  });

  it('says up front that the browser cannot record', async () => {
    const container = await render(
      createElement(RecorderControls, { part: 't1', recordingUrl: undefined, onRecorded: vi.fn() })
    );
    expect(container.textContent).toContain('This browser cannot record');
  });
});

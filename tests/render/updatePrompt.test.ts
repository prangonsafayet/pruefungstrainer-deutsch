import { act, createElement } from 'react';

import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type ExternalToast } from 'sonner';

import type { pwaStub as PwaStub } from '../support/pwaRegister.ts';

/*
 * The service worker's update flow: the store behind `useServiceWorkerUpdate`, and the
 * shell's toast that offers a waiting version — never during an exam sitting. The worker's
 * lifecycle is fired by hand through the `virtual:pwa-register` stub; the real thing runs in
 * e2e/offline.spec.js against a production build.
 */

const toastMock = vi.hoisted(() => Object.assign(vi.fn(), { dismiss: vi.fn() }));
vi.mock('sonner', async importOriginal => ({
  ...(await importOriginal<typeof import('sonner')>()),
  toast: toastMock
}));

type Store = typeof import('@shared/lib/serviceWorker.ts');
type Prompt = typeof import('@features/app-shell/components/AppLayout/useUpdatePrompt.tsx');

/* The store is module state: every test starts from a fresh copy — of the stub as well, so
   the suite reads the very instance the store registered with. */
let store: Store;
let prompt: Prompt;
let pwaStub: typeof PwaStub;

const reload = vi.fn();
let originalLocation: Location;

const at = (pathname: string): void => {
  Object.defineProperty(window, 'location', {
    value: { ...originalLocation, pathname, reload },
    configurable: true
  });
};

const registered = (): NonNullable<typeof pwaStub.options> => {
  store.registerServiceWorker();
  if (!pwaStub.options) throw new Error('registerSW was not called');
  return pwaStub.options;
};

const fakeRegistration = {} as ServiceWorkerRegistration;

beforeEach(async () => {
  vi.resetModules();
  store = await import('@shared/lib/serviceWorker.ts');
  prompt = await import('@features/app-shell/components/AppLayout/useUpdatePrompt.tsx');
  ({ pwaStub } = await import('../support/pwaRegister.ts'));
  reload.mockReset();
  toastMock.mockReset();
  toastMock.dismiss.mockReset();
  originalLocation = window.location;
  at('/learn');
  /* happy-dom has no service worker API; the store only checks that it exists. */
  Object.defineProperty(navigator, 'serviceWorker', { value: {}, configurable: true });
});

afterEach(() => {
  Object.defineProperty(window, 'location', { value: originalLocation, configurable: true });
});

describe('the service worker store', () => {
  it('goes off → registering → ready', () => {
    expect(store.getServiceWorkerStatus()).toBe('off');
    const options = registered();
    expect(store.getServiceWorkerStatus()).toBe('registering');
    options.onRegisteredSW?.('/sw.js', fakeRegistration);
    expect(store.getServiceWorkerStatus()).toBe('ready');
  });

  it('keeps a worker found already waiting when the registration resolves after it', () => {
    const options = registered();
    options.onNeedRefresh?.();
    options.onRegisteredSW?.('/sw.js', fakeRegistration);
    expect(store.getServiceWorkerStatus()).toBe('update-waiting');
  });

  it('reports a browser without the API, and a failed registration', () => {
    Reflect.deleteProperty(navigator, 'serviceWorker');
    store.registerServiceWorker();
    expect(store.getServiceWorkerStatus()).toBe('unsupported');
    expect(pwaStub.options).toBeUndefined();

    Object.defineProperty(navigator, 'serviceWorker', { value: {}, configurable: true });
    registered().onRegisterError?.(new Error('SecurityError'));
    expect(store.getServiceWorkerStatus()).toBe('failed');
  });

  it('update() asks the waiting worker to take over and does not reload by itself', async () => {
    registered().onNeedRefresh?.();
    await store.applyServiceWorkerUpdate();
    expect(pwaStub.skipWaitingCalls).toBe(1);
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads when the new worker takes control outside an exam sitting', () => {
    registered().onNeedReload?.();
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('never reloads mid-exam when another tab activated the update; Reload afterwards does', async () => {
    at('/dtz/exam/1/lesen');
    registered().onNeedReload?.();
    expect(reload).not.toHaveBeenCalled();
    expect(store.getServiceWorkerStatus()).toBe('update-waiting');

    /* The worker already controls the page, so a plain reload is the whole update. */
    at('/dtz/results/1');
    await store.applyServiceWorkerUpdate();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(pwaStub.skipWaitingCalls).toBe(0);
  });
});

describe('the update prompt', () => {
  let root: Root | undefined;

  const Probe = ({ examMode }: { readonly examMode: boolean }): null => {
    prompt.useUpdatePrompt(examMode);
    return null;
  };

  const render = async (examMode: boolean): Promise<void> => {
    if (!root) {
      const container = document.createElement('div');
      document.body.appendChild(container);
      root = createRoot(container);
    }
    const current = root;
    await act(async () => {
      current.render(createElement(Probe, { examMode }));
    });
  };

  const needRefresh = async (): Promise<void> => {
    const options = registered();
    await act(async () => {
      options.onNeedRefresh?.();
    });
  };

  /** The options of the last update toast shown. */
  const shown = (): ExternalToast | undefined => {
    const call = toastMock.mock.calls.at(-1) as [unknown, ExternalToast | undefined] | undefined;
    return call?.[1];
  };

  afterEach(async () => {
    const current = root;
    root = undefined;
    if (current)
      await act(async () => {
        current.unmount();
      });
  });

  it('shows nothing while no new version waits', async () => {
    store.registerServiceWorker();
    await render(false);
    expect(toastMock).not.toHaveBeenCalled();
  });

  it('offers a waiting version with a Reload action that applies it', async () => {
    await render(false);
    await needRefresh();
    expect(toastMock).toHaveBeenCalledWith('A new version is ready', expect.anything());
    expect(shown()?.id).toBe(prompt.UPDATE_TOAST_ID);

    const action = shown()?.action;
    if (!action || typeof action !== 'object' || !('onClick' in action)) throw new Error('no Reload action');
    expect(action.label).toBe('Reload');
    await act(async () => {
      action.onClick(new MouseEvent('click') as unknown as Parameters<typeof action.onClick>[0]);
    });
    expect(pwaStub.skipWaitingCalls).toBe(1);
  });

  it('holds the prompt back during an exam sitting and offers it once the sitting ends', async () => {
    await render(true);
    await needRefresh();
    expect(toastMock).not.toHaveBeenCalled();

    await render(false);
    expect(toastMock).toHaveBeenCalledTimes(1);
    expect(shown()?.id).toBe(prompt.UPDATE_TOAST_ID);
  });

  it('takes a shown prompt away when a sitting starts', async () => {
    await render(false);
    await needRefresh();
    expect(toastMock).toHaveBeenCalledTimes(1);
    toastMock.dismiss.mockClear();

    await render(true);
    expect(toastMock.dismiss).toHaveBeenCalledWith(prompt.UPDATE_TOAST_ID);
    expect(toastMock).toHaveBeenCalledTimes(1);
  });
});

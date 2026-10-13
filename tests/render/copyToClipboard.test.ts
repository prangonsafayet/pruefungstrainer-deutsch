import { act, createElement } from 'react';

import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CopyTextButton from '@features/curriculum/components/CopyTextButton/CopyTextButton.tsx';

import { settle } from './harness.ts';

const toastError = vi.hoisted(() => vi.fn());
vi.mock('sonner', async importOriginal => ({
  ...(await importOriginal<typeof import('sonner')>()),
  toast: { error: toastError }
}));

/* Regression: `writeText` had no rejection handler, so a denied clipboard (no focus, no
   permission, an insecure context) was an unhandled rejection and the button said nothing. */

const render = async (): Promise<HTMLElement> => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    createRoot(container).render(createElement(CopyTextButton, { text: 'Hallo' }));
  });
  const button = container.querySelector('button');
  if (!button) throw new Error('no button rendered');
  return button;
};

type WriteText = Clipboard['writeText'];

const stubClipboard = (writeText: WriteText): void => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
};

describe('CopyTextButton', () => {
  afterEach(() => {
    toastError.mockReset();
  });

  it('confirms a successful copy', async () => {
    const writeText = vi.fn((): Promise<void> => Promise.resolve());
    stubClipboard(writeText);
    const button = await render();

    await act(async () => {
      button.click();
    });
    await settle();

    expect(writeText).toHaveBeenCalledWith('Hallo');
    expect(button.textContent).toBe('Copied');
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows a failure state and a toast when the clipboard rejects', async () => {
    stubClipboard(() => Promise.reject(new DOMException('Document is not focused.', 'NotAllowedError')));
    const button = await render();

    await act(async () => {
      button.click();
    });
    await settle();

    expect(button.textContent).toBe('Copy failed');
    expect(toastError).toHaveBeenCalledTimes(1);
  });

  it('fails the same way when there is no clipboard at all', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    const button = await render();

    await act(async () => {
      button.click();
    });
    await settle();

    expect(button.textContent).toBe('Copy failed');
    expect(toastError).toHaveBeenCalledTimes(1);
  });
});

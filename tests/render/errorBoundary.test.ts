import { act, createElement } from 'react';

import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary.tsx';

import { click, findByText } from './harness.ts';

/* The boundary keeps one broken screen from taking the trainer down. It recovers two ways:
   "Try again", and a new `resetKey` — the route path, so navigating away clears the crash. */

let explode = true;
const Screen = (): string => {
  if (explode) throw new Error('kaputt');
  return 'screen ok';
};

const renderAt = (root: Root, resetKey: string): Promise<void> =>
  act(async () => {
    root.render(createElement(ErrorBoundary, { resetKey, children: createElement(Screen) }));
  });

describe('ErrorBoundary', () => {
  let container: HTMLElement;
  let root: Root;

  beforeEach(() => {
    explode = true;
    /* React and the boundary both log the caught error; keep the run quiet. */
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
  });

  it('shows the fallback with the message, and "Try again" re-renders the screen', async () => {
    await renderAt(root, '/a');
    expect(container.textContent).toContain('Something went wrong');
    expect(container.textContent).toContain('kaputt');

    explode = false;
    await click(findByText(/Try again/));
    expect(container.textContent).toBe('screen ok');
  });

  it('clears the crash when the reset key (the route) changes', async () => {
    await renderAt(root, '/a');
    expect(container.textContent).toContain('Something went wrong');

    explode = false;
    await renderAt(root, '/a');
    expect(container.textContent).toContain('Something went wrong');

    await renderAt(root, '/b');
    expect(container.textContent).toBe('screen ok');
  });
});

import { act, createElement } from 'react';

import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SplitTeil from '@shared/components/exam-ui/layout/SplitTeil/SplitTeil.tsx';

/*
 * The material pane is a tab stop so a keyboard user can scroll it — but it only scrolls by
 * itself side by side, from 1024px. Narrower it scrolls with the page, and the extra tab stop
 * was one more thing to tab through on every Teil.
 */

const renderAt = async (wide: boolean): Promise<HTMLElement> => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    query =>
      ({
        matches: wide,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined
      }) as unknown as MediaQueryList
  );
  const container = document.createElement('div');
  document.body.appendChild(container);
  await act(async () => {
    createRoot(container).render(
      createElement(SplitTeil, { material: 'Text', materialLabel: 'Text', children: 'Items' })
    );
  });
  return container;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SplitTeil', () => {
  it('makes the material pane a tab stop side by side', async () => {
    const region = (await renderAt(true)).querySelector('[role="region"]');
    expect(region?.getAttribute('tabindex')).toBe('0');
  });

  it('leaves it out of the tab order when stacked', async () => {
    const region = (await renderAt(false)).querySelector('[role="region"]');
    expect(region).not.toBeNull();
    expect(region?.hasAttribute('tabindex')).toBe(false);
  });
});

import { type ReactNode } from 'react';

import { useMediaQuery } from '@shared/hooks/useMediaQuery.tsx';

interface SplitTeilProps {
  /** The shared reading material: a text, an ad list, the headlines. */
  readonly material: ReactNode;
  /** Names the material pane for a screen reader, e.g. "Text" or "Anzeigen". */
  readonly materialLabel: string;
  /** The items that answer it. */
  readonly children: ReactNode;
}

/** Tailwind's `lg`, where the panes sit side by side. */
const SIDE_BY_SIDE = '(min-width: 1024px)';

/**
 * Material beside its questions from 1024px (tablet landscape, desktop): the material pane
 * sticks under the exam toolbar and scrolls on its own, the questions scroll with the page, so
 * neither drags the other. Narrower screens stack the material above its items.
 *
 * The material pane is a focusable region from 1024px, where it can scroll by itself and a
 * keyboard user must be able to scroll it too. Narrower, it scrolls with the page, so it is
 * not a tab stop.
 */
const SplitTeil = ({ material, materialLabel, children }: SplitTeilProps) => {
  const sideBySide = useMediaQuery(SIDE_BY_SIDE);
  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
      <div
        role="region"
        aria-label={materialLabel}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be reachable by keyboard to scroll (WCAG 2.1.1)
        tabIndex={sideBySide ? 0 : undefined}
        className="mb-5 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring lg:sticky lg:top-[calc(var(--header-h,4rem)+var(--exam-toolbar-h,5rem)+1rem)] lg:mb-0 lg:max-h-[calc(100dvh-var(--header-h,4rem)-var(--exam-toolbar-h,5rem)-2rem)] lg:overflow-y-auto lg:overscroll-contain"
      >
        {material}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default SplitTeil;

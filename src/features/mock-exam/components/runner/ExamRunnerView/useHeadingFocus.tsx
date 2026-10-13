import { useEffect, useRef } from 'react';

/**
 * Moves focus to the screen's `<h1>` whenever `step` changes — briefing → module → rating →
 * next briefing all happen on one URL, so the layout's route-change focus never fires, and the
 * button just pressed unmounts and would drop focus to the body. Never on first mount: the
 * route change already handled that.
 */
export const useHeadingFocus = (step: string): void => {
  const lastStep = useRef(step);

  useEffect(() => {
    if (lastStep.current === step) return;
    lastStep.current = step;
    const heading = document.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }, [step]);
};

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { useLocation } from 'react-router-dom';

import { useMediaQuery } from '@shared/hooks/useMediaQuery.tsx';

/** At this width the plan has room for a cheatsheet column beside it. */
export const WIDE_QUERY = '(min-width: 1024px)';
/** Below this, the sheet rises from the bottom (thumb reach); above it, it slides in from the side. */
export const TABLET_QUERY = '(min-width: 640px)';

/** The id of a day card's heading, which "Back to Day N" returns focus to. */
export const learnDayAnchor = (day: number): string => `learn-day-${String(day)}`;

export interface CheatsheetPanelState {
  /** Wide screens show the panel beside the plan; narrow ones open it as a modal sheet. */
  readonly wide: boolean;
  readonly sheetSide: 'bottom' | 'right';
  /** The sheet being read, or null for the list of all sheets. */
  readonly openId: string | null;
  /** The day it was opened from, for the way back. */
  readonly fromDay: number | null;
  /** Narrow screens only: whether the modal sheet is up. */
  readonly sheetOpen: boolean;
  readonly headingRef: RefObject<HTMLHeadingElement | null>;
  readonly open: (id: string, fromDay?: number) => void;
  readonly showList: () => void;
  readonly setSheetOpen: (open: boolean) => void;
  /** Leaves the sheet and puts the reader back on the day card they came from. */
  readonly backToDay: () => void;
  /** For the modal sheet: lands focus on that day once the sheet has closed. */
  readonly onSheetCloseAutoFocus: (event: Event) => void;
}

/**
 * Where the Learn page's cheatsheets are read: beside the plan on a wide screen, in a sheet
 * over it on a narrow one — opened in place from the day that names them, never by scrolling
 * the whole plan to a list at the bottom. A `#cs-<id>` URL still opens that sheet on arrival.
 */
export const useCheatsheetPanel = (): CheatsheetPanelState => {
  const { hash } = useLocation();
  const wide = useMediaQuery(WIDE_QUERY);
  const tablet = useMediaQuery(TABLET_QUERY);
  const linked = hash.startsWith('#cs-') ? hash.slice(4) : null;

  const [openId, setOpenId] = useState<string | null>(linked);
  const [fromDay, setFromDay] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(linked !== null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  /* Counts the reader's requests, so focus follows them into the side panel each time —
     also when they reopen the sheet already showing — and never on first render, when the
     skip link and the page heading own focus. */
  const [requests, setRequests] = useState(0);

  useEffect(() => {
    if (wide && requests > 0) headingRef.current?.focus({ preventScroll: true });
  }, [wide, requests]);

  const open = useCallback((id: string, day?: number) => {
    setOpenId(id);
    setFromDay(day ?? null);
    setSheetOpen(true);
    setRequests(count => count + 1);
  }, []);

  const showList = useCallback(() => {
    setOpenId(null);
    setSheetOpen(true);
    setRequests(count => count + 1);
  }, []);

  /* The day "Back to Day N" returns to once the modal sheet has finished closing. */
  const returnDay = useRef<number | null>(null);

  const focusDay = useCallback((day: number) => {
    const heading = document.getElementById(learnDayAnchor(day));
    heading?.scrollIntoView({ block: 'start' });
    heading?.focus({ preventScroll: true });
  }, []);

  const backToDay = useCallback(() => {
    if (fromDay === null) {
      setSheetOpen(false);
      return;
    }
    /* Beside the plan there is no modal to close, so focus moves now; in a sheet it moves
       once the sheet has closed and released the page (see onSheetCloseAutoFocus). */
    if (wide) {
      focusDay(fromDay);
      return;
    }
    returnDay.current = fromDay;
    setSheetOpen(false);
  }, [fromDay, wide, focusDay]);

  const onSheetCloseAutoFocus = useCallback(
    (event: Event) => {
      const day = returnDay.current;
      if (day === null) return;
      returnDay.current = null;
      event.preventDefault();
      focusDay(day);
    },
    [focusDay]
  );

  return {
    wide,
    sheetSide: tablet ? 'right' : 'bottom',
    openId,
    fromDay,
    sheetOpen,
    headingRef,
    open,
    showList,
    setSheetOpen,
    backToDay,
    onSheetCloseAutoFocus
  };
};

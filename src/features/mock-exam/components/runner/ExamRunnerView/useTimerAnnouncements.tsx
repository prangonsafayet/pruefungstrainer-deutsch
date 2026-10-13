import { useState } from 'react';

import { crossedThreshold, remainingMessage } from './timerAnnouncements.ts';

/**
 * The polite announcement for the open module's clock: empty until it passes 10, 5 or 1
 * minutes left, then that sentence until the next one. The first reading of a module only sets
 * the baseline, so starting (or reloading) with 9 minutes left does not announce "10".
 *
 * Derived during render from the previous reading — React's "adjust state when a prop changes"
 * pattern — so there is no effect and no timer of its own; the runner's heartbeat drives it.
 */
export const useTimerAnnouncements = (secondsRemaining: number, running: boolean): string => {
  const [previous, setPrevious] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  if (!running) {
    if (previous !== null) setPrevious(null);
    if (message !== '') setMessage('');
    return '';
  }
  if (previous !== secondsRemaining) {
    setPrevious(secondsRemaining);
    const threshold = previous === null ? null : crossedThreshold(previous, secondsRemaining);
    if (threshold !== null) setMessage(remainingMessage(threshold));
  }
  return message;
};

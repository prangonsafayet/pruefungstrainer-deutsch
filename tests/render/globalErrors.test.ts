import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { downloadText } from '@shared/lib/download.ts';
import { installGlobalErrorHandlers } from '@shared/lib/globalErrors.ts';
import { clearLog, getLogEntries } from '@shared/lib/logger.ts';

/* Installed once for the file: the listeners live on the shared window. */
installGlobalErrorHandlers();

const lastEntry = (): { level: string; scope: string; message: string } | undefined => getLogEntries().at(-1);

describe('global error handlers', () => {
  beforeEach(() => {
    clearLog();
    sessionStorage.clear();
  });

  it('logs an uncaught error', () => {
    window.dispatchEvent(new ErrorEvent('error', { message: 'Boom at a@b.de', error: new Error('boom') }));
    expect(lastEntry()).toMatchObject({ level: 'error', scope: 'window' });
    expect(lastEntry()?.message).toContain('[email]');
  });

  it('logs an unhandled rejection', () => {
    const event = Object.assign(new Event('unhandledrejection'), { reason: new Error('nobody caught me') });
    window.dispatchEvent(event);
    expect(lastEntry()).toMatchObject({ level: 'error', scope: 'promise' });
    expect(lastEntry()?.message).toContain('nobody caught me');
  });

  describe('vite:preloadError', () => {
    const reload = vi.fn();
    let original: Location;

    beforeEach(() => {
      original = window.location;
      reload.mockReset();
      Object.defineProperty(window, 'location', {
        value: { ...original, pathname: '/learn', reload },
        configurable: true
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', { value: original, configurable: true });
    });

    const preloadError = (): Event =>
      Object.assign(new Event('vite:preloadError', { cancelable: true }), {
        payload: new TypeError('Failed to fetch dynamically imported module: /assets/x.js')
      });

    it('reloads once and stops the throw; the second time it lets the error reach the boundary', () => {
      const first = preloadError();
      window.dispatchEvent(first);
      expect(reload).toHaveBeenCalledTimes(1);
      expect(first.defaultPrevented).toBe(true);

      const second = preloadError();
      window.dispatchEvent(second);
      expect(reload).toHaveBeenCalledTimes(1);
      expect(second.defaultPrevented).toBe(false);
    });

    it('does not reload when sessionStorage is unavailable — it cannot guard, so it never tries', () => {
      const spy = vi.spyOn(sessionStorage, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      window.dispatchEvent(preloadError());
      spy.mockRestore();
      expect(reload).not.toHaveBeenCalled();
    });
  });
});

describe('downloadText', () => {
  it('clicks a temporary link to a blob of the text, then releases it', () => {
    const create = vi.fn(() => 'blob:x');
    const revoke = vi.fn();
    Object.assign(URL, { createObjectURL: create, revokeObjectURL: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    downloadText('a.txt', 'hello', 'text/plain');

    /* `contexts` holds the `this` of each call: the anchor that was clicked. */
    expect(click.mock.contexts.map(anchor => (anchor as HTMLAnchorElement).download)).toEqual(['a.txt']);
    expect(revoke).toHaveBeenCalledWith('blob:x');
    click.mockRestore();
  });
});

import { useCallback, useState } from 'react';

import { syncDiagnostics } from '@shared/account-sync/lib/supabaseClient.ts';
import { APP_BUILD_LABEL } from '@shared/config/appInfo.ts';
import { useCopyToClipboard, type CopyStatus } from '@shared/hooks/useCopyToClipboard.tsx';
import { useServiceWorkerUpdate } from '@shared/hooks/useServiceWorkerUpdate.tsx';
import { getLogEntries } from '@shared/lib/logger.ts';

import { formatDiagnostics, SERVICE_WORKER_LABEL } from './diagnostics.ts';

interface Diagnostics {
  readonly status: CopyStatus;
  readonly copyDiagnostics: () => void;
  /** The running build, e.g. "v2.1.0 · a1b2c3d". */
  readonly build: string;
  /** The service worker's state in words. */
  readonly offlineMode: string;
  /** The last report, shown for copying by hand once the clipboard refused it; else null. */
  readonly manualReport: string | null;
}

/** Builds the report at the moment of copying, so it holds the latest log entries. */
export const useDiagnostics = (): Diagnostics => {
  const { status, copy } = useCopyToClipboard();
  const { status: serviceWorker } = useServiceWorkerUpdate();
  const [report, setReport] = useState('');

  const copyDiagnostics = useCallback(() => {
    const next = formatDiagnostics({
      build: APP_BUILD_LABEL,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      now: new Date().toISOString(),
      sync: syncDiagnostics,
      serviceWorker,
      entries: getLogEntries()
    });
    setReport(next);
    copy(next);
  }, [copy, serviceWorker]);

  return {
    status,
    copyDiagnostics,
    build: APP_BUILD_LABEL,
    offlineMode: SERVICE_WORKER_LABEL[serviceWorker],
    manualReport: status === 'failed' ? report : null
  };
};

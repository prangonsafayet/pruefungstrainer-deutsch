import { useCallback } from 'react';

import { syncDiagnostics } from '@shared/account-sync/lib/supabaseClient.ts';
import { APP_BUILD_LABEL } from '@shared/config/appInfo.ts';
import { useCopyToClipboard, type CopyStatus } from '@shared/hooks/useCopyToClipboard.tsx';
import { getLogEntries } from '@shared/lib/logger.ts';

import { formatDiagnostics } from './diagnostics.ts';

/** Builds the report at the moment of copying, so it holds the latest log entries. */
export const useDiagnostics = (): { readonly status: CopyStatus; readonly copyDiagnostics: () => void } => {
  const { status, copy } = useCopyToClipboard();

  const copyDiagnostics = useCallback(() => {
    copy(
      formatDiagnostics({
        build: APP_BUILD_LABEL,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        now: new Date().toISOString(),
        sync: syncDiagnostics,
        entries: getLogEntries()
      })
    );
  }, [copy]);

  return { status, copyDiagnostics };
};

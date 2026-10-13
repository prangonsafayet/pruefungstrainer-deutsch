import { type SyncDiagnostics } from '@shared/account-sync/lib/supabaseClient.ts';
import { type LogEntry } from '@shared/lib/logger.ts';
import { type ServiceWorkerStatus } from '@shared/lib/serviceWorker.ts';

export interface DiagnosticsInput {
  readonly build: string;
  readonly userAgent: string;
  readonly online: boolean;
  readonly now: string;
  readonly sync: SyncDiagnostics;
  readonly serviceWorker: ServiceWorkerStatus;
  readonly entries: readonly LogEntry[];
}

/** The service worker's state in words, for the card and the report. */
export const SERVICE_WORKER_LABEL: Readonly<Record<ServiceWorkerStatus, string>> = {
  off: 'off in this build',
  unsupported: 'not supported by this browser',
  registering: 'setting up',
  ready: 'ready — works without a connection',
  'update-waiting': 'a new version is waiting — reload to use it',
  failed: 'could not start'
};

/** How many log lines go into a report: enough to see a sequence, short enough to paste. */
export const DIAGNOSTIC_ENTRIES = 50;

/**
 * The text a learner pastes into a bug report. Only what helps find a bug: the build, the
 * browser, the sync configuration as yes/no flags (never the key itself) and the last log
 * entries, which the logger has already redacted. No progress, no answers, no account.
 */
export const formatDiagnostics = ({
  build,
  userAgent,
  online,
  now,
  sync,
  serviceWorker,
  entries
}: DiagnosticsInput): string => {
  const flag = (value: boolean): string => (value ? 'yes' : 'no');
  const log = entries.slice(-DIAGNOSTIC_ENTRIES);
  return [
    'Prüfungstrainer diagnostics',
    `Build: ${build}`,
    `Captured: ${now}`,
    `Browser: ${userAgent}`,
    `Online: ${flag(online)}`,
    `Offline mode: ${SERVICE_WORKER_LABEL[serviceWorker]}`,
    `Sync: mode ${sync.mode}, URL present ${flag(sync.urlPresent)}, URL valid ${flag(sync.urlValid)}, key present ${flag(sync.keyPresent)}, key looks valid ${flag(sync.keyLooksValid)}, secret key ${flag(sync.keyIsSecret)}`,
    `Log (last ${String(log.length)}):`,
    ...(log.length === 0
      ? ['  (empty)']
      : log.map(entry => `  ${entry.at} ${entry.level.toUpperCase()} [${entry.scope}] ${entry.message}`))
  ].join('\n');
};

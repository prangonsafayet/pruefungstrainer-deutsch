import { useSyncExternalStore } from 'react';

import {
  applyServiceWorkerUpdate,
  getServiceWorkerStatus,
  subscribeServiceWorker,
  type ServiceWorkerStatus
} from '@shared/lib/serviceWorker.ts';

export interface ServiceWorkerUpdate {
  readonly status: ServiceWorkerStatus;
  /** A newer build is installed and waits for the learner's Reload. */
  readonly needRefresh: boolean;
  /** Activates the waiting build and reloads into it. Never rejects. */
  readonly update: () => Promise<void>;
}

/** The service worker's state, for the shell's update prompt and the diagnostics card. */
export const useServiceWorkerUpdate = (): ServiceWorkerUpdate => {
  const status = useSyncExternalStore(subscribeServiceWorker, getServiceWorkerStatus, getServiceWorkerStatus);
  return { status, needRefresh: status === 'update-waiting', update: applyServiceWorkerUpdate };
};

import { useSync } from '@features/account-sync/hooks/useSync.ts';

import SyncActiveCard from './SyncActiveCard.tsx';
import SyncNotConfiguredCard from './SyncNotConfiguredCard.tsx';
import SyncSignInCard from './SyncSignInCard.tsx';

/** Picks the right sync card for the build's configuration and the session state. */
const SyncPanel = () => {
  const sync = useSync();
  if (!sync.configured) return <SyncNotConfiguredCard />;
  if (!sync.user) return <SyncSignInCard />;
  return <SyncActiveCard />;
};

export default SyncPanel;

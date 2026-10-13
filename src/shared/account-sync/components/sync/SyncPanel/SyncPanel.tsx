import SyncActiveCard from '@shared/account-sync/components/sync/SyncActiveCard/SyncActiveCard.tsx';
import SyncNotConfiguredCard from '@shared/account-sync/components/sync/SyncNotConfiguredCard/SyncNotConfiguredCard.tsx';
import SyncSignInCard from '@shared/account-sync/components/sync/SyncSignInCard/SyncSignInCard.tsx';
import { useSync } from '@shared/account-sync/hooks/useSync.tsx';

/** Picks the right sync card for the build's configuration and the session state. */
const SyncPanel = () => {
  const sync = useSync();
  if (!sync.configured) return <SyncNotConfiguredCard />;
  if (!sync.user) return <SyncSignInCard />;
  return <SyncActiveCard />;
};

export default SyncPanel;

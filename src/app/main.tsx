import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { installGlobalErrorHandlers } from '@shared/lib/globalErrors.ts';
import { registerServiceWorker } from '@shared/lib/serviceWorker.ts';

import { AppProviders } from './providers/AppProviders.tsx';
import { AppRouter } from './router.tsx';
import '../styles/index.css';

/* Anything that escapes a component lands in the local diagnostics log, not nowhere. */
installGlobalErrorHandlers();

/* Offline support. Production only: a dev server's modules change on every save, and a
   worker caching them would serve stale code. */
if (import.meta.env.PROD) registerServiceWorker();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>
);

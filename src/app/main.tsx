import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { installGlobalErrorHandlers } from '@shared/lib/globalErrors.ts';

import { AppProviders } from './providers/AppProviders.tsx';
import { AppRouter } from './router.tsx';
import '../styles/index.css';

/* Anything that escapes a component lands in the local diagnostics log, not nowhere. */
installGlobalErrorHandlers();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>
);

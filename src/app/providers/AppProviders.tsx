import { type ReactNode } from 'react';

import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary.tsx';
import { ProgressProvider } from '@shared/progress-store/providers/ProgressProvider.tsx';
import { ConfirmProvider } from '@shared/providers/ConfirmProvider.tsx';
import { Toaster } from '@shared/ui/sonner.tsx';

/**
 * Composition root. Order matters: the error boundary is outermost so a crash anywhere
 * still renders, and progress sits above the router so navigation never remounts it.
 */
export const AppProviders = ({ children }: { readonly children: ReactNode }) => (
  <ErrorBoundary>
    <ProgressProvider>
      <ConfirmProvider>
        <BrowserRouter>
          {children}
          <Toaster />
        </BrowserRouter>
      </ConfirmProvider>
    </ProgressProvider>
  </ErrorBoundary>
);

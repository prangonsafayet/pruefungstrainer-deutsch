import { type ReactNode } from 'react';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '@shared/components/ErrorFallback/ErrorFallback.tsx';
import { reportRenderError } from '@shared/lib/globalErrors.ts';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  /** Changing this clears a caught error — pass the route path so navigating away recovers. */
  readonly resetKey?: string;
  /** The trainer's dashboard, for a boundary inside the router; omitted at the app root. */
  readonly homeHref?: string;
}

/**
 * Catches render and lifecycle crashes so one broken screen never takes the whole trainer
 * down — and, crucially, never blocks access to saved progress. One sits around every route
 * (in the layout, reset by the path) and one at the app root as the last resort.
 */
const ErrorBoundary = ({ children, resetKey, homeHref }: ErrorBoundaryProps) => (
  <ReactErrorBoundary
    resetKeys={[resetKey]}
    onError={reportRenderError}
    fallbackRender={({ error, resetErrorBoundary }) => (
      <ErrorFallback
        error={error}
        onRetry={resetErrorBoundary}
        {...(homeHref === undefined ? {} : { homeHref })}
      />
    )}
  >
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;

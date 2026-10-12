import { type ReactNode } from 'react';

import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card.tsx';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  /** Changing this clears a caught error — pass the route path so navigating away recovers. */
  readonly resetKey?: string;
}

/**
 * Catches render and lifecycle crashes so one broken screen never takes the whole trainer
 * down — and, crucially, never blocks access to saved progress.
 */
const ErrorBoundary = ({ children, resetKey }: ErrorBoundaryProps) => (
  <ReactErrorBoundary
    resetKeys={[resetKey]}
    onError={(error, info) => {
      console.error('Trainer crashed:', error, info.componentStack);
    }}
    fallbackRender={({ error, resetErrorBoundary }) => (
      <Card className="mx-auto my-10 max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" /> Something went wrong
          </CardTitle>
          <CardDescription>
            This screen failed to render. Your saved progress is untouched — it lives in this browser&apos;s
            storage and in your cloud sync, not on this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button onClick={resetErrorBoundary}>
              <RotateCcw /> Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              <Home /> Back to the dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )}
  >
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;

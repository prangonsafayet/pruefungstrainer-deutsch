import { AlertTriangle, Home, RefreshCw, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { isChunkLoadError } from '@shared/lib/appError.ts';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card.tsx';

interface ErrorFallbackProps {
  readonly error: unknown;
  readonly onRetry: () => void;
  /** Inside the router: a soft link to the trainer's dashboard. Outside it: a full load of `/`. */
  readonly homeHref?: string;
}

/**
 * What a crashed screen shows: plain words and the next actions — never the raw message or a
 * stack (those go to the local log, reachable through Settings → Copy diagnostics). A chunk
 * that failed to load cannot be retried in place (the failed import is cached), so it offers
 * Reload instead of Try again.
 */
const ErrorFallback = ({ error, onRetry, homeHref }: ErrorFallbackProps) => {
  const staleChunk = isChunkLoadError(error);

  return (
    <Card role="alert" className="mx-auto my-10 max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-destructive" aria-hidden />
          {staleChunk ? 'This screen needs a fresh copy of the app' : 'Something went wrong'}
        </CardTitle>
        <CardDescription>
          {staleChunk
            ? 'Part of the trainer could not load — usually because a new version was published. Reload to get it. Your progress, and any exam in progress, are saved.'
            : "This screen failed to show. Your saved progress is untouched — it lives in this browser's storage and in your cloud sync, not on this page."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {staleChunk ? (
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              <RefreshCw /> Reload
            </Button>
          ) : (
            <Button onClick={onRetry}>
              <RotateCcw /> Try again
            </Button>
          )}
          <Button variant="outline" asChild>
            {homeHref === undefined ? (
              <a href="/">
                <Home /> Go to dashboard
              </a>
            ) : (
              <Link to={homeHref}>
                <Home /> Go to dashboard
              </Link>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          If this keeps happening, use Settings → Copy diagnostics and paste the result into a bug report.
        </p>
      </CardContent>
    </Card>
  );
};

export default ErrorFallback;

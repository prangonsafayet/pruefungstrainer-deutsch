import { Check, ClipboardCopy } from 'lucide-react';

import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';

import { useDiagnostics } from './useDiagnostics.tsx';

/** One button that copies a bug-report-ready summary. Nothing is sent anywhere. */
const DiagnosticsCard = () => {
  const { status, copyDiagnostics, build, offlineMode } = useDiagnostics();

  return (
    <Card>
      <CardContent className="space-y-3">
        <p className="text-sm">
          <span className="font-semibold">Version</span> {build}
          <span aria-hidden> · </span>
          <span className="font-semibold">Offline mode:</span> {offlineMode}
        </p>
        <Button variant="outline" onClick={copyDiagnostics}>
          {status === 'copied' ? <Check /> : <ClipboardCopy />}
          {status === 'copied' ? 'Diagnostics copied' : 'Copy diagnostics'}
        </Button>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Copies the app version, your browser, whether sync and offline mode are set up, and the last
          problems this tab logged — paste it into a bug report. It holds no progress, answers, email or
          password, and nothing leaves this device unless you paste it somewhere.
        </p>
      </CardContent>
    </Card>
  );
};

export default DiagnosticsCard;

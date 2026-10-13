import { Check, Copy, X } from 'lucide-react';

import { useCopyToClipboard } from '@shared/hooks/useCopyToClipboard.tsx';
import { Button } from '@shared/ui/button.tsx';

interface CopyTextButtonProps {
  readonly text: string;
  readonly label?: string;
}

/** Copies text to the clipboard with a short "copied" (or "copy failed") confirmation. */
const CopyTextButton = ({ text, label = 'Copy prompt' }: CopyTextButtonProps) => {
  const { status, copy } = useCopyToClipboard();
  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-2"
      onClick={() => {
        copy(text);
      }}
    >
      {status === 'copied' ? <Check /> : status === 'failed' ? <X /> : <Copy />}
      {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : label}
    </Button>
  );
};

export default CopyTextButton;

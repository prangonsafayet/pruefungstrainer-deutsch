import { type ReactNode } from 'react';

import { ArrowLeft, ChevronRight, CornerUpLeft } from 'lucide-react';

import { type Cheatsheet } from '@shared/types/learn.ts';
import { Button } from '@shared/ui/button.tsx';
import { Pressable } from '@shared/ui/pressable.tsx';

interface CheatsheetPanelProps {
  readonly cheatsheets: Readonly<Record<string, Cheatsheet>>;
  readonly openId: string | null;
  readonly fromDay: number | null;
  /** The panel's heading: a plain `<h2>` beside the plan, the dialog's title in a sheet. */
  readonly heading: (text: string) => ReactNode;
  readonly onOpen: (id: string) => void;
  readonly onShowList: () => void;
  readonly onBackToDay: () => void;
}

/** The cheatsheets of a trainer: the list of them, or one of them with the ways back. */
const CheatsheetPanel = ({
  cheatsheets,
  openId,
  fromDay,
  heading,
  onOpen,
  onShowList,
  onBackToDay
}: CheatsheetPanelProps) => {
  const sheet = openId === null ? undefined : cheatsheets[openId];

  if (!sheet) {
    return (
      <div className="flex min-h-0 flex-col gap-3">
        {heading('Cheatsheets')}
        <p className="text-sm text-muted-foreground">
          Open one beside your plan; study it, then come back before every mock exam.
        </p>
        <ul className="space-y-1.5">
          {Object.entries(cheatsheets).map(([id, entry]) => (
            <li key={id}>
              <Pressable
                onClick={() => {
                  onOpen(id);
                }}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl bg-muted px-3 py-2 font-heading text-sm font-bold transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{entry.title}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Pressable>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {heading(sheet.title)}
      <div className="flex flex-wrap gap-2">
        {fromDay === null ? null : (
          <Button size="sm" onClick={onBackToDay}>
            <CornerUpLeft /> Back to Day {fromDay}
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={onShowList}>
          <ArrowLeft /> All cheatsheets
        </Button>
      </div>
      {/* Repo-authored HTML, injected like the guide (see contentInjection.test.ts). */}
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sheet.html }} />
    </div>
  );
};

export default CheatsheetPanel;

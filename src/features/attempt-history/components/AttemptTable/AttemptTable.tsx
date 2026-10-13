import { ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@shared/lib/cn.ts';
import { Badge } from '@shared/ui/badge.tsx';
import { Button } from '@shared/ui/button.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table.tsx';
import { VisuallyHidden } from '@shared/ui/visually-hidden.tsx';

import { type AttemptRow, type AttemptTableModel } from '@features/attempt-history/types/attemptTable.ts';

interface AttemptTableProps {
  readonly model: AttemptTableModel;
}

const AttemptTable = ({ model }: AttemptTableProps) => {
  if (model.rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nothing here yet — take a Modelltest and it will show up.
      </p>
    );
  }

  const cellContent = (cell: AttemptRow['cells'][number]) =>
    cell.badge ? <Badge variant={cell.badge}>{cell.text}</Badge> : cell.text;

  return (
    <>
      {/* Phones: one card per attempt. Every paper's first three columns are Date, Test and
          Mode, which make the card's heading; the scores follow as a list of named values. */}
      <ul className="space-y-3 sm:hidden">
        {model.rows.map(row => {
          const [date, test, mode, ...rest] = row.cells;
          const restColumns = model.columns.slice(3);
          return (
            <li key={row.id} className="rounded-xl bg-muted/60 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-heading font-bold">
                  {test?.text} · {mode?.text}
                </span>
                <span className="text-sm text-muted-foreground">{date?.text}</span>
              </div>
              <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {rest.map((cell, index) => (
                  <div key={index} className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">{restColumns[index]}</dt>
                    <dd className={cn(cell.numeric && 'tabular-nums', cell.strong && 'font-semibold')}>
                      {cellContent(cell)}
                    </dd>
                  </div>
                ))}
              </dl>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to={row.reviewTo}>
                  <ListChecks /> Review {test?.text}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>

      <Table className="max-sm:hidden">
        <TableHeader>
          <TableRow>
            {model.columns.map((column, index) => (
              <TableHead key={index}>{column}</TableHead>
            ))}
            {/* The action column, header and cell appended in the same place so the two counts
              cannot disagree. Named for a screen reader, unlabelled on screen — a visible
              "Review" over a column of Review buttons says it twice. */}
            <TableHead>
              <VisuallyHidden>Review</VisuallyHidden>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {model.rows.map(row => (
            <TableRow key={row.id}>
              {row.cells.map((cell, index) => (
                <TableCell
                  key={index}
                  className={cn(cell.numeric && 'tabular-nums', cell.strong && 'font-semibold')}
                >
                  {cellContent(cell)}
                </TableCell>
              ))}
              <TableCell>
                <Button asChild variant="ghost" size="sm">
                  {/* Every row's link would otherwise be named just "Review". */}
                  <Link to={row.reviewTo}>
                    <ListChecks /> Review
                    <VisuallyHidden>
                      {' '}
                      {row.cells[1]?.text}, {row.cells[0]?.text}
                    </VisuallyHidden>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AttemptTable;

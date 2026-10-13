import { ChevronDown } from 'lucide-react';

import { fmtDate } from '@shared/lib/format.ts';
import { CHART_HEIGHT, describeGridlines, summarizeScoreChart } from '@shared/lib/scoreChart.ts';
import { type ScoreChartModel } from '@shared/types/scoreChart.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@shared/ui/table.tsx';

interface ScoreHistoryChartProps {
  readonly model: ScoreChartModel;
}

/**
 * Total points per full exam, most recent attempts last. One chart for either paper.
 * Hand-rolled on purpose (a chart library cost more bundle than these bars): the drawing is
 * one `role="img"` with a sentence for a name, and every number is in the table under it.
 */
const ScoreHistoryChart = ({ model }: ScoreHistoryChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Score history</CardTitle>
      <CardDescription>{model.description}</CardDescription>
    </CardHeader>
    <CardContent>
      {model.bars.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No full exams yet — your score history will appear here.
        </p>
      ) : (
        <>
          {/* pt-3: the top gridline's label sits above the plot, and a scroll box clips both axes. */}
          <div className="overflow-x-auto pt-3">
            <div
              role="img"
              aria-label={summarizeScoreChart(model)}
              className="relative min-w-fit pl-14"
              style={{ height: CHART_HEIGHT + 28 }}
            >
              {model.gridlines.map(line => (
                <div
                  key={line.value}
                  className="absolute inset-x-0 left-14 border-t border-dashed border-border"
                  style={{ bottom: (line.value / model.max) * CHART_HEIGHT + 28 }}
                >
                  <span className="absolute -left-14 -top-2 w-12 text-right text-[11px] tabular-nums text-muted-foreground">
                    {line.label}
                  </span>
                </div>
              ))}
              <div className="flex h-full items-end gap-2">
                {model.bars.map((bar, index) => (
                  <div key={bar.id} className="group flex w-10 flex-col items-center gap-1">
                    <span className="text-[11px] tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
                      {bar.total}
                    </span>
                    <div
                      className="w-full origin-bottom rounded-t transition-[filter] duration-200 group-hover:brightness-110"
                      style={{
                        height: Math.max(2, (bar.total / model.max) * CHART_HEIGHT),
                        background: `linear-gradient(to top, ${bar.color}, color-mix(in oklab, ${bar.color} 60%, var(--card)))`,
                        animation: `grow-up 0.6s cubic-bezier(0.22,1,0.36,1) ${String(index * 60)}ms both`
                      }}
                    />
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
                      T{bar.examId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <details className="group/table mt-4 rounded-xl bg-muted/60">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-3 font-heading text-sm font-bold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <ChevronDown className="size-4 transition-transform group-open/table:rotate-180" aria-hidden />
              Show the scores as a table
            </summary>
            <div className="px-3 pb-3">
              <Table>
                <TableCaption className="text-left">Lines: {describeGridlines(model)}.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.bars.map(bar => (
                    <TableRow key={bar.id}>
                      <TableCell>Test {bar.examId}</TableCell>
                      <TableCell>{fmtDate(bar.date)}</TableCell>
                      <TableCell className="tabular-nums">
                        {bar.total} / {model.max}
                      </TableCell>
                      <TableCell>{bar.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </details>
        </>
      )}
    </CardContent>
  </Card>
);

export default ScoreHistoryChart;

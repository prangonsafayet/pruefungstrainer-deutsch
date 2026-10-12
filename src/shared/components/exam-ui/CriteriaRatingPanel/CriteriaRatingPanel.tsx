import { Check } from 'lucide-react';

import { MAX_CRITERION_SCORE } from '@shared/exam-run/config/run.ts';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';
import { Separator } from '@shared/ui/separator.tsx';
import { Slider } from '@shared/ui/slider.tsx';

interface CriteriaRatingPanelProps {
  /** [name, hint] pairs, each rated 0–5. */
  readonly criteria: readonly (readonly [string, string])[];
  readonly values: readonly number[];
  readonly total: number;
  readonly max: number;
  readonly setValue: (index: number, value: number) => void;
  readonly onConfirm: (score: number) => void;
}

/** The self-scoring sliders every trainer's Schreiben/Sprechen rating screen shares. */
const CriteriaRatingPanel = ({
  criteria,
  values,
  total,
  max,
  setValue,
  onConfirm
}: CriteriaRatingPanelProps) => (
  <Card>
    <CardContent className="space-y-6">
      {criteria.map(([name, hint], index) => {
        const value = values[index] ?? 0;
        return (
          <div key={name} className="grid items-center gap-3 sm:grid-cols-[1fr_16rem]">
            <div>
              <p className="font-heading font-bold">{name}</p>
              <p className="text-sm text-muted-foreground">{hint}</p>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                min={0}
                max={MAX_CRITERION_SCORE}
                step={1}
                aria-label={name}
                aria-valuetext={`${String(value)} of ${String(MAX_CRITERION_SCORE)}`}
                className="py-3"
                value={[value]}
                onValueChange={([next]) => {
                  setValue(index, next ?? 0);
                }}
              />
              <span aria-hidden className="w-10 text-right font-heading font-extrabold tabular-nums">
                {value}/{MAX_CRITERION_SCORE}
              </span>
            </div>
          </div>
        );
      })}
      <Separator />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">
          Module score: <b className="font-heading text-xl tabular-nums">{total}</b>/{max}
        </p>
        <Button
          size="lg"
          onClick={() => {
            onConfirm(total);
          }}
        >
          <Check aria-hidden /> Confirm score
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default CriteriaRatingPanel;

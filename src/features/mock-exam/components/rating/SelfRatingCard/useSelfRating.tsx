import { useCallback, useMemo, useState } from 'react';

import { DEFAULT_CRITERION_SCORE } from '@shared/exam-run/config/run.ts';
import { type RatingSpec } from '@shared/exam-run/types/examFormat.ts';

export interface SelfRatingState {
  readonly criteria: readonly (readonly [string, string])[];
  readonly values: readonly number[];
  readonly total: number;
  readonly max: number;
  readonly setValue: (index: number, value: number) => void;
}

/** A self-rating's points: each 0–5 value times its criterion's step, or the flat scale. */
export const ratingTotal = (spec: RatingSpec, values: readonly number[]): number =>
  values.reduce((sum, value, index) => sum + value * (spec.stepPoints?.[index] ?? spec.scale), 0);

/**
 * The candidate's own marks for a productive module. Each criterion scores 0–5 and is
 * multiplied by the format's scale — 4 × 5 × 3 = 60 at A2·B1, 3 × 5 × 3 = 45 for the
 * single-level writing task and 5 × 5 × 3 = 75 for its oral exam — or, where criteria weigh
 * unequally, by its own step (the DTZ oral exam: 100 points over nine scales).
 */
export const useSelfRating = (spec: RatingSpec): SelfRatingState => {
  const { criteria, max } = spec;
  const [values, setValues] = useState<readonly number[]>(() => criteria.map(() => DEFAULT_CRITERION_SCORE));

  const setValue = useCallback((index: number, value: number) => {
    setValues(current => current.map((existing, i) => (i === index ? value : existing)));
  }, []);

  const total = useMemo(() => ratingTotal(spec, values), [spec, values]);

  return { criteria, values, total, max, setValue };
};

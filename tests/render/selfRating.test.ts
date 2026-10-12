import { act, createElement } from 'react';

import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DTZ_SECTION_MAX } from '@shared/config/dtzExam.ts';
import { SKILL_MAX } from '@shared/config/exam.ts';
import { SINGLE_LEVEL_SECTION_MAX } from '@shared/config/singleLevelExam.ts';

import { MAX_CRITERION_SCORE } from '@shared/exam-run/config/run.ts';
import {
  useSelfRating,
  type SelfRatingState
} from '@features/mock-exam/components/rating/SelfRatingCard/useSelfRating.tsx';
import { DTZ_FORMAT } from '@features/mock-exam/lib/formats/dtz-paper/format.ts';
import { DUAL_LEVEL_FORMAT } from '@features/mock-exam/lib/formats/dual-level/format.ts';
import { SINGLE_LEVEL_FORMAT } from '@features/mock-exam/lib/formats/single-level/format.ts';
import { type RatingSpec } from '@shared/exam-run/types/examFormat.ts';

/*
 * Schreiben and Sprechen are not marked by the app — the candidate marks them, and this hook
 * turns those 0–5 sliders into the module's score. It is the only thing in the mock-exam feature
 * with no direct coverage, and it decides two of the five module marks: 60 of 240 on the
 * A2·B1 paper, 120 of 300 on the single-level one. `gradeFullExam`'s tests cover the maxima
 * only indirectly, so nothing here would have caught a wrong `scale`.
 */

const SPECS: readonly (readonly [string, RatingSpec])[] = [
  ['A2·B1 Schreiben', DUAL_LEVEL_FORMAT.rating.schreiben],
  ['A2·B1 Sprechen', DUAL_LEVEL_FORMAT.rating.sprechen],
  ['single-level Schreiben', SINGLE_LEVEL_FORMAT.rating.schreiben],
  ['single-level Sprechen', SINGLE_LEVEL_FORMAT.rating.sprechen],
  ['DTZ Schreiben', DTZ_FORMAT.rating.schreiben],
  ['DTZ Sprechen', DTZ_FORMAT.rating.sprechen]
];

/** Points one slider step is worth for each criterion: its own step, or the flat scale. */
const steps = (spec: RatingSpec): readonly number[] =>
  spec.criteria.map((_, index) => spec.stepPoints?.[index] ?? spec.scale);

let state: SelfRatingState | null = null;
let unmount: (() => Promise<void>) | null = null;

const live = (): SelfRatingState => {
  if (!state) throw new Error('the probe has not rendered');
  return state;
};

/** Mounts the hook against one spec. Every render replaces `state`, so a stale one cannot hide. */
const rate = async (spec: RatingSpec): Promise<void> => {
  const Probe = (): null => {
    state = useSelfRating(spec);
    return null;
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(createElement(Probe));
  });
  unmount = async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  };
};

const setAll = async (value: number): Promise<void> => {
  await act(async () => {
    live().criteria.forEach((_, index) => {
      live().setValue(index, value);
    });
  });
};

beforeEach(() => {
  state = null;
  unmount = null;
});

afterEach(async () => {
  await unmount?.();
});

describe('the self-rating maths', () => {
  for (const [name, spec] of SPECS) {
    describe(name, () => {
      it('starts every criterion in the middle of its band', async () => {
        await rate(spec);
        expect(live().values).toHaveLength(spec.criteria.length);
        expect(live().total).toBe(
          live().values.reduce((sum, value, index) => sum + value * (steps(spec)[index] ?? 0), 0)
        );
        expect(live().max).toBe(spec.max);
      });

      /* The one that matters: a perfect self-rating has to land exactly on the module's
         declared maximum, or the two productive modules are marked against a total the rest
         of the app does not use. */
      it('reaches its declared maximum, and no more, on a perfect rating', async () => {
        await rate(spec);
        await setAll(MAX_CRITERION_SCORE);
        expect(live().total).toBe(spec.max);
        expect(steps(spec).reduce((sum, step) => sum + step * MAX_CRITERION_SCORE, 0)).toBe(spec.max);
      });

      it('scores zero when nothing is credited', async () => {
        await rate(spec);
        await setAll(0);
        expect(live().total).toBe(0);
      });
    });
  }

  /* Each spec derives its own `max`, so asserting a perfect rating hits it proves the hook
     but not the number. These are the maxima the marking modules and the results bars use. */
  it('lands on the maxima the rest of the app marks these modules against', async () => {
    const totalFor = async (spec: RatingSpec): Promise<number> => {
      await rate(spec);
      await setAll(MAX_CRITERION_SCORE);
      const total = live().total;
      await unmount?.();
      return total;
    };

    expect(await totalFor(DUAL_LEVEL_FORMAT.rating.schreiben)).toBe(SKILL_MAX);
    expect(await totalFor(DUAL_LEVEL_FORMAT.rating.sprechen)).toBe(SKILL_MAX);
    expect(await totalFor(SINGLE_LEVEL_FORMAT.rating.schreiben)).toBe(SINGLE_LEVEL_SECTION_MAX.schreiben);
    expect(await totalFor(SINGLE_LEVEL_FORMAT.rating.sprechen)).toBe(SINGLE_LEVEL_SECTION_MAX.sprechen);
    expect(await totalFor(DTZ_FORMAT.rating.schreiben)).toBe(DTZ_SECTION_MAX.schreiben);
    expect(await totalFor(DTZ_FORMAT.rating.sprechen)).toBe(DTZ_SECTION_MAX.sprechen);
  });

  /* The DTZ oral scales weigh 5, 5, 10, 10, 20, 10, 10, 15, 15 (spec p. 44–48): a flat scale
     would score Teil 3 like Teil 1A. Full marks on Teil 3 alone are its 20 points. */
  it('weights each DTZ Sprechen scale by its own maximum', async () => {
    await rate(DTZ_FORMAT.rating.sprechen);
    await setAll(0);
    await act(async () => {
      live().setValue(4, MAX_CRITERION_SCORE);
    });
    expect(live().criteria[4]?.[0]).toContain('Teil 3');
    expect(live().total).toBe(20);
    await act(async () => {
      live().setValue(0, MAX_CRITERION_SCORE);
    });
    expect(live().total).toBe(25);
  });

  it('moves one criterion at a time, leaving the others alone', async () => {
    const spec = DUAL_LEVEL_FORMAT.rating.schreiben;
    await rate(spec);
    const before = live().values;

    await act(async () => {
      live().setValue(1, 0);
    });

    expect(live().values[1]).toBe(0);
    expect(live().values.filter((_, index) => index !== 1)).toEqual(before.filter((_, index) => index !== 1));
    expect(live().total).toBe(
      (before.reduce((sum, value) => sum + value, 0) - (before[1] ?? 0)) * spec.scale
    );
  });

  it('ignores an index that is not a criterion rather than growing the array', async () => {
    const spec = SINGLE_LEVEL_FORMAT.rating.sprechen;
    await rate(spec);
    const before = live().total;

    await act(async () => {
      live().setValue(spec.criteria.length, MAX_CRITERION_SCORE);
    });

    expect(live().values).toHaveLength(spec.criteria.length);
    expect(live().total).toBe(before);
  });
});

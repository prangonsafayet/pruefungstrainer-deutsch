/**
 * Reading a backup file into the stored document.
 *
 * Import replaces rather than merges — that is what a restore means, and merging would make
 * rolling back to an older backup impossible. But a file written before a trainer existed
 * says *nothing* about that trainer, which is not the same as asking for it to be deleted:
 * restoring a pre-B1/B2 backup used to empty both trainer documents silently, and the fresh
 * `_updatedAt` then pushed that emptiness to the cloud and every other device. So a trainer
 * the file does not mention keeps what it has, and the confirm dialog names both lists.
 */

import { TRAINER_ORDER, TRAINERS } from '@shared/config/trainers.ts';
import { appError, err, ok, type Result } from '@shared/lib/appError.ts';
import { type ProgressDatabase } from '@shared/types/progress.ts';
import { type TrainerId } from '@shared/types/trainer.ts';

import { normalizeDatabase } from './progressDb.ts';

/**
 * What proves the file carries the root trainer's slice. `settings` is not on the list: it
 * holds exam conditions rather than work done, so a file with settings and no attempts is
 * not evidence that the root trainer was exported.
 */
const ROOT_PROGRESS_FIELDS = ['attempts', 'learnDone', 'srs', 'activity'] as const;

/** What is carried over when the file does not mention the root trainer — its whole slice. */
const ROOT_SLICE_FIELDS = [...ROOT_PROGRESS_FIELDS, 'settings'] as const;

export interface ImportPlan {
  /** The document to store: the file, plus every unmentioned trainer's own progress. */
  readonly database: ProgressDatabase;
  /** Trainers the file carries, whose stored progress it replaces. */
  readonly replaces: readonly TrainerId[];
  /** Trainers the file says nothing about, whose stored progress is kept. */
  readonly keeps: readonly TrainerId[];
}

/** Whether the file carries this trainer's slice at all. */
const mentions = (file: Partial<Record<string, unknown>>, trainer: TrainerId): boolean => {
  const docKey = TRAINERS[trainer].docKey;
  return docKey === null ? ROOT_PROGRESS_FIELDS.some(field => field in file) : docKey in file;
};

/**
 * What importing this file would do, or null if it is not a trainer export at all.
 *
 * Pure, and separate from the hook, because it is the whole decision: which trainers the
 * file speaks for, which ones keep what they have, and the document that comes out.
 */
export const planImport = (current: ProgressDatabase, parsed: unknown): ImportPlan | null => {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
  const file = parsed as Partial<Record<string, unknown>>;

  const replaces: TrainerId[] = [];
  const keeps: TrainerId[] = [];
  const next: Partial<Record<string, unknown>> = { ...file };
  /* The weakness profile sits at the root, keyed by trainer, so it is split the same way:
     the file's entry for a trainer it speaks for, the stored one for a trainer it keeps. */
  const fileWeakness = file['weakness'];
  const weakness: Partial<Record<string, unknown>> = isPlainObject(fileWeakness)
    ? { ...(fileWeakness as Partial<Record<string, unknown>>) }
    : {};

  for (const trainer of TRAINER_ORDER) {
    if (mentions(file, trainer)) {
      replaces.push(trainer);
      continue;
    }
    keeps.push(trainer);
    const keptProfile = current.weakness?.[trainer];
    if (keptProfile === undefined) Reflect.deleteProperty(weakness, trainer);
    else weakness[trainer] = keptProfile;
    const docKey = TRAINERS[trainer].docKey;
    if (docKey === null) {
      for (const field of ROOT_SLICE_FIELDS) next[field] = current[field];
    } else {
      next[docKey] = current[docKey];
    }
  }

  /* A file that speaks for no trainer is not a trainer export: `{}`, an array, or simply the
     wrong file. Refusing it beats importing it as "no progress" over everything stored. */
  if (replaces.length === 0) return null;

  next['weakness'] = weakness;
  return { database: normalizeDatabase(next), replaces, keeps };
};

const isPlainObject = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** What each slice field has to be, and how to say it to a learner. */
/* `null` passes for a map: older hand-edited exports wrote `learnDone: null`, which
   `normalizeDatabase` reads as an empty map — refusing the whole file over it would be harsh. */
const isMapOrNull = (value: unknown): boolean => value === null || isPlainObject(value);

const SLICE_SHAPES = [
  ['attempts', 'list', (value: unknown) => Array.isArray(value)],
  ['learnDone', 'map', isMapOrNull],
  ['srs', 'map', isMapOrNull],
  ['activity', 'map', isMapOrNull],
  ['settings', 'map', isMapOrNull]
] as const;

const kindOf = (value: unknown): string =>
  value === null
    ? 'empty (null)'
    : Array.isArray(value)
      ? 'a list'
      : typeof value === 'string'
        ? 'text'
        : `a ${typeof value}`;

/** The first field of a slice the file carries that has the wrong shape, as a sentence. */
const findBadField = (slice: Partial<Record<string, unknown>>, prefix: string): string | null => {
  for (const [field, want, matches] of SLICE_SHAPES) {
    if (!(field in slice)) continue;
    const value = slice[field];
    if (!matches(value)) {
      return `"${prefix}${field}" should be ${want === 'list' ? 'a list' : 'a group of entries'}, but it is ${kindOf(value)}.`;
    }
  }
  return null;
};

/**
 * A backup file's text, checked and planned — or the reason it cannot be imported, in words
 * a learner can act on. Stricter than `normalizeDatabase` on purpose: a stored document is
 * repaired so the app keeps working, but a file the learner chose is refused rather than
 * silently imported with a damaged field emptied out over their real progress.
 */
export const readBackup = (text: string, current: ProgressDatabase): Result<ImportPlan> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    /* No cause: a JSON SyntaxError quotes the file's own text, which must not reach the log. */
    return err(appError('import-not-json'));
  }
  if (!isPlainObject(parsed)) return err(appError('import-not-export'));
  const file = parsed as Partial<Record<string, unknown>>;

  for (const trainer of TRAINER_ORDER) {
    if (!mentions(file, trainer)) continue;
    const docKey = TRAINERS[trainer].docKey;
    if (docKey === null) {
      const bad = findBadField(file, '');
      if (bad)
        return err(
          appError('import-bad-field', {
            message: `That backup cannot be imported: ${bad} Nothing was changed.`
          })
        );
      continue;
    }
    const slice = file[docKey];
    if (!isPlainObject(slice)) {
      return err(
        appError('import-bad-field', {
          message: `That backup cannot be imported: "${docKey}" should be a group of entries, but it is ${kindOf(slice)}. Nothing was changed.`
        })
      );
    }
    const bad = findBadField(slice as Partial<Record<string, unknown>>, `${docKey}.`);
    if (bad)
      return err(
        appError('import-bad-field', {
          message: `That backup cannot be imported: ${bad} Nothing was changed.`
        })
      );
  }

  const plan = planImport(current, parsed);
  return plan ? ok(plan) : err(appError('import-not-export'));
};

const listNames = (trainers: readonly TrainerId[]): string =>
  trainers.map(trainer => TRAINERS[trainer].short).join(', ');

/**
 * What the confirm dialog says an import will do. Here rather than in the component so no
 * screen writes copy of its own about it — and so the claim can be tested next to the
 * behaviour it describes.
 */
export const describeImport = (plan: ImportPlan): string => {
  const replaced = `Attempts, learn-plan ticks and exam conditions for ${listNames(plan.replaces)} will be replaced by the ones in the file.`;
  const kept =
    plan.keeps.length === 0
      ? ''
      : ` ${listNames(plan.keeps)} ${plan.keeps.length === 1 ? 'is' : 'are'} not in the file, so ${plan.keeps.length === 1 ? 'its' : 'their'} progress stays exactly as it is.`;
  return `${replaced}${kept} If you are signed in, the result syncs to the cloud and to your other devices.`;
};

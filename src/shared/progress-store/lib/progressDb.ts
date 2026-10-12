import { DEFAULT_SETTINGS } from '@shared/config/exam.ts';
import { DEFAULT_PLAYS_ALLOWED } from '@shared/config/examConditions.ts';
import { defaultLevelSettings } from '@shared/config/singleLevelExam.ts';
import { TRAINERS } from '@shared/config/trainers.ts';
import { appError, err, type Result } from '@shared/lib/appError.ts';
import { logger } from '@shared/lib/logger.ts';
import { readLocal, writeLocal } from '@shared/lib/storage.ts';
import { type ProgressDatabase } from '@shared/types/progress.ts';
import { type LevelTrainerSettings, type TrainerDoc, type TrainerId } from '@shared/types/trainer.ts';

/** localStorage key. Stable since v1 — do not rename without a migration. */
export const PROGRESS_STORAGE_KEY = 'telcTrainerV1';

/**
 * Where a stored document that could not be read is set aside, byte for byte, before the
 * trainer starts fresh — the first write would otherwise overwrite it. A protected key like
 * the one above: never rename or remove it. Holds the most recent damaged copy.
 */
export const PROGRESS_RECOVERY_KEY = 'telcTrainerRecoveryV1';

/**
 * A trainer's default exam conditions: the writing time its own paper allows and the play
 * count its paper defaults to — both read from its registry descriptor rather than defaulted,
 * so a trainer whose Schreiben runs for something other than 30 minutes, or whose audio
 * plays a different number of times, does not silently inherit B1's.
 */
const trainerDefaults = (trainer: TrainerId): LevelTrainerSettings => {
  const info = TRAINERS[trainer];
  return defaultLevelSettings(info.paper.minutes.schreiben, DEFAULT_PLAYS_ALLOWED[info.format]);
};

/** A fresh trainer document. No attempts, so it fits whichever paper the trainer sets. */
export const emptyTrainerDoc = (trainer: TrainerId): TrainerDoc<never> => ({
  attempts: [],
  learnDone: {},
  srs: {},
  activity: {},
  settings: trainerDefaults(trainer)
});

export const EMPTY_DATABASE: ProgressDatabase = {
  attempts: [],
  learnDone: {},
  settings: DEFAULT_SETTINGS,
  srs: {},
  activity: {},
  b1: emptyTrainerDoc('b1'),
  b2: emptyTrainerDoc('b2'),
  dtz: emptyTrainerDoc('dtz'),
  /* No trainer has an error history yet, and none is keyed until one is recorded. */
  weakness: {}
};

/**
 * Counts practice touches for a day. The streak reads this map, so it is bumped rather
 * than replaced — one shared helper for every trainer's slice, wherever it is stored.
 */
export const bumpActivity = (
  activity: Partial<Record<string, number>>,
  today: string,
  touches = 1
): Partial<Record<string, number>> => ({ ...activity, [today]: (activity[today] ?? 0) + touches });

/**
 * Fills in missing defaults — but returns the caller's own object when nothing is missing.
 *
 * `normalizeDatabase` runs on every write, not just on load, so rebuilding these objects
 * unconditionally handed every consumer a brand-new `settings` on a write that only touched
 * a curriculum checkbox. Everything downstream memoises on those references.
 */
const withDefaults = <T extends object>(defaults: T, input: unknown): T => {
  if (typeof input !== 'object' || input === null) return defaults;
  const candidate = input as T;
  return Object.keys(defaults).every(key => key in candidate) ? candidate : { ...defaults, ...candidate };
};

/**
 * A map, which `typeof value === 'object'` alone does not establish: it is also true for
 * `null` and for arrays. A `learnDone: null` in a hand-edited or foreign import file used to
 * load as `null` and then throw a `TypeError` in `Object.entries` on the next sign-in — so
 * the account could not sign in, and every reader of the map crashed the page it was on,
 * including the Settings screen the user would need to import a good file from.
 */
const isMap = (value: unknown): value is object =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** True when normalising changed no field, so the caller's object can be kept as it is. */
const unchanged = <T extends object>(before: Partial<T>, after: T): boolean =>
  Object.keys(after).every(key => before[key as keyof T] === after[key as keyof T]);

/**
 * Coerces anything that claims to be a trainer document, defaulting every field. The attempt
 * type comes from the slot it was read from (`input.b1`, `input.dtz`); the value itself is
 * treated as untrusted.
 */
const normalizeTrainerDoc = <TAttempt>(
  trainer: TrainerId,
  raw: TrainerDoc<TAttempt> | undefined
): TrainerDoc<TAttempt> => {
  const value: unknown = raw;
  const input = (typeof value === 'object' && value !== null ? value : {}) as Partial<TrainerDoc<TAttempt>>;
  const normalized: TrainerDoc<TAttempt> = {
    ...input,
    attempts: Array.isArray(input.attempts) ? input.attempts : [],
    learnDone: isMap(input.learnDone) ? input.learnDone : {},
    srs: isMap(input.srs) ? input.srs : {},
    activity: isMap(input.activity) ? input.activity : {},
    settings: withDefaults(trainerDefaults(trainer), input.settings)
  };
  return unchanged(input, normalized) ? (input as TrainerDoc<TAttempt>) : normalized;
};

/**
 * Coerces anything that claims to be a progress document into a usable one. Data can
 * arrive from an older version of the app, a hand-edited import file or the cloud, so
 * every field is defaulted rather than trusted — and every field it does not recognise is
 * carried through untouched, because the writer may simply be a newer build than this one.
 */
export const normalizeDatabase = (raw: unknown): ProgressDatabase => {
  const input = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<ProgressDatabase>;
  return {
    /* Unrecognised fields are carried over, not dropped. This function runs over the *remote*
       row on its way into `mergeProgress`, so a whitelist rebuild here means a device on an
       older cached build strips a newer build's field — a fourth trainer's document, say —
       and pushes the stripped copy back, deleting that progress from the cloud. That is the
       trainer-document wipe again, one rollout step removed. Every known field below is still
       validated, so nothing untrusted is believed. */
    ...input,
    attempts: Array.isArray(input.attempts) ? input.attempts : [],
    learnDone: isMap(input.learnDone) ? input.learnDone : {},
    settings: withDefaults(DEFAULT_SETTINGS, input.settings),
    srs: isMap(input.srs) ? input.srs : {},
    activity: isMap(input.activity) ? input.activity : {},
    b1: normalizeTrainerDoc('b1', input.b1),
    b2: normalizeTrainerDoc('b2', input.b2),
    dtz: normalizeTrainerDoc('dtz', input.dtz),
    /* Validated only as far as being a map: the trainers inside it are not enumerated here,
       so a profile written for a trainer this build does not know survives the round trip. */
    weakness: isMap(input.weakness) ? input.weakness : {},
    ...(input._updatedAt ? { _updatedAt: input._updatedAt } : {})
  };
};

/**
 * Set when the damaged stored text could not be copied aside: until the learner downloads
 * it or chooses to discard it, `telcTrainerV1` is the only copy, so nothing may write over it.
 */
let holdingDamaged = false;

/** The learner has downloaded or discarded the damaged text: writes may replace it now. */
export const releaseDamaged = (): void => {
  holdingDamaged = false;
};

export const persistDatabase = (db: ProgressDatabase): Result<void> => {
  if (holdingDamaged) return err(appError('storage-corrupt'));
  return writeLocal(PROGRESS_STORAGE_KEY, JSON.stringify(db));
};

export interface LoadedProgress {
  readonly db: ProgressDatabase;
  /** The stored text when it could not be read as a document. */
  readonly damaged: string | null;
  /** Whether `damaged` was copied to `PROGRESS_RECOVERY_KEY`. When false, the original under
      `PROGRESS_STORAGE_KEY` is the only copy, and writes are held until `releaseDamaged`. */
  readonly setAside: boolean;
}

/** The stored text as a document, or null when it is not JSON or not an object at all. */
const parseStored = (raw: string): object | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * The stored document. Text that is not a document — truncated JSON, a hand edit gone wrong,
 * an array — used to load as an empty document that the next write saved over the original,
 * so the learner lost everything without a word. It is now copied to the recovery key first
 * and reported, so the app can say so and offer the copy for download.
 */
export const loadDatabase = (): LoadedProgress => {
  const raw = readLocal(PROGRESS_STORAGE_KEY);
  holdingDamaged = false;
  if (raw === null) return { db: normalizeDatabase(null), damaged: null, setAside: false };
  const parsed = parseStored(raw);
  if (parsed !== null) return { db: normalizeDatabase(parsed), damaged: null, setAside: false };

  logger.error('progress', `Stored progress is not a document (${String(raw.length)} chars); set aside`);
  const fresh = normalizeDatabase(null);
  /* Only once the copy is safe is the damaged text replaced — so the notice is shown once,
     not on every load. If the copy could not be written (storage full), the original is the
     only copy: every write is held in memory until the learner downloads or discards it. */
  const setAside = writeLocal(PROGRESS_RECOVERY_KEY, raw).ok;
  if (setAside) persistDatabase(fresh);
  else holdingDamaged = true;
  return { db: fresh, damaged: raw, setAside };
};

/** Stamps the change so cloud sync can tell which side is newer. */
export const stamp = (db: ProgressDatabase): ProgressDatabase => ({
  ...db,
  _updatedAt: new Date().toISOString()
});

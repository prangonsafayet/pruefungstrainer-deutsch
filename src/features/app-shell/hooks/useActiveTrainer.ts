import { useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import {
  TRAINER_ORDER,
  TRAINERS,
  trainerFromPath,
  trainerHome,
  type TrainerInfo
} from '@shared/config/trainers.ts';
import { type TrainerId } from '@shared/types';

/** Every trainer's descriptor, in registry order, for the switcher's menu. */
const ALL_TRAINERS: readonly TrainerInfo[] = TRAINER_ORDER.map(id => TRAINERS[id]);

export interface ActiveTrainer {
  /** The trainer whose area of the app the current URL is in. */
  readonly trainer: TrainerInfo;
  /** That trainer's dashboard URL. */
  readonly home: string;
  /** Every trainer, in registry order. */
  readonly trainers: readonly TrainerInfo[];
  /** Navigates to another trainer's dashboard. */
  readonly switchTo: (trainer: TrainerId) => void;
}

/**
 * The trainer the shell is showing, read from the URL: the header's name, countdown, nav
 * and switcher all follow it, so none of them looks the registry up for itself.
 */
export const useActiveTrainer = (): ActiveTrainer => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const trainer = TRAINERS[trainerFromPath(pathname)];

  const switchTo = useCallback(
    (id: TrainerId): void => {
      void navigate(trainerHome(id));
    },
    [navigate]
  );

  return { trainer, home: trainerHome(trainer.id), trainers: ALL_TRAINERS, switchTo };
};

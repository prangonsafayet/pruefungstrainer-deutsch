import { useId } from 'react';

import { Play, Square } from 'lucide-react';

import { useAudioPlayback } from '@shared/hooks/useAudioPlayback.tsx';
import { cn } from '@shared/lib/cn.ts';
import { plural } from '@shared/lib/format.ts';
import { type AudioScript } from '@shared/types/exam.ts';
import { Button } from '@shared/ui/button.tsx';

interface AudioPlayButtonProps {
  readonly script: AudioScript;
  readonly rate: number;
  readonly voiceName: string;
  readonly itemKey: string;
  readonly playsLeft: number;
  readonly onConsumePlay: (itemKey: string) => void;
}

const playsLeftText = (playsLeft: number): string =>
  playsLeft <= 0 ? 'No plays left' : `${plural(playsLeft, 'play')} left`;

/**
 * Play/stop for one listening item, in any format: a real button, so Space and Enter work, with
 * the remaining plays said in words and tied to it as its description. English chrome inside a
 * German Teil, so it says so.
 */
const AudioPlayButton = ({
  script,
  rate,
  voiceName,
  itemKey,
  playsLeft,
  onConsumePlay
}: AudioPlayButtonProps) => {
  const { playing, canPlay, toggle } = useAudioPlayback({
    script,
    rate,
    voiceName,
    itemKey,
    playsLeft,
    onConsumePlay
  });
  const hintId = useId();

  return (
    <div lang="en" className="flex flex-wrap items-center gap-3">
      <Button
        variant={playing ? 'secondary' : 'default'}
        onClick={toggle}
        disabled={!playing && !canPlay}
        aria-describedby={hintId}
        className="min-w-28"
      >
        {playing ? <Square aria-hidden /> : <Play aria-hidden />}
        {playing ? 'Stop' : 'Play'}
      </Button>
      <span
        id={hintId}
        className={cn(
          'text-sm font-semibold tabular-nums',
          canPlay ? 'text-muted-foreground' : 'text-destructive-on-tint'
        )}
      >
        {playing ? 'Playing… ' : ''}
        {playsLeftText(playsLeft)}
      </span>
    </div>
  );
};

export default AudioPlayButton;

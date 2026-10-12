import { Play, Square } from 'lucide-react';

import { useAudioPlayback } from '@shared/hooks/useAudioPlayback.tsx';
import { type AudioScript } from '@shared/types/exam.ts';
import { Badge } from '@shared/ui/badge.tsx';
import { Button } from '@shared/ui/button.tsx';

interface AudioPlayButtonProps {
  readonly script: AudioScript;
  readonly rate: number;
  readonly voiceName: string;
  readonly itemKey: string;
  readonly playsLeft: number;
  readonly onConsumePlay: (itemKey: string) => void;
}

/** Play/stop plus the remaining-plays badge for one listening item, in either format. */
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

  return (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        variant={playing ? 'secondary' : 'default'}
        onClick={toggle}
        disabled={!playing && !canPlay}
      >
        {playing ? <Square /> : <Play />}
        {playing ? 'Stopp' : 'Anhören'}
      </Button>
      <Badge variant={canPlay ? 'secondary' : 'destructive'}>{playsLeft}× left</Badge>
    </div>
  );
};

export default AudioPlayButton;

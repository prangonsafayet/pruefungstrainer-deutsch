import { Circle, Mic, Square } from 'lucide-react';

import { useRecorder } from '@shared/hooks/useRecorder.tsx';
import { type SpeakingPart } from '@shared/types/examRun.ts';
import { Button } from '@shared/ui/button.tsx';

interface RecorderControlsProps {
  readonly part: SpeakingPart;
  readonly recordingUrl: string | undefined;
  readonly onRecorded: (part: SpeakingPart, url: string) => void;
}

/** Record / stop for one speaking Teil. English chrome inside a German Teil, so it says so. */
const RecorderControls = ({ part, recordingUrl, onRecorded }: RecorderControlsProps) => {
  const recorder = useRecorder({
    onRecorded: url => {
      onRecorded(part, url);
    }
  });
  const recording = recorder.status === 'recording';

  return (
    <div lang="en" className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
      <Button
        variant={recording ? 'outline' : 'secondary'}
        onClick={() => void recorder.start()}
        disabled={!recorder.supported || recording}
        title={recorder.supported ? undefined : 'Recording is not supported in this browser'}
      >
        <Mic aria-hidden /> Record
      </Button>
      <Button variant="outline" onClick={recorder.stop} disabled={!recording}>
        <Square aria-hidden /> Stop
      </Button>
      <span role="status" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {recording ? (
          <Circle aria-hidden className="size-2.5 animate-pulse fill-destructive text-destructive" />
        ) : null}
        {recorder.message}
      </span>
      {recordingUrl ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- the learner's own microphone recording; there is no transcript to caption it with.
        <audio controls src={recordingUrl} className="h-10 max-w-full" aria-label="Your recording" />
      ) : null}
    </div>
  );
};

export default RecorderControls;

import { PunkteGrid, RecorderControls, RedemittelList, TeilSection } from '@shared/components';
import { type SingleLevelSprechenTeil, type SpeakingPart } from '@shared/types';

interface SprechenTeilProps {
  readonly teil: SingleLevelSprechenTeil;
  readonly part: SpeakingPart;
  readonly chip: string;
  readonly recordingUrl: string | undefined;
  readonly onRecorded: (part: SpeakingPart, url: string) => void;
}

const SingleLevelSprechenTeilCard = ({ teil, part, chip, recordingUrl, onRecorded }: SprechenTeilProps) => (
  <TeilSection title={teil.titel} chip={chip} anweisung={teil.anweisung}>
    <PunkteGrid items={teil.punkte} />
    <RedemittelList items={teil.redemittel} />
    <RecorderControls part={part} recordingUrl={recordingUrl} onRecorded={onRecorded} />
  </TeilSection>
);

export default SingleLevelSprechenTeilCard;

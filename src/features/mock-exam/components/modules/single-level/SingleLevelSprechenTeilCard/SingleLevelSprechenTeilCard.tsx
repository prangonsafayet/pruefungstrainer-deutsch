import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import PunkteGrid from '@shared/components/exam-ui/PunkteGrid/PunkteGrid.tsx';
import RecorderControls from '@shared/components/exam-ui/RecorderControls/RecorderControls.tsx';
import RedemittelList from '@shared/components/exam-ui/RedemittelList/RedemittelList.tsx';
import { type SpeakingPart } from '@shared/types/examRun.ts';
import { type SingleLevelSprechenTeil } from '@shared/types/singleLevelExam.ts';

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

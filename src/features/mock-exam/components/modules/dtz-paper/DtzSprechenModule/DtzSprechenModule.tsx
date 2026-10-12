import { Mic } from 'lucide-react';

import ExamCallout from '@shared/components/exam-ui/layout/ExamCallout/ExamCallout.tsx';
import ReadingText from '@shared/components/exam-ui/layout/ReadingText/ReadingText.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import PunkteGrid from '@shared/components/exam-ui/PunkteGrid/PunkteGrid.tsx';
import RecorderControls from '@shared/components/exam-ui/RecorderControls/RecorderControls.tsx';
import RedemittelList from '@shared/components/exam-ui/RedemittelList/RedemittelList.tsx';
import { DTZ_SPRECHEN_STICHWORTE } from '@shared/config/dtzExam.ts';

import { type DtzModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const DtzSprechenModule = ({ exam, paper, recordings, onRecorded }: DtzModuleProps) => {
  const { teil1, teil2, teil3 } = exam.sprechen;
  const chips = paper.sprechenChips;

  return (
    <>
      <ExamCallout className="flex items-start gap-2">
        <Mic className="mt-0.5 size-4 shrink-0" />
        <span>
          Speak OUT LOUD — ideally record yourself (allow the microphone) and listen back.{' '}
          {paper.prepNote.lead}
          <b>{paper.prepNote.emphasis}</b>
          {paper.prepNote.tail} Recordings live only in this session; they are not saved to disk.
        </span>
      </ExamCallout>

      <div lang="de">
        <TeilSection title="Teil 1 — Über sich sprechen" chip={chips[0] ?? ''} anweisung={teil1.anweisung}>
          <p className="font-semibold">1A · Stichworte</p>
          <PunkteGrid items={DTZ_SPRECHEN_STICHWORTE} />
          <p className="font-semibold">1B · Nachfragen</p>
          <PunkteGrid items={teil1.nachfragen} />
          <RedemittelList items={teil1.redemittel} />
          {/* The recorder's own labels are English UI chrome. */}
          <div lang="en">
            <RecorderControls part="t1" recordingUrl={recordings.t1} onRecorded={onRecorded} />
          </div>
        </TeilSection>

        <TeilSection
          title="Teil 2 — Über Erfahrungen sprechen"
          chip={chips[1] ?? ''}
          anweisung={teil2.anweisung}
        >
          {teil2.bilder.map((bild, index) => (
            <div key={index}>
              <ReadingText title={`Bild ${String(index + 1)} (2A)`}>{bild.beschreibung}</ReadingText>
              <p className="font-semibold">2B · Nachfragen A2</p>
              <PunkteGrid items={bild.fragenA2} />
              <p className="font-semibold">2B · Nachfragen B1</p>
              <PunkteGrid items={bild.fragenB1} />
            </div>
          ))}
          <RedemittelList items={teil2.redemittel} />
          {/* The recorder's own labels are English UI chrome. */}
          <div lang="en">
            <RecorderControls part="t2" recordingUrl={recordings.t2} onRecorded={onRecorded} />
          </div>
        </TeilSection>

        <TeilSection title="Teil 3 — Gemeinsam etwas planen" chip={chips[2] ?? ''} anweisung={teil3.aufgabe}>
          <p className="mb-2">{teil3.situation}</p>
          <PunkteGrid items={teil3.notizen} />
          <RedemittelList items={teil3.redemittel} />
          {/* The recorder's own labels are English UI chrome. */}
          <div lang="en">
            <RecorderControls part="t3" recordingUrl={recordings.t3} onRecorded={onRecorded} />
          </div>
        </TeilSection>
      </div>
    </>
  );
};

export default DtzSprechenModule;

import { Mic } from 'lucide-react';

import ExamCallout from '@shared/components/exam-ui/layout/ExamCallout/ExamCallout.tsx';
import TeilSection from '@shared/components/exam-ui/layout/TeilSection/TeilSection.tsx';
import PunkteGrid from '@shared/components/exam-ui/PunkteGrid/PunkteGrid.tsx';
import RecorderControls from '@shared/components/exam-ui/RecorderControls/RecorderControls.tsx';
import RedemittelList from '@shared/components/exam-ui/RedemittelList/RedemittelList.tsx';

import { type A2b1ModuleProps } from '@features/mock-exam/types/moduleProps.ts';

const DualLevelSprechenModule = ({ exam, paper, recordings, onRecorded }: A2b1ModuleProps) => {
  const { sprechen } = exam;

  return (
    <>
      <ExamCallout className="flex items-start gap-2">
        <Mic aria-hidden className="mt-0.5 size-4 shrink-0" />
        <span>
          Speak OUT LOUD — ideally record yourself (allow the microphone) and listen back.{' '}
          {paper.prepNote.lead}
          <b>{paper.prepNote.emphasis}</b>
          {paper.prepNote.tail} Recordings live only in this session; they are not saved to disk.
        </span>
      </ExamCallout>

      <TeilSection
        title="Teil 1 — Sich vorstellen"
        chip={paper.sprechenChips[0] ?? ''}
        anweisung={sprechen.teil1.anweisung}
      >
        <PunkteGrid items={sprechen.teil1.punkte} />
        <RedemittelList items={sprechen.teil1.redemittel} />
        <RecorderControls part="t1" recordingUrl={recordings.t1} onRecorded={onRecorded} />
      </TeilSection>

      <TeilSection title="Teil 2 — Über ein Thema sprechen" chip={paper.sprechenChips[1] ?? ''}>
        <p className="mb-2 font-heading font-bold">Thema: {sprechen.teil2.thema}</p>
        <p className="mb-4 italic text-muted-foreground">
          {sprechen.teil2.anweisung}{' '}
          <b lang="en" className="not-italic text-foreground">
            Read the task twice before you start!
          </b>
        </p>
        <ol className="my-4 list-decimal space-y-1 pl-5">
          {sprechen.teil2.leitfragen.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ol>
        <RedemittelList items={sprechen.teil2.redemittel} />
        <RecorderControls part="t2" recordingUrl={recordings.t2} onRecorded={onRecorded} />
      </TeilSection>

      <TeilSection title="Teil 3 — Gemeinsam planen" chip={paper.sprechenChips[2] ?? ''}>
        <p className="mb-2 font-heading font-bold">{sprechen.teil3.aufgabe}</p>
        <p className="mb-4 italic text-muted-foreground">
          {sprechen.teil3.anweisung}{' '}
          <span lang="en">(Solo training: speak both roles, or grab a partner.)</span>
        </p>
        <PunkteGrid items={sprechen.teil3.punkte} />
        <RedemittelList items={sprechen.teil3.redemittel} />
        <RecorderControls part="t3" recordingUrl={recordings.t3} onRecorded={onRecorded} />
      </TeilSection>
    </>
  );
};

export default DualLevelSprechenModule;

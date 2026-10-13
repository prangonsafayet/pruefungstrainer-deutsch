import { type AudioScript } from '@shared/types/exam.ts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion.tsx';

interface ListeningTranscriptProps {
  readonly audio: AudioScript;
}

/** Collapsed by default — transcripts must stay hidden until the review screen. */
const ListeningTranscript = ({ audio }: ListeningTranscriptProps) => (
  <Accordion type="single" collapsible className="mt-2" lang="en">
    <AccordionItem value="transcript" className="border-b-0">
      <AccordionTrigger className="py-2 text-sm text-muted-foreground">Transcript</AccordionTrigger>
      <AccordionContent className="pb-2">
        <div lang="de" className="space-y-1 rounded-xl bg-muted p-4 leading-relaxed">
          {typeof audio === 'string'
            ? audio
            : audio.map((turn, index) => (
                <p key={index}>
                  <b>{turn.speaker}:</b> {turn.text}
                </p>
              ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default ListeningTranscript;

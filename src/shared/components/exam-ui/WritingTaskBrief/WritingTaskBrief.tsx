import MultilineText from '@shared/components/MultilineText/MultilineText.tsx';
import { type SingleLevelWritingTask } from '@shared/types/singleLevelExam.ts';

interface WritingTaskBriefProps {
  readonly task: SingleLevelWritingTask;
}

/** The situation, incoming letter and Leitpunkte of one writing task. */
const WritingTaskBrief = ({ task }: WritingTaskBriefProps) => (
  <>
    <p className="mb-4 max-w-3xl leading-relaxed">{task.situation}</p>
    {task.incoming ? (
      <div className="my-4 max-w-3xl overflow-hidden rounded-xl bg-muted">
        <p className="border-b border-border px-4 py-2.5 text-sm text-muted-foreground">
          Von: {task.incoming.von} · Betreff: <b className="text-foreground">{task.incoming.betreff}</b>
        </p>
        <p className="p-4 leading-relaxed">
          <MultilineText text={task.incoming.text} />
        </p>
      </div>
    ) : null}
    <p className="mb-2 font-heading font-bold">Leitpunkte:</p>
    <ol className="mb-5 list-decimal space-y-1 pl-5 leading-relaxed">
      {task.leitpunkte.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ol>
  </>
);

export default WritingTaskBrief;

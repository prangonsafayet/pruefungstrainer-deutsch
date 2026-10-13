import { ArrowLeft, Home, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import ListeningTranscript from '@shared/components/exam-ui/ListeningTranscript/ListeningTranscript.tsx';
import PageTitle from '@shared/components/layout/PageTitle/PageTitle.tsx';
import SectionTitle from '@shared/components/layout/SectionTitle/SectionTitle.tsx';
import MultilineText from '@shared/components/MultilineText/MultilineText.tsx';
import { TRAINERS } from '@shared/config/trainers.ts';
import { type ExamFormat, type RunSettings, type StoredAttempt } from '@shared/exam-run/types/examFormat.ts';
import { textAnswer, WRITING_ANSWER_KEY } from '@shared/lib/answers.ts';
import { fmtDate } from '@shared/lib/format.ts';
import { type AttemptMode, type ExamPaper } from '@shared/types/exam.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';

import AttemptReviewRowCard from '@features/mock-exam/components/review/AttemptReviewRowCard/AttemptReviewRowCard.tsx';
import { attemptIncludes } from '@features/mock-exam/lib/attemptMode.ts';

interface AttemptReviewProps<
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
> {
  readonly trainer: TrainerId;
  readonly format: ExamFormat<TExam, TSettings, TAttempt>;
  readonly exam: TExam;
  readonly attempt: TAttempt;
  readonly onRetry: (examId: number, mode: AttemptMode) => void;
}

/** Every item of an attempt with the given and the correct answer, plus the transcripts. */
const AttemptReview = <
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
>({
  trainer,
  format,
  exam,
  attempt,
  onRetry
}: AttemptReviewProps<TExam, TSettings, TAttempt>) => {
  const base = TRAINERS[trainer].basePath;
  const sections = format.scoring.review(exam, attempt);
  const sample = format.scoring.writingSample(exam, attempt.answers);
  const writtenText = textAnswer(attempt.answers, WRITING_ANSWER_KEY);
  const selfScore = (module: 'schreiben' | 'sprechen'): string =>
    `${String(attempt.ratings[module] ?? '–')}/${String(format.rating[module].max)}`;

  return (
    <>
      <PageTitle
        lead={`${fmtDate(attempt.date)} · Every item says whether it was correct. Learn each incorrect one before your next test.`}
      >
        Review — {format.examLabel(exam)}
      </PageTitle>

      {sections.map(section => (
        <section key={section.module}>
          <SectionTitle>{section.heading}</SectionTitle>
          {section.transcripts?.map((audio, index) => (
            <Card className="my-3" key={index}>
              <CardContent>
                <ListeningTranscript audio={audio} />
              </CardContent>
            </Card>
          ))}
          <ul className="space-y-2">
            {section.rows.map(row => (
              <AttemptReviewRowCard key={row.id} row={row} />
            ))}
          </ul>
        </section>
      ))}

      {attemptIncludes(attempt.mode, 'schreiben') && sample ? (
        <section>
          <SectionTitle>
            {format.moduleName('schreiben')} — {selfScore('schreiben')} (self-scored)
          </SectionTitle>
          <Card>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Your text</h3>
                <div lang="de" className="rounded-xl bg-muted p-4 leading-relaxed">
                  <MultilineText text={writtenText || '(empty)'} />
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Musterlösung</h3>
                <div
                  lang="de"
                  className="rounded-xl border-l-4 border-success bg-[color-mix(in_oklab,var(--success)_8%,var(--card))] p-4 leading-relaxed"
                >
                  <MultilineText text={sample.musterloesung} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {attemptIncludes(attempt.mode, 'sprechen') ? (
        <section>
          <SectionTitle>
            {format.moduleName('sprechen')} — {selfScore('sprechen')} (self-scored)
          </SectionTitle>
          <Card>
            <CardContent className="text-sm text-muted-foreground">{format.speakingReviewNote}</CardContent>
          </Card>
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to={`${base}/results/${String(attempt.id)}`}>
            <ArrowLeft aria-hidden /> Back to results
          </Link>
        </Button>
        <Button
          onClick={() => {
            onRetry(attempt.examId, attempt.mode);
          }}
        >
          <RotateCcw aria-hidden /> Retry this exam
        </Button>
        <Button asChild variant="ghost">
          <Link to={base || '/'}>
            <Home aria-hidden /> Dashboard
          </Link>
        </Button>
      </div>
    </>
  );
};

export default AttemptReview;

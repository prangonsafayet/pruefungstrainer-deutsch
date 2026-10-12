import { Clock, Home, ListChecks, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

import CountedNumber from '@shared/components/data-display/CountedNumber/CountedNumber.tsx';
import ScoreMeter from '@shared/components/data-display/ScoreMeter/ScoreMeter.tsx';
import { TRAINERS } from '@shared/config/trainers.ts';
import { type ExamFormat, type RunSettings, type StoredAttempt } from '@shared/exam-run/types/examFormat.ts';
import { useAnnouncement } from '@shared/hooks/useAnnouncement.tsx';
import { cn } from '@shared/lib/cn.ts';
import { fmtClock } from '@shared/lib/format.ts';
import { type AttemptMode, type ExamPaper } from '@shared/types/exam.ts';
import { type TrainerId } from '@shared/types/trainer.ts';
import { Button } from '@shared/ui/button.tsx';
import { Card, CardContent } from '@shared/ui/card.tsx';

import { withTrainer } from '@features/mock-exam/lib/withTrainer.ts';

import { BARS_ANIMATION_DELAY, GRADE_TONE_CLASS, SCORE_COUNT_UP_MS, verdictSentence } from './results.ts';

interface AttemptResultsProps<
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
> {
  readonly trainer: TrainerId;
  readonly format: ExamFormat<TExam, TSettings, TAttempt>;
  readonly exam: TExam;
  readonly attempt: TAttempt;
  readonly settings: TSettings;
  readonly onRetry: (examId: number, mode: AttemptMode) => void;
}

/** What one finished attempt scored, and where to go next. */
const AttemptResults = <
  TExam extends ExamPaper,
  TSettings extends RunSettings,
  TAttempt extends StoredAttempt
>({
  trainer,
  format,
  exam,
  attempt,
  settings,
  onRetry
}: AttemptResultsProps<TExam, TSettings, TAttempt>) => {
  const summary = format.scoring.summarize(attempt);
  const base = TRAINERS[trainer].basePath;
  const { grade } = summary;
  /* Said once, after the heading the page focuses: the verdict is the news. */
  const announced = useAnnouncement(verdictSentence(summary));
  const modeLabel = attempt.mode === 'full' ? 'Full exam' : `${format.moduleName(attempt.mode)} (practice)`;

  return (
    <>
      <p role="status" className="sr-only">
        {announced}
      </p>

      <Card className="relative animate-pop-in overflow-hidden text-center shadow-lift">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: summary.accentColor }}
        />
        <CardContent className="space-y-4 pt-2">
          <h1 className="flex flex-col-reverse gap-1">
            <span className="text-3xl font-extrabold sm:text-4xl">Results</span>
            <span className="sr-only"> · </span>
            <span className="text-sm font-semibold text-muted-foreground">
              {withTrainer(format.examLabel(exam), TRAINERS[trainer].short)} · {modeLabel}
            </span>
          </h1>

          {grade ? (
            <>
              <p
                className={cn(
                  'font-heading text-5xl font-extrabold tracking-tight sm:text-6xl',
                  GRADE_TONE_CLASS[grade.tone]
                )}
              >
                {grade.label}
              </p>
              <p className="text-lg tabular-nums">
                {grade.points ? (
                  <>
                    <b className="font-heading">
                      <CountedNumber value={grade.points.total} durationMs={SCORE_COUNT_UP_MS} />
                    </b>{' '}
                    / {grade.points.of} points ·{' '}
                  </>
                ) : null}
                time used {fmtClock(summary.totalSeconds)}
              </p>
              {grade.notes.length > 0 ? (
                <ul lang="de" className="mx-auto max-w-xl space-y-1.5 text-left">
                  {grade.notes.map(note => (
                    <li key={note} className="rounded-xl bg-muted px-4 py-2 text-sm tabular-nums">
                      {note}
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <>
              <p className="font-heading text-5xl font-extrabold tracking-tight tabular-nums">
                {summary.headlineScore}
                {summary.headlineSuffix ? (
                  <span className="text-2xl font-bold text-muted-foreground">{summary.headlineSuffix}</span>
                ) : null}
              </p>
              <p className="text-muted-foreground">time used {fmtClock(summary.totalSeconds)}</p>
            </>
          )}
        </CardContent>
      </Card>

      <section aria-labelledby="results-parts" className="mt-6">
        <h2 id="results-parts" className="mb-3 text-xl font-extrabold">
          By part
        </h2>
        <Card className="animate-fade-up" style={{ animationDelay: BARS_ANIMATION_DELAY }}>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {summary.bars.map(bar => (
                <ScoreMeter
                  key={bar.label}
                  label={bar.label}
                  value={bar.value}
                  of={bar.of}
                  colorByScore
                  thresholdPercent={bar.thresholdPercent ?? summary.thresholdPercent}
                  thresholdLabel={bar.thresholdLabel ?? summary.thresholdLabel}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              The thin mark on each bar is that part’s pass line.
            </p>
          </CardContent>
        </Card>
      </section>

      {summary.moduleTimes.length > 0 ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <Clock aria-hidden className="size-4" />
          <b className="text-foreground">Time per module:</b>
          {summary.moduleTimes.map(entry => (
            <span key={entry.module} className="tabular-nums">
              {format.moduleShort(entry.module)} {fmtClock(entry.seconds)} /{' '}
              {String(format.minutes(entry.module, exam, settings))}:00
            </span>
          ))}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild size="lg">
          <Link to={`${base}/review/${String(attempt.id)}`}>
            <ListChecks aria-hidden /> Review answers &amp; transcripts
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            onRetry(attempt.examId, attempt.mode);
          }}
        >
          <RotateCcw aria-hidden /> Retry this exam
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link to={base || '/'}>
            <Home aria-hidden /> Dashboard
          </Link>
        </Button>
      </div>
    </>
  );
};

export default AttemptResults;

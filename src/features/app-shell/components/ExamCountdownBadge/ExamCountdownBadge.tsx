import { CalendarClock } from 'lucide-react';

import { Badge } from '@shared/ui/badge.tsx';

import { useExamCountdown } from './useExamCountdown.tsx';

interface ExamCountdownBadgeProps {
  /** `YYYY-MM-DD`. */
  readonly examDate: string;
}

const ExamCountdownBadge = ({ examDate }: ExamCountdownBadgeProps) => {
  const countdown = useExamCountdown(examDate);
  if (!countdown) return null;
  const { dateLabel, days, tone } = countdown;

  /* Phones show the number alone; the rest of the sentence stays for screen readers. */
  return (
    <Badge variant={tone} className="shrink-0 gap-1.5 px-2.5 py-1">
      <CalendarClock className="size-3.5" aria-hidden />
      {days >= 0 ? (
        <span>
          <span className="max-sm:sr-only">{dateLabel} · </span>
          <b className="font-heading font-extrabold tabular-nums">
            {days} day{days === 1 ? '' : 's'}
            <span className="max-sm:sr-only"> left</span>
          </b>
        </span>
      ) : (
        <span>
          Exam date passed<span className="max-sm:sr-only"> — update it in Settings</span>
        </span>
      )}
    </Badge>
  );
};

export default ExamCountdownBadge;

import { CalendarClock } from 'lucide-react';

import { Badge } from '@shared/ui';

import { useExamCountdown } from '../hooks/useExamCountdown.ts';

interface ExamCountdownBadgeProps {
  /** `YYYY-MM-DD`. */
  readonly examDate: string;
}

const ExamCountdownBadge = ({ examDate }: ExamCountdownBadgeProps) => {
  const countdown = useExamCountdown(examDate);
  if (!countdown) return null;
  const { dateLabel, days, tone } = countdown;

  return (
    <Badge variant={tone} className="gap-1.5 py-1">
      <CalendarClock className="size-3" aria-hidden />
      {days >= 0 ? (
        <span>
          {dateLabel} ·{' '}
          <b>
            {days} day{days === 1 ? '' : 's'} left
          </b>
        </span>
      ) : (
        <span>Exam date passed — update it in Settings</span>
      )}
    </Badge>
  );
};

export default ExamCountdownBadge;

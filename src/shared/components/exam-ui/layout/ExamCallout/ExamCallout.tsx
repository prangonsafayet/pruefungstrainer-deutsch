import { type ReactNode } from 'react';

import { cn } from '@shared/lib/cn.ts';

interface ExamCalloutProps {
  readonly children: ReactNode;
  readonly className?: string;
}

const ExamCallout = ({ children, className }: ExamCalloutProps) => (
  <div
    className={cn(
      'mb-6 rounded-xl border-l-4 border-primary bg-accent p-4 text-sm leading-relaxed text-accent-foreground [&_b]:text-foreground',
      className
    )}
  >
    {children}
  </div>
);

export default ExamCallout;

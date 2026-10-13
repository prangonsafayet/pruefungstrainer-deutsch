import { type ReactNode } from 'react';

import { cn } from '@shared/lib/cn.ts';

interface QuestionItemProps {
  readonly children: ReactNode;
  readonly className?: string;
}

const QuestionItem = ({ children, className }: QuestionItemProps) => (
  <div
    className={cn('space-y-3 border-t border-border py-5 first:border-t-0 first:pt-0 last:pb-0', className)}
  >
    {children}
  </div>
);

export default QuestionItem;

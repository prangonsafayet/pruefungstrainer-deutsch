import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@shared/lib/cn.ts';

type DivProps = ComponentPropsWithoutRef<'div'>;

const makeCardPart = (slot: string, base: string, displayName: string) => {
  const Part = forwardRef<HTMLDivElement, DivProps>(({ className, ...props }, ref) => {
    return <div ref={ref} data-slot={slot} className={cn(base, className)} {...props} />;
  });
  Part.displayName = displayName;
  return Part;
};

export const Card = makeCardPart(
  'card',
  /* Separated by tone and a soft shadow, not a grey box. The border is transparent so callers
     can colour one side (`border-l-4 border-l-primary`); dark mode's hairline lives in
     `--shadow-soft` for the same reason. */
  'flex flex-col gap-5 rounded-2xl border border-transparent bg-card py-5 text-card-foreground shadow-soft sm:gap-6 sm:py-6',
  'Card'
);
export const CardHeader = makeCardPart('card-header', 'flex flex-col gap-1.5 px-5 sm:px-6', 'CardHeader');
export const CardTitle = makeCardPart('card-title', 'font-heading font-bold leading-snug', 'CardTitle');
export const CardDescription = makeCardPart(
  'card-description',
  'text-sm text-muted-foreground',
  'CardDescription'
);
export const CardAction = makeCardPart(
  'card-action',
  'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
  'CardAction'
);
export const CardContent = makeCardPart('card-content', 'px-5 sm:px-6', 'CardContent');
export const CardFooter = makeCardPart('card-footer', 'flex items-center px-5 sm:px-6', 'CardFooter');

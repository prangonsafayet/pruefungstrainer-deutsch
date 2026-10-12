import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/lib/cn.ts';

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-xl border-l-4 px-4 py-3.5 text-sm sm:px-5 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'border-l-primary bg-card text-card-foreground shadow-soft',
        info: 'border-l-primary bg-accent/60 text-foreground',
        warning:
          'border-l-warning bg-[color-mix(in_oklab,var(--warning)_12%,transparent)] text-foreground [&>svg]:text-warning-foreground',
        success:
          'border-l-success bg-[color-mix(in_oklab,var(--success)_10%,transparent)] text-foreground [&>svg]:text-success-foreground',
        destructive:
          'border-l-destructive bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] text-foreground [&>svg]:text-destructive-on-tint'
      }
    },
    defaultVariants: { variant: 'default' }
  }
);

export interface AlertProps extends ComponentPropsWithoutRef<'div'>, VariantProps<typeof alertVariants> {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
});

export const AlertTitle = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-title"
        className={cn('col-start-2 min-h-4 font-heading font-bold', className)}
        {...props}
      />
    );
  }
);

export const AlertDescription = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="alert-description"
        className={cn(
          'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed',
          className
        )}
        {...props}
      />
    );
  }
);

export { alertVariants };

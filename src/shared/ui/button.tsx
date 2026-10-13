import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/lib/cn.ts';

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-heading text-sm font-bold outline-none transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90',
        outline: 'border bg-card shadow-soft hover:bg-accent hover:text-accent-foreground',
        /* A soft indigo tint: the quiet sibling of the default fill. */
        secondary: 'bg-accent text-accent-foreground hover:bg-accent/70',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-success-on-fill shadow-soft hover:bg-success/90'
      },
      size: {
        default: 'h-10 px-4 py-2 has-[>svg]:px-3.5',
        sm: 'h-9 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5',
        lg: 'h-12 px-6 text-base has-[>svg]:px-5',
        icon: 'size-10'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;

export interface ButtonProps extends ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a `<button>`, keeping the styling. */
  readonly asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

export { buttonVariants };

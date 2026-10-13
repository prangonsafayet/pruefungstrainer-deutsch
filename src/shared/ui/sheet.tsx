import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@shared/lib/cn.ts';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = forwardRef<
  ComponentRef<typeof SheetPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-scrim backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
        className
      )}
      {...props}
    />
  );
});

type SheetSide = 'right' | 'bottom';

const SIDE_CLASSES: Readonly<Record<SheetSide, string>> = {
  right:
    'inset-y-0 right-0 h-full w-[min(100%,28rem)] rounded-l-2xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  bottom:
    'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-3xl pb-[env(safe-area-inset-bottom)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom'
};

export const SheetContent = forwardRef<
  ComponentRef<typeof SheetPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    readonly side?: SheetSide;
    readonly closeLabel?: string;
  }
>(({ className, children, side = 'right', closeLabel = 'Close', ...props }, ref) => {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col bg-card shadow-pop ease-out data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:duration-200',
          SIDE_CLASSES[side],
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          aria-label={closeLabel}
        >
          <XIcon className="size-5" aria-hidden />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});

export const SheetHeader = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div data-slot="sheet-header" className={cn('flex flex-col gap-1 p-5 pr-14', className)} {...props} />
);

export const SheetFooter = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    data-slot="sheet-footer"
    className={cn('mt-auto flex flex-wrap gap-2 p-5 pt-3', className)}
    {...props}
  />
);

export const SheetTitle = forwardRef<
  ComponentRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn('font-heading text-lg font-bold', className)}
      {...props}
    />
  );
});

export const SheetDescription = forwardRef<
  ComponentRef<typeof SheetPrimitive.Description>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});

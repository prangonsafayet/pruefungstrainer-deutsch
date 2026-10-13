import { Toaster as Sonner, type ToasterProps } from 'sonner';

/** App-wide toast host. Mounted once, near the router. */
export const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    position="top-center"
    toastOptions={{
      classNames: {
        toast:
          'group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:bg-popover group-[.toaster]:font-sans group-[.toaster]:text-popover-foreground group-[.toaster]:shadow-pop',
        description: 'group-[.toast]:text-muted-foreground'
      }
    }}
    {...props}
  />
);

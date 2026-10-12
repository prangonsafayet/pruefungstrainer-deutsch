import { type ReactNode } from 'react';

interface PageTitleProps {
  readonly children: ReactNode;
  readonly lead?: ReactNode;
}

const PageTitle = ({ children, lead }: PageTitleProps) => (
  <div className="mb-6 sm:mb-8">
    <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">{children}</h1>
    {lead ? <p className="mt-2 max-w-3xl text-muted-foreground sm:text-lg">{lead}</p> : null}
  </div>
);

export default PageTitle;

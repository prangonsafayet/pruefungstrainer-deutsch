import { type ReactNode } from 'react';

interface ReadingTextProps {
  readonly title?: string;
  readonly children: ReactNode;
}

/** A reading passage or a note sheet: a quiet surface at a comfortable measure. */
const ReadingText = ({ title, children }: ReadingTextProps) => (
  <div className="my-4 max-w-3xl rounded-xl bg-muted p-4 leading-relaxed hyphens-auto [overflow-wrap:anywhere] first:mt-0 sm:p-5">
    {title ? <h3 className="mb-2 text-base font-bold">{title}</h3> : null}
    {children}
  </div>
);

export default ReadingText;

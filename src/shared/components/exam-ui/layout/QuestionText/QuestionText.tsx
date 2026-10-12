import { type ReactNode } from 'react';

const QuestionText = ({ children }: { readonly children: ReactNode }) => (
  <p className="font-semibold leading-relaxed [overflow-wrap:anywhere]">{children}</p>
);

export default QuestionText;

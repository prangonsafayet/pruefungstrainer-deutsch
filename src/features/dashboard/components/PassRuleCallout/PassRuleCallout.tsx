import { useId } from 'react';

import { Target } from 'lucide-react';

import { type PassRuleSummary } from '@shared/config/examConditions.ts';

interface PassRuleCalloutProps {
  readonly rule: PassRuleSummary;
}

/** The paper's pass rule as a few rows to scan, instead of one bold sentence in the lead. */
const PassRuleCallout = ({ rule }: PassRuleCalloutProps) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="mb-6 rounded-2xl border-l-4 border-l-primary bg-card p-4 shadow-soft sm:p-5"
    >
      <h2 id={headingId} className="flex items-center gap-2 text-base font-bold">
        <Target className="size-4 shrink-0 text-primary" aria-hidden />
        {rule.title}
      </h2>
      <dl className="mt-3 grid gap-2 sm:auto-cols-fr sm:grid-flow-col">
        {rule.rows.map(row => (
          <div key={row.part} className="rounded-xl bg-muted px-3 py-2">
            <dt className="text-xs font-semibold text-muted-foreground">{row.part}</dt>
            <dd className="font-heading font-bold tabular-nums">{row.line}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-sm text-muted-foreground">{rule.note}</p>
    </section>
  );
};

export default PassRuleCallout;

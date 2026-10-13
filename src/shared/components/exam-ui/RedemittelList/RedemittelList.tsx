interface RedemittelListProps {
  readonly items: readonly string[];
}

/** The highlighted phrase suggestions of a speaking Teil. */
const RedemittelList = ({ items }: RedemittelListProps) => (
  <div className="my-4 rounded-xl border-l-4 border-warning bg-[color-mix(in_oklab,var(--warning)_14%,var(--card))] p-4">
    <p className="font-heading text-sm font-bold">Redemittel</p>
    <ul className="mt-1.5 list-disc space-y-1 pl-5 leading-relaxed">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

export default RedemittelList;

interface PunkteGridProps {
  readonly items: readonly string[];
}

/** The task-point cards of a speaking Teil. */
const PunkteGrid = ({ items }: PunkteGridProps) => (
  <ul className="my-4 grid gap-2 sm:grid-cols-2">
    {items.map((item, index) => (
      <li key={index} className="rounded-xl bg-muted px-4 py-3 leading-relaxed [overflow-wrap:anywhere]">
        {item}
      </li>
    ))}
  </ul>
);

export default PunkteGrid;

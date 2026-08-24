import Stat from "../primitives/Stat";

/* StatsRow — the dashboard's top line: stats in an even grid. */

export type StatDef = {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
};

export function StatsRow({
  stats,
  className = "",
}: {
  stats: StatDef[];
  className?: string;
}) {
  return (
    <div
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))` }}
    >
      {stats.map((s) => (
        <Stat key={s.label} label={s.label} value={s.value} delta={s.delta} hint={s.hint} />
      ))}
    </div>
  );
}

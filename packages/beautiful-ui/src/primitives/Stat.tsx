import type { ReactNode } from "react";
import { Delta } from "../atoms/Delta";

/* Stat — label, big tabular value, optional delta. The dashboard atom. */

export default function Stat({
  label,
  value,
  delta,
  hint,
  className = "",
}: {
  label: ReactNode;
  value: ReactNode;
  delta?: number;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card border border-line bg-surface p-4 shadow-hairline ${className}`}>
      <p className="text-[11.5px] font-medium text-ink-3">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[22px] font-semibold tracking-tight tabular-nums text-ink">
          {value}
        </span>
        {delta != null && <Delta value={delta} />}
      </div>
      {hint ? <p className="mt-0.5 text-[11px] text-ink-3">{hint}</p> : null}
    </div>
  );
}

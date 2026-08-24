import type { ReactNode } from "react";

/* PageHeader — title, description and the page's primary actions. */

export default function PageHeader({
  title,
  description,
  actions,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div className="min-w-0">
        <h1 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h1>
        {description ? (
          <p className="mt-0.5 text-[12.5px] text-ink-3">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

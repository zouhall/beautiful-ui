"use client";

import type { ReactNode } from "react";

/* EmptyState — the zero-data moment: icon well, title, one line of
 * guidance, one clear action. */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
      {icon ? (
        <span className="mb-3 flex size-10 items-center justify-center rounded-card border border-line bg-inset text-ink-3">
          {icon}
        </span>
      ) : null}
      <p className="text-[13.5px] font-medium text-ink">{title}</p>
      {description ? (
        <p className="mt-1 max-w-64 text-[12.5px] leading-relaxed text-ink-3">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

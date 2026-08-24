"use client";

import type { ReactNode } from "react";

/* SettingsSection — the settings-page unit: a section header, then rows
 * of label + description with their control on the right. */

export function SettingsSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-card border border-line bg-surface shadow-hairline ${className}`}>
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-[13px] font-semibold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-[12px] text-ink-3">{description}</p> : null}
      </div>
      <div className="divide-y divide-line px-4">{children}</div>
    </section>
  );
}

export function SettingsRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="min-w-0">
        <p className="text-[12.5px] font-medium text-ink-2">{label}</p>
        {description ? <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-3">{description}</p> : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

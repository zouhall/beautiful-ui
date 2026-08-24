"use client";

import { Avatar } from "../atoms/Avatar";
import { StatusPill } from "../atoms/StatusPill";

/* ProjectCard — name, status, progress, who's on it, when it moved. */

export type ProjectStatus = "on-track" | "at-risk" | "done";

const STATUS: Record<ProjectStatus, { label: string; tone: "green" | "orange" | "neutral" }> = {
  "on-track": { label: "On track", tone: "green" },
  "at-risk": { label: "At risk", tone: "orange" },
  done: { label: "Done", tone: "neutral" },
};

export function ProjectCard({
  name,
  description,
  status = "on-track",
  progress = 0,
  members = [],
  updated,
  className = "",
}: {
  name: string;
  description?: string;
  status?: ProjectStatus;
  /** 0–1 */
  progress?: number;
  members?: string[];
  updated?: string;
  className?: string;
}) {
  const s = STATUS[status];
  return (
    <div className={`flex flex-col rounded-card border border-line bg-surface p-4 shadow-hairline transition-shadow hover:shadow-card ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-[13.5px] font-semibold tracking-tight text-ink">{name}</p>
        <StatusPill tone={s.tone}>{s.label}</StatusPill>
      </div>
      {description ? (
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-3">{description}</p>
      ) : null}
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-inset">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {members.slice(0, 4).map((m) => (
            <span key={m} className="rounded-full ring-2 ring-surface">
              <Avatar fallback={m} size={22} />
            </span>
          ))}
        </div>
        {updated ? <span className="text-[11px] tabular-nums text-ink-3">{updated}</span> : null}
      </div>
    </div>
  );
}

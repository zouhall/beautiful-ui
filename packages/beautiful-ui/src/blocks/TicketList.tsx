"use client";

import { Avatar } from "../atoms/Avatar";
import { Badge } from "../atoms/Badge";
import { IconCheck } from "../atoms/icons";

/* TicketList — Linear-style rows: status glyph, id, title, labels,
 * priority bars, assignee, date. Flat and scannable. */

export type TicketStatus = "backlog" | "todo" | "progress" | "done";

export type Ticket = {
  id: string;
  title: string;
  status: TicketStatus;
  /** 0 none · 1 low · 2 medium · 3 high */
  priority?: 0 | 1 | 2 | 3;
  labels?: string[];
  assignee?: string;
  date?: string;
};

function StatusGlyph({ status }: { status: TicketStatus }) {
  if (status === "done")
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-green text-white">
        <IconCheck size={9} strokeWidth={3.4} />
      </span>
    );
  if (status === "progress")
    return (
      <span className="relative size-4 rounded-full border-2 border-orange">
        <span className="absolute inset-0 block rounded-full border-2 border-transparent border-t-transparent" style={{ borderTopColor: "transparent" }} />
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange" />
      </span>
    );
  if (status === "todo") return <span className="block size-4 rounded-full border-2 border-line-strong" />;
  return <span className="block size-4 rounded-full border-2 border-dashed border-line-strong" />;
}

function PriorityBars({ level = 0 }: { level?: 0 | 1 | 2 | 3 }) {
  return (
    <span className="flex items-end gap-[2px]" aria-label={`Priority ${level}`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full ${i <= level ? "bg-ink-2" : "bg-line-strong"}`}
          style={{ height: 4 + i * 3 }}
        />
      ))}
    </span>
  );
}

export function TicketList({
  tickets,
  title = "Tickets",
  className = "",
}: {
  tickets: Ticket[];
  title?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-card border border-line bg-surface shadow-card ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-[12.5px] font-medium text-ink-2">{title}</p>
        <Badge>{tickets.length}</Badge>
      </div>
      <ul className="divide-y divide-line">
        {tickets.map((t) => (
          <li key={t.id} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-hover">
            <StatusGlyph status={t.status} />
            <span className="w-14 shrink-0 font-mono text-[11px] tabular-nums text-ink-3">{t.id}</span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{t.title}</span>
            {t.labels?.map((l) => (
              <Badge key={l}>{l}</Badge>
            ))}
            <PriorityBars level={t.priority} />
            {t.assignee ? <Avatar fallback={t.assignee} size={22} /> : null}
            {t.date ? <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-ink-3">{t.date}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

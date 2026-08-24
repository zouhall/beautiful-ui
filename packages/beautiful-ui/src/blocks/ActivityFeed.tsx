import type { ReactNode } from "react";
import { Avatar } from "../atoms/Avatar";

/* ActivityFeed — who did what, when. Rows on the divide, not cards. */

export type ActivityItem = {
  id: string;
  initials: string;
  name: string;
  action: ReactNode;
  time: string;
};

export function ActivityFeed({
  items,
  title = "Activity",
  className = "",
}: {
  items: ActivityItem[];
  title?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-card border border-line bg-surface shadow-card ${className}`}>
      <div className="border-b border-line px-4 py-3">
        <p className="text-[12.5px] font-medium text-ink-2">{title}</p>
      </div>
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 px-4 py-2.5">
            <Avatar fallback={item.initials} size={26} />
            <p className="min-w-0 flex-1 truncate text-[12.5px] text-ink-2">
              <span className="font-medium text-ink">{item.name}</span> {item.action}
            </p>
            <span className="shrink-0 text-[11px] tabular-nums text-ink-3">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { Avatar } from "../atoms/Avatar";
import { StatusPill } from "../atoms/StatusPill";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../atoms/Select";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from "../atoms/Menu";

/* MemberList — team management rows: who, status, role (editable),
 * last active, and a row menu. */

export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
};

const STATUS_TONE: Record<Member["status"], "green" | "orange" | "red"> = {
  active: "green",
  invited: "orange",
  suspended: "red",
};

const ROLES = ["Owner", "Admin", "Member", "Viewer"];

export function MemberList({
  members,
  title = "Members",
  className = "",
}: {
  members: Member[];
  title?: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-card border border-line bg-surface shadow-hairline ${className}`}>
      <div className="border-b border-line px-4 py-3">
        <p className="text-[12.5px] font-medium text-ink-2">{title}</p>
      </div>
      <ul className="divide-y divide-line">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
            <Avatar fallback={m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)} size={28} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-ink">{m.name}</p>
              <p className="truncate text-[11.5px] text-ink-3">{m.email}</p>
            </div>
            <StatusPill tone={STATUS_TONE[m.status]}>{m.status}</StatusPill>
            <Select defaultValue={m.role}>
              <SelectTrigger className="w-28" />
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="hidden w-16 shrink-0 text-right text-[11px] tabular-nums text-ink-3 sm:block">
              {m.lastActive}
            </span>
            <Menu>
              <MenuTrigger
                aria-label={`Actions for ${m.name}`}
                className="flex size-7 items-center justify-center rounded-chip text-ink-3 transition-colors hover:bg-hover hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <circle cx="12" cy="5" r="1.6" />
                  <circle cx="12" cy="12" r="1.6" />
                  <circle cx="12" cy="19" r="1.6" />
                </svg>
              </MenuTrigger>
              <MenuContent align="end">
                <MenuItem>View profile</MenuItem>
                <MenuItem>Message</MenuItem>
                <MenuSeparator />
                <MenuItem destructive>Remove from workspace</MenuItem>
              </MenuContent>
            </Menu>
          </li>
        ))}
      </ul>
    </div>
  );
}

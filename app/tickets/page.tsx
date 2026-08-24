import type { Metadata } from "next";
import AppShell from "@/components/primitives/AppShell";
import PageHeader from "@/components/primitives/PageHeader";
import SidebarNav from "@/components/primitives/SidebarNav";
import { TicketList } from "@/components/blocks/TicketList";
import { FilterToolbar } from "@/components/blocks/FilterToolbar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar } from "@/components/atoms/Avatar";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Tickets — Beautiful UI template",
  description: "Linear-style ticket list template on the Beautiful UI tokens.",
};

export default function TicketsPage() {
  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <>
          <Input placeholder="Search tickets…" aria-label="Search tickets" className="max-w-56" />
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Avatar fallback="SK" size={26} />
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <PageHeader
          title="Tickets"
          description="This cycle's work, flat and scannable."
          actions={<Button variant="accent" size="sm">New ticket</Button>}
        />
        <FilterToolbar />
        <TicketList
          tickets={[
            { id: "BUI-101", title: "Theme engine: neutral hue + tint sliders", status: "done", priority: 3, labels: ["studio"], assignee: "SK", date: "Aug 24" },
            { id: "BUI-102", title: "Overlay atoms on Base UI", status: "done", priority: 3, labels: ["atoms"], assignee: "TB", date: "Aug 24" },
            { id: "BUI-103", title: "Filter toolbar: close popover on choose", status: "done", priority: 2, labels: ["blocks", "bug"], assignee: "AI", date: "Aug 24" },
            { id: "BUI-104", title: "ink-3 contrast to WCAG AA", status: "done", priority: 2, labels: ["tokens", "a11y"], assignee: "SK", date: "Aug 24" },
            { id: "BUI-105", title: "Templates: settings and auth pages", status: "progress", priority: 2, labels: ["templates"], assignee: "TB", date: "Aug 25" },
            { id: "BUI-106", title: "Chart card: area and line variants", status: "todo", priority: 1, labels: ["blocks"], assignee: "AN", date: "Aug 26" },
            { id: "BUI-107", title: "Studio: templates mode with live re-theming", status: "todo", priority: 1, labels: ["studio"], assignee: "SK", date: "Aug 27" },
            { id: "BUI-108", title: "Mobile nav drawer for AppShell", status: "backlog", priority: 0, labels: ["shell"], assignee: "AI", date: "Aug 28" },
          ]}
        />
      </div>
    </AppShell>
  );
}

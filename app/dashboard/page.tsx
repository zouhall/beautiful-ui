import type { Metadata } from "next";
import AppShell from "@/components/primitives/AppShell";
import PageHeader from "@/components/primitives/PageHeader";
import SidebarNav from "@/components/primitives/SidebarNav";
import RecordsTable from "@/components/primitives/RecordsTable";
import { StatsRow } from "@/components/blocks/StatsRow";
import { ChartCard } from "@/components/blocks/ChartCard";
import { ActivityFeed } from "@/components/blocks/ActivityFeed";
import { FilterToolbar } from "@/components/blocks/FilterToolbar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar } from "@/components/atoms/Avatar";

export const metadata: Metadata = {
  title: "Dashboard — Beautiful UI template",
  description:
    "The app-skeleton template: AppShell + PageHeader + stats, chart, activity and records blocks, all on the Beautiful UI tokens.",
};

/* The template: every section is one block from packages/beautiful-ui.
 * Copy this page, swap the data, ship. */

export default function DashboardPage() {
  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <>
          <Input placeholder="Search…" className="max-w-56" />
          <div className="ml-auto flex items-center gap-3">
            <Avatar fallback="SK" size={26} />
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <PageHeader
          title="Overview"
          description="Revenue, usage and what the team is up to."
          actions={
            <>
              <Button variant="secondary" size="sm">Export</Button>
              <Button variant="accent" size="sm">New report</Button>
            </>
          }
        />

        <StatsRow
          stats={[
            { label: "Revenue", value: "$18,240", delta: 9.4, hint: "vs. last month" },
            { label: "Active users", value: "1,424", delta: 5.2, hint: "vs. last month" },
            { label: "Churn", value: "1.9%", delta: -0.4, hint: "vs. last month" },
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <ChartCard
            title="Revenue"
            value="$18,240"
            delta={9.4}
            data={[32, 48, 41, 56, 47, 62, 58, 71, 66, 78, 72, 84]}
          />
          <ActivityFeed
            items={[
              { id: "1", initials: "SK", name: "Skander", action: "merged the studio theme engine", time: "2m" },
              { id: "2", initials: "TB", name: "Turbo", action: "shipped 16 overlay atoms", time: "18m" },
              { id: "3", initials: "AI", name: "Agent", action: "re-themed 46 components to Warm", time: "1h" },
              { id: "4", initials: "AN", name: "Ana", action: "commented on the dashboard template", time: "3h" },
              { id: "5", initials: "SK", name: "Skander", action: "closed the Q3 pricing review", time: "5h" },
            ]}
          />
        </div>

        <div className="space-y-3">
          <FilterToolbar />
          <RecordsTable variant="Clients" />
        </div>
      </div>
    </AppShell>
  );
}

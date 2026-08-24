import type { Metadata } from "next";
import AppShell from "@/components/primitives/AppShell";
import PageHeader from "@/components/primitives/PageHeader";
import SidebarNav from "@/components/primitives/SidebarNav";
import RecordsTable from "@/components/primitives/RecordsTable";
import { StatsRow } from "@/components/blocks/StatsRow";
import { InsightChartCard } from "@/components/blocks/InsightChartCard";
import { ChartCard } from "@/components/blocks/ChartCard";
import { ActivityFeed } from "@/components/blocks/ActivityFeed";
import { FilterToolbar } from "@/components/blocks/FilterToolbar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar } from "@/components/atoms/Avatar";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Dashboard — Beautiful UI template",
  description:
    "The app-skeleton template: AppShell + PageHeader + stats, chart, activity and records blocks, all on the Beautiful UI tokens.",
};

const REVENUE_SERIES = [
  { label: "Jan", value: 9200 },
  { label: "Feb", value: 12400 },
  { label: "Mar", value: 11100 },
  { label: "Apr", value: 14800 },
  { label: "May", value: 13900 },
  { label: "Jun", value: 18240 },
  { label: "Jul", value: 17100 },
  { label: "Aug", value: 21400 },
  { label: "Sep", value: 19800 },
  { label: "Oct", value: 24200 },
  { label: "Nov", value: 22800 },
  { label: "Dec", value: 28700 },
];

const SESSIONS_BARS = [
  { label: "M", value: 4200 },
  { label: "T", value: 5800 },
  { label: "W", value: 5100 },
  { label: "T", value: 7400 },
  { label: "F", value: 6900 },
  { label: "S", value: 8412 },
  { label: "S", value: 7900 },
];

export default function DashboardPage() {
  return (
    <AppShell
      sidebar={<SidebarNav fill />}
      header={
        <>
          <Input placeholder="Search…" aria-label="Search" className="max-w-56" />
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Avatar fallback="SK" size={26} />
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-6xl space-y-6 p-6 sm:p-8">
        {/* Page Top Header */}
        <PageHeader
          title="Overview"
          description="Real-time revenue, activity velocity, and customer records."
          actions={
            <>
              <Button variant="secondary" size="sm">Export</Button>
              <Button variant="accent" size="sm">New report</Button>
            </>
          }
        />

        {/* Primary KPIs */}
        <StatsRow
          stats={[
            { label: "Total Revenue", value: "$28,712", delta: 14.8, hint: "vs. last period" },
            { label: "Active Clients", value: "1,424", delta: 5.2, hint: "vs. last month" },
            { label: "Session Velocity", value: "8,412 /wk", delta: 4.1, hint: "avg 12m duration" },
            { label: "Churn Rate", value: "1.9%", delta: -0.4, hint: "industry low" },
          ]}
        />

        {/* Charts & Activity Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          <InsightChartCard
            title="Revenue vs Ad Spend Trajectory"
            badgeLabel="Liveline Live"
            seriesList={[
              {
                id: "rev",
                name: "Revenue",
                color: "#3d9aff",
                data: [14200, 16800, 15400, 19200, 18500, 24100, 22800, 28712],
              },
              {
                id: "spend",
                name: "Ad Spend",
                color: "#f68f3c",
                data: [4200, 5100, 4800, 6900, 6200, 8400, 7800, 9650],
              },
            ]}
            periods={["6M", "YTD", "1Y"]}
            className="lg:col-span-2"
          />
          <ChartCard
            title="Daily Sessions"
            value="8,412"
            delta={4.1}
            variant="bar"
            series="accent"
            data={SESSIONS_BARS}
            periods={["7D", "30D"]}
          />
        </div>

        {/* Full-width interactive records table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
                Active Client Records
              </span>
              <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10.5px] font-medium text-accent-ink">
                Live sync
              </span>
            </div>
            <FilterToolbar />
          </div>

          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <RecordsTable variant="Clients" unconstrained fill={false} />
          </div>
        </div>

        {/* Activity velocity row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ActivityFeed
            title="Recent System Actions"
            items={[
              { id: "1", initials: "SK", name: "Skander", action: "merged the studio theme engine", time: "2m ago" },
              { id: "2", initials: "TB", name: "Turbo", action: "shipped 16 overlay atoms and chart cards", time: "18m ago" },
              { id: "3", initials: "AI", name: "Agent", action: "re-themed 46 components to Warm preset", time: "1h ago" },
              { id: "4", initials: "AN", name: "Ana", action: "commented on the client roster schema", time: "3h ago" },
            ]}
          />
          <ActivityFeed
            title="Agentic Workstream Trace"
            items={[
              { id: "a1", initials: "AI", name: "Codex Sol", action: "resolved customer verification batch", time: "4m ago" },
              { id: "a2", initials: "AI", name: "Fable 5", action: "synchronized vector context for 12 clients", time: "22m ago" },
              { id: "a3", initials: "SK", name: "Skander", action: "approved payment disbursement in /harness", time: "2h ago" },
            ]}
          />
        </div>
      </div>
    </AppShell>
  );
}

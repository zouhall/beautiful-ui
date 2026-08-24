import type { Metadata } from "next";
import AppShell from "@/components/primitives/AppShell";
import PageHeader from "@/components/primitives/PageHeader";
import SidebarNav from "@/components/primitives/SidebarNav";
import { MemberList } from "@/components/blocks/MemberList";
import { StatsRow } from "@/components/blocks/StatsRow";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar } from "@/components/atoms/Avatar";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Team — Beautiful UI template",
  description: "Team management template: members, roles and status on the Beautiful UI tokens.",
};

export default function TeamPage() {
  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <>
          <Input placeholder="Search members…" aria-label="Search members" className="max-w-56" />
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Avatar fallback="SK" size={26} />
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <PageHeader
          title="Team"
          description="Who's in the workspace and what they can do."
          actions={<Button variant="accent" size="sm">Invite member</Button>}
        />
        <StatsRow
          stats={[
            { label: "Members", value: "8" },
            { label: "Active this week", value: "6", delta: 12.5 },
            { label: "Pending invites", value: "2" },
          ]}
        />
        <MemberList
          members={[
            { id: "1", name: "Skander K.", email: "skander@vizion.io", role: "Owner", status: "active", lastActive: "now" },
            { id: "2", name: "Turbo B.", email: "turbo@vizion.io", role: "Admin", status: "active", lastActive: "2m" },
            { id: "3", name: "Ana N.", email: "ana@vizion.io", role: "Member", status: "active", lastActive: "1h" },
            { id: "4", name: "Agent", email: "agent@vizion.io", role: "Member", status: "active", lastActive: "3h" },
            { id: "5", name: "Mira L.", email: "mira@partner.co", role: "Viewer", status: "invited", lastActive: "—" },
            { id: "6", name: "Jo D.", email: "jo@contractor.dev", role: "Viewer", status: "suspended", lastActive: "21d" },
          ]}
        />
      </div>
    </AppShell>
  );
}

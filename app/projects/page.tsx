import type { Metadata } from "next";
import AppShell from "@/components/primitives/AppShell";
import PageHeader from "@/components/primitives/PageHeader";
import SidebarNav from "@/components/primitives/SidebarNav";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { FilterToolbar } from "@/components/blocks/FilterToolbar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar } from "@/components/atoms/Avatar";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Projects — Beautiful UI template",
  description: "Project grid template: status, progress and ownership on the Beautiful UI tokens.",
};

export default function ProjectsPage() {
  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <>
          <Input placeholder="Search projects…" aria-label="Search projects" className="max-w-56" />
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Avatar fallback="SK" size={26} />
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-5xl space-y-4 p-6">
        <PageHeader
          title="Projects"
          description="Everything in flight across the workspace."
          actions={<Button variant="accent" size="sm">New project</Button>}
        />
        <FilterToolbar />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ProjectCard name="Studio theme engine" description="Hue and tint sliders regenerate the whole neutral ramp, light and dark." status="done" progress={1} members={["SK", "TB"]} updated="2h ago" />
          <ProjectCard name="Overlay atoms" description="Popover, Tooltip, Menu, Dialog and Drawer on Base UI behavior." status="done" progress={1} members={["SK", "AI"]} updated="5h ago" />
          <ProjectCard name="Dashboard blocks" description="Chart cards, stat rows, activity feeds and the filter toolbar." status="on-track" progress={0.72} members={["TB", "AN", "AI"]} updated="1d ago" />
          <ProjectCard name="Template set" description="Dashboard, projects, tickets, team, settings and auth pages." status="on-track" progress={0.45} members={["SK"]} updated="1d ago" />
          <ProjectCard name="Chart system" description="Hand-rolled SVG and div charts that theme through the tokens." status="at-risk" progress={0.3} members={["AN"]} updated="2d ago" />
          <ProjectCard name="Docs site" description="Every block and template documented with live examples." status="on-track" progress={0.12} members={["TB", "SK"]} updated="4d ago" />
        </div>
      </div>
    </AppShell>
  );
}

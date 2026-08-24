import type { Metadata } from "next";
import AppShell from "@/components/primitives/AppShell";
import PageHeader from "@/components/primitives/PageHeader";
import SidebarNav from "@/components/primitives/SidebarNav";
import { SettingsSection, SettingsRow } from "@/components/blocks/SettingsSection";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Switch } from "@/components/atoms/Switch";
import { Avatar } from "@/components/atoms/Avatar";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/atoms/Select";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const metadata: Metadata = {
  title: "Settings — Beautiful UI template",
  description: "Settings page template: sections of label/control rows on the Beautiful UI tokens.",
};

export default function SettingsPage() {
  return (
    <AppShell
      sidebar={<SidebarNav />}
      header={
        <>
          <Input placeholder="Search settings…" aria-label="Search settings" className="max-w-56" />
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Avatar fallback="SK" size={26} />
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <PageHeader title="Settings" description="Workspace preferences and danger zone." />

        <SettingsSection title="Workspace" description="Shown to every member.">
          <SettingsRow
            label="Name"
            description="The workspace's display name."
            control={<Input defaultValue="Beautiful UI" className="w-44" aria-label="Workspace name" />}
          />
          <SettingsRow
            label="Region"
            description="Where sessions are processed."
            control={
              <Select defaultValue="eu">
                <SelectTrigger className="w-40" />
                <SelectContent>
                  <SelectItem value="eu">EU (Frankfurt)</SelectItem>
                  <SelectItem value="us">US (Virginia)</SelectItem>
                  <SelectItem value="ap">AP (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </SettingsSection>

        <SettingsSection title="Notifications" description="What lands in your inbox.">
          <SettingsRow
            label="Weekly digest"
            description="A Monday summary of workspace activity."
            control={<Switch defaultChecked label="Weekly digest" />}
          />
          <SettingsRow
            label="Mentions"
            description="When someone @-mentions you in a session."
            control={<Switch defaultChecked label="Mentions" />}
          />
          <SettingsRow
            label="Agent completions"
            description="When a background agent finishes a run."
            control={<Switch label="Agent completions" />}
          />
        </SettingsSection>

        <SettingsSection title="API" description="Programmatic access to this workspace.">
          <SettingsRow
            label="API key"
            description="Rotate immediately if it ever leaks."
            control={
              <div className="flex items-center gap-2">
                <Input defaultValue="bui_sk_9f2c…" readOnly className="w-40 font-mono text-[11.5px]" aria-label="API key" />
                <Button variant="secondary" size="sm">Rotate</Button>
              </div>
            }
          />
        </SettingsSection>

        <SettingsSection title="Danger zone">
          <SettingsRow
            label="Delete workspace"
            description="Removes every project, ticket and session. No undo."
            control={<Button variant="danger" size="sm">Delete</Button>}
          />
        </SettingsSection>
      </div>
    </AppShell>
  );
}

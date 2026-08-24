"use client";

import type { ComponentType, ReactNode } from "react";

/* ─────────────────────────────────────────────────────────
 * PLAYGROUND CATALOG
 * Every component the studio can render, plus a control
 * schema so the props panel knows which knobs to show.
 * ───────────────────────────────────────────────────────── */

/* atoms */
import { Accordion, AccordionItem } from "@/components/atoms/Accordion";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Chip } from "@/components/atoms/Chip";
import { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/atoms/Dialog";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerTitle, DrawerDescription } from "@/components/atoms/Drawer";
import { Input } from "@/components/atoms/Input";
import { Kbd } from "@/components/atoms/Kbd";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from "@/components/atoms/Menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/atoms/Popover";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { RadioGroup, RadioItem } from "@/components/atoms/RadioGroup";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/atoms/Select";
import { Separator } from "@/components/atoms/Separator";
import { Shimmer } from "@/components/atoms/Shimmer";
import { Slider } from "@/components/atoms/Slider";
import { StatusPill } from "@/components/atoms/StatusPill";
import { StreamText } from "@/components/atoms/StreamText";
import { Switch } from "@/components/atoms/Switch";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/atoms/Tabs";
import { TextRow } from "@/components/atoms/TextRow";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/atoms/Tooltip";

/* blocks */
import { ActivityFeed } from "@/components/blocks/ActivityFeed";
import { AuthCard } from "@/components/blocks/AuthCard";
import { ChartCard } from "@/components/blocks/ChartCard";
import { EmptyState } from "@/components/blocks/EmptyState";
import { FilterToolbar } from "@/components/blocks/FilterToolbar";
import { InsightChartCard } from "@/components/blocks/InsightChartCard";
import { MemberList } from "@/components/blocks/MemberList";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { SettingsSection, SettingsRow } from "@/components/blocks/SettingsSection";
import { StatsRow } from "@/components/blocks/StatsRow";
import { TicketList } from "@/components/blocks/TicketList";

/* primitives */
import ApprovalCard from "@/components/primitives/ApprovalCard";
import ChatComposer from "@/components/primitives/ChatComposer";
import CodeBlock from "@/components/primitives/CodeBlock";
import ContextCards from "@/components/primitives/ContextCards";
import DiffTable from "@/components/primitives/DiffTable";
import FilterTable from "@/components/primitives/FilterTable";
import FineTuneCard from "@/components/primitives/FineTuneCard";
import Flowchart from "@/components/primitives/Flowchart";
import GlideMenu from "@/components/primitives/GlideMenu";
import InsightCards from "@/components/primitives/InsightCards";
import LoadingState from "@/components/primitives/LoadingState";
import PromptBar from "@/components/primitives/PromptBar";
import RecommendationCard from "@/components/primitives/RecommendationCard";
import RecordsTable from "@/components/primitives/RecordsTable";
import SearchList from "@/components/primitives/SearchList";
import SelectionActions from "@/components/primitives/SelectionActions";
import SidebarNav from "@/components/primitives/SidebarNav";
import StreamingText from "@/components/primitives/StreamingText";
import TaskRows from "@/components/primitives/TaskRows";
import ThinkingState from "@/components/primitives/ThinkingState";
import ToolChips from "@/components/primitives/ToolChips";

export type Category = "Agent" | "Data" | "Overlays" | "Atoms" | "Blocks";

export type Control =
  | {
      type: "select";
      key: string;
      label: string;
      options: { label: string; value: string }[];
    }
  | { type: "switch"; key: string; label: string }
  | {
      type: "slider";
      key: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      suffix?: string;
    }
  | { type: "text"; key: string; label: string };

export type Playable = {
  id: string;
  category: Category;
  title: string;
  caption?: string;
  /** source filename (defaults to title without spaces) */
  file?: string;
  controls?: Control[];
  defaults?: Record<string, any>;
  /** render the component from the current control values; `set` updates a control */
  demo: (values: Record<string, any>, set: (k: string, v: any) => void) => ReactNode;
  /** shown in the props panel when there are no controls */
  note?: string;
};

const auto =
  (C: ComponentType<any>, extra?: (v: any) => Record<string, any>) =>
  (values: Record<string, any>) => <C {...values} {...(extra?.(values) ?? {})} />;

export const CATEGORY_ORDER: Category[] = ["Agent", "Data", "Overlays", "Atoms", "Blocks"];

export const PLAYGROUND: Playable[] = [
  /* ────────────────────────── AGENT ────────────────────────── */
  {
    id: "thinking-state",
    category: "Agent",
    title: "Thinking State",
    caption: "Expandable agent trace — steps, reasoning, search, coding.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Variant",
        options: ["Steps", "Reasoning", "Search", "Coding"].map((v) => ({ label: v, value: v })),
      },
      { type: "switch", key: "working", label: "Working (live)" },
    ],
    defaults: { variant: "Steps", working: true },
    demo: (v) => <ThinkingState variant={v.variant} working={v.working} />,
  },
  {
    id: "streaming-text",
    category: "Agent",
    title: "Streaming Answer",
    file: "StreamingText",
    caption: "Streamed answer with inline sources, actions, follow-ups.",
    demo: () => <StreamingText />,
    note: "Self-running demo. Tune the theme colors above, or the reveal rate of the lower-level StreamText atom.",
  },
  {
    id: "approval-card",
    category: "Agent",
    title: "Approval Card",
    caption: "Human-in-the-loop question the agent asks before acting.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Layout",
        options: ["Question", "Approve", "Approve + Reject"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { variant: "Question" },
    demo: (v) => <ApprovalCard variant={v.variant} />,
  },
  {
    id: "tool-chips",
    category: "Agent",
    title: "Tool Chips",
    caption: "Code edits and tool calls as compact expandable chips.",
    demo: () => <ToolChips />,
    note: "Runs through its own live tool-call sequence.",
  },
  {
    id: "task-rows",
    category: "Agent",
    title: "Task Rows",
    caption: "Live agent task status — running, failed, completed.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Layout",
        options: ["Capsules", "List"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { variant: "Capsules" },
    demo: (v) => <TaskRows variant={v.variant} />,
  },
  {
    id: "loading-state",
    category: "Agent",
    title: "Loading State",
    caption: "Pixel-grid loader with shimmer and elapsed time.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Variant",
        options: ["Drive", "Dots", "Orbit", "Surfer"].map((v) => ({ label: v, value: v })),
      },
      { type: "text", key: "label", label: "Label" },
    ],
    defaults: { variant: "Drive", label: "Loading" },
    demo: (v) => <LoadingState variant={v.variant} label={v.label} />,
  },
  {
    id: "code-block",
    category: "Agent",
    title: "Code Block",
    caption: "Agent-written code streaming in line by line.",
    demo: () => <CodeBlock />,
  },
  {
    id: "chat-composer",
    category: "Agent",
    title: "Chat",
    file: "ChatComposer",
    caption: "Tabbed chat panel with reasoning replies and a composer.",
    demo: () => <ChatComposer />,
    note: "Interactive — try typing in the composer.",
  },
  {
    id: "prompt-bar",
    category: "Agent",
    title: "Prompt Bar",
    caption: "Composer with @ sources, / commands, model picker, dictation.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Style",
        options: ["Rounded", "Pill"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { variant: "Rounded" },
    demo: (v) => <PromptBar variant={v.variant} />,
  },
  {
    id: "context-cards",
    category: "Agent",
    title: "Context Cards",
    caption: "Retrieved knowledge chunks with their sources.",
    demo: () => <ContextCards />,
  },
  {
    id: "recommendation-card",
    category: "Agent",
    title: "Recommendation Card",
    caption: "Agent suggestion with a confidence meter and actions.",
    demo: () => <RecommendationCard />,
  },
  {
    id: "insight-cards",
    category: "Agent",
    title: "Insight Cards",
    caption: "Paged agent insights with scrub-ready live charts.",
    demo: () => <InsightCards />,
  },
  {
    id: "fine-tune-card",
    category: "Agent",
    title: "Fine-tune Card",
    file: "FineTuneCard",
    caption: "The agent adjusts design properties in an inspector.",
    demo: () => <FineTuneCard />,
    note: "Fully interactive — scrub the fields.",
  },

  /* ────────────────────────── DATA ────────────────────────── */
  {
    id: "records-table",
    category: "Data",
    title: "Records Table",
    caption: "CRM-style grid with tags, sorting, and relationship status.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Dataset",
        options: ["Makers", "Clients"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { variant: "Makers" },
    demo: (v) => <RecordsTable variant={v.variant} />,
  },
  {
    id: "diff-table",
    category: "Data",
    title: "Diff Table",
    caption: "AI-proposed edits sweeping through tabular data.",
    demo: () => <DiffTable />,
  },
  {
    id: "filter-table",
    category: "Data",
    title: "Filter Table",
    caption: "Status chips that reorganize live data.",
    demo: () => <FilterTable />,
  },
  {
    id: "flowchart",
    category: "Data",
    title: "Flowchart",
    caption: "Workflow trigger and condition steps on a dotted canvas.",
    demo: () => <Flowchart />,
  },
  {
    id: "search",
    category: "Data",
    title: "Search",
    file: "SearchList",
    caption: "Command search with live filtering and an empty state.",
    demo: () => <SearchList />,
    note: "Interactive — type to filter.",
  },
  {
    id: "sidebar-nav",
    category: "Data",
    title: "Sidebar Nav",
    caption: "Collapsible workspace and chat navigation with gliding hovers.",
    demo: () => <SidebarNav />,
    note: "Interactive — hover the nav items.",
  },
  {
    id: "selection-actions",
    category: "Data",
    title: "Selection Actions",
    caption: "Highlight a passage and hand it to the agent to rewrite.",
    demo: () => <SelectionActions />,
  },
  {
    id: "glide-menu",
    category: "Data",
    title: "Glide Menu",
    caption: "Popover menu with a gliding pointer highlight.",
    demo: () => (
      <GlideMenu className="w-52 rounded-[10px] border border-line bg-surface p-1.5 shadow-card">
        {["Rename", "Duplicate", "Move to…", "Delete"].map((item) => (
          <button
            key={item}
            data-menu-row
            className="flex w-full items-center rounded-[8px] px-2.5 py-1.5 text-left text-[12.5px] text-ink-2 hover:text-ink"
          >
            {item}
          </button>
        ))}
      </GlideMenu>
    ),
  },

  /* ────────────────────────── OVERLAYS ─────────────────────── */
  {
    id: "popover",
    category: "Overlays",
    title: "Popover",
    caption: "Anchored panel — focus-managed, Esc and outside-click dismiss.",
    controls: [
      {
        type: "select",
        key: "side",
        label: "Side",
        options: ["bottom", "top", "right", "left"].map((v) => ({ label: v, value: v })),
      },
      {
        type: "select",
        key: "align",
        label: "Align",
        options: ["center", "start", "end"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { side: "bottom", align: "center" },
    demo: (v) => (
      <Popover>
        <PopoverTrigger className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-hairline transition-colors hover:text-ink">
          Open popover
        </PopoverTrigger>
        <PopoverContent side={v.side} align={v.align} className="w-64 p-3">
          <p className="text-[12.5px] font-medium text-ink">Rename workspace</p>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-3">
            Shown to teammates on their invite.
          </p>
          <input
            defaultValue="Beautiful UI"
            className="mt-2.5 w-full rounded-control border border-line bg-field px-2.5 py-1.5 text-[12.5px] text-ink outline-none transition-colors focus:border-accent"
          />
        </PopoverContent>
      </Popover>
    ),
    note: "Click the button — then change side and align while it's open.",
  },
  {
    id: "tooltip",
    category: "Overlays",
    title: "Tooltip",
    caption: "Inverted hover hint on the shared chart-tooltip tokens.",
    controls: [
      {
        type: "select",
        key: "side",
        label: "Side",
        options: ["top", "bottom", "right", "left"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { side: "top" },
    demo: (v) => (
      <TooltipProvider delay={200}>
        <Tooltip>
          <TooltipTrigger className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-hairline transition-colors hover:text-ink">
            Hover me
          </TooltipTrigger>
          <TooltipContent side={v.side}>Deployed 2 minutes ago</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    note: "Hover the button — same skin as the chart tooltips.",
  },
  {
    id: "menu",
    category: "Overlays",
    title: "Menu",
    caption: "Dropdown with keyboard navigation and typeahead.",
    demo: () => (
      <Menu>
        <MenuTrigger className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-hairline transition-colors hover:text-ink">
          Actions
        </MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Move to…</MenuItem>
          <MenuSeparator />
          <MenuItem destructive>Delete</MenuItem>
        </MenuContent>
      </Menu>
    ),
    note: "Click, then arrow-key through the items — typeahead works too.",
  },
  {
    id: "dialog",
    category: "Overlays",
    title: "Dialog",
    caption: "Modal with backdrop, scroll lock and focus trap.",
    demo: () => (
      <Dialog>
        <DialogTrigger className="rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-btn transition-transform active:scale-[0.97]">
          Delete project
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-[14px] font-semibold tracking-tight text-ink">
            Delete project?
          </DialogTitle>
          <DialogDescription className="mt-1 text-[12.5px] leading-relaxed text-ink-3">
            This removes the workspace and all its sessions. This can't be undone.
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink">
              Cancel
            </DialogClose>
            <DialogClose
              className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-white transition-transform active:scale-[0.97]"
              style={{ background: "var(--red)" }}
            >
              Delete
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    ),
    note: "Focus is trapped while open — Tab cycles the two actions, Esc closes.",
  },
  {
    id: "drawer",
    category: "Overlays",
    title: "Drawer",
    caption: "Bottom sheet with swipe-to-dismiss.",
    demo: () => (
      <Drawer>
        <DrawerTrigger className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-ink-2 shadow-hairline transition-colors hover:text-ink">
          Open sheet
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="text-[14px] font-semibold tracking-tight text-ink">
            Session settings
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-[12.5px] leading-relaxed text-ink-3">
            Sheets suit mobile flows and quick adjustments. Drag down to dismiss.
          </DrawerDescription>
          <div className="mt-4">
            <Input placeholder="Session name" defaultValue="Untitled session" />
          </div>
        </DrawerContent>
      </Drawer>
    ),
    note: "Opens from the bottom edge — drag it down.",
  },

  /* ────────────────────────── ATOMS ────────────────────────── */
  {
    id: "button",
    category: "Atoms",
    title: "Button",
    caption: "Pill button — five variants, two sizes.",
    controls: [
      {
        type: "select",
        key: "variant",
        label: "Variant",
        options: ["primary", "secondary", "ghost", "accent", "success"].map((v) => ({ label: v, value: v })),
      },
      {
        type: "select",
        key: "size",
        label: "Size",
        options: ["sm", "md"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { variant: "accent", size: "md" },
    demo: (v) => (
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={v.variant} size={v.size}>Save changes</Button>
        <Button variant={v.variant} size={v.size} disabled>Disabled</Button>
      </div>
    ),
  },
  {
    id: "chip",
    category: "Atoms",
    title: "Chip",
    caption: "Monospace token chip for code values.",
    controls: [
      {
        type: "select",
        key: "tone",
        label: "Tone",
        options: ["neutral", "accent", "orange"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { tone: "accent" },
    demo: (v) => (
      <div className="flex flex-wrap gap-2">
        <Chip tone={v.tone}>updated_at</Chip>
        <Chip tone="neutral">12 / 100</Chip>
      </div>
    ),
  },
  {
    id: "status-pill",
    category: "Atoms",
    title: "Status Pill",
    caption: "Dot + label status indicator in five tones.",
    controls: [
      {
        type: "select",
        key: "tone",
        label: "Tone",
        options: ["green", "orange", "red", "accent", "neutral"].map((v) => ({ label: v, value: v })),
      },
      { type: "switch", key: "dot", label: "Show dot" },
    ],
    defaults: { tone: "accent", dot: true },
    demo: (v) => (
      <StatusPill tone={v.tone} dot={v.dot}>
        {v.tone}
      </StatusPill>
    ),
  },
  {
    id: "progress-ring",
    category: "Atoms",
    title: "Progress Ring",
    caption: "Small progress ring with content in the center.",
    controls: [
      {
        type: "select",
        key: "tone",
        label: "Tone",
        options: ["orange", "green", "red", "accent"].map((v) => ({ label: v, value: v })),
      },
      { type: "slider", key: "progress", label: "Progress", min: 0, max: 100, step: 1, suffix: "%" },
      { type: "slider", key: "size", label: "Size", min: 16, max: 72, step: 1, suffix: "px" },
    ],
    defaults: { tone: "accent", progress: 65, size: 40 },
    demo: (v) => (
      <ProgressRing progress={v.progress / 100} tone={v.tone} size={v.size}>
        {Math.round(v.progress)}%
      </ProgressRing>
    ),
  },
  {
    id: "switch",
    category: "Atoms",
    title: "Switch",
    caption: "Controlled toggle switch.",
    controls: [{ type: "switch", key: "checked", label: "Checked" }],
    defaults: { checked: true },
    demo: (v, set) => (
      <Switch checked={v.checked} onChange={(x) => set("checked", x)} label="Toggle" />
    ),
  },
  {
    id: "segmented-control",
    category: "Atoms",
    title: "Segmented Control",
    caption: "Equal-width segments with a sliding thumb.",
    demo: (v, set) => (
      <SegmentedControl
        options={["Day", "Week", "Month"]}
        value={v.value}
        onChange={(x) => set("value", x)}
      />
    ),
    defaults: { value: "Week" },
  },
  {
    id: "stream-text",
    category: "Atoms",
    title: "Stream Text",
    caption: "Low-level character revealer.",
    controls: [
      { type: "slider", key: "charsPerTick", label: "Chars / tick", min: 1, max: 10, step: 1 },
      { type: "slider", key: "tickMs", label: "Tick speed (ms)", min: 4, max: 40, step: 1, suffix: "ms" },
      { type: "switch", key: "caret", label: "Caret" },
    ],
    defaults: { charsPerTick: 2, tickMs: 9, caret: true },
    demo: (v) => (
      <StreamText
        text="Your flavor report is ready — 4 scoops beat the weekly average."
        charsPerTick={v.charsPerTick}
        tickMs={v.tickMs}
        caret={v.caret}
        className="max-w-80 font-mono text-[13px] text-ink"
      />
    ),
  },
  {
    id: "shimmer",
    category: "Atoms",
    title: "Shimmer",
    caption: "Soft shimmering surface placeholder.",
    demo: () => (
      <div className="flex w-full max-w-72 flex-col gap-2">
        <Shimmer className="h-3.5 w-1/3">Loading title</Shimmer>
        <Shimmer className="h-3.5 w-full">Loading body line one</Shimmer>
        <Shimmer className="h-3.5 w-2/3">Loading body line two</Shimmer>
        <div className="mt-1 flex items-center gap-2">
          <Shimmer className="size-6 rounded-full">avatar</Shimmer>
          <Shimmer className="h-3.5 flex-1">name</Shimmer>
        </div>
      </div>
    ),
  },
  {
    id: "text-row",
    category: "Atoms",
    title: "Text Row",
    caption: "Label / value row for metadata lists.",
    demo: () => (
      <div className="flex w-full max-w-64 flex-col gap-1.5">
        <TextRow label="Model" value="gpt-5.6-sol" />
        <TextRow label="Temperature" value="0.7" />
        <TextRow label="Status" value={<StatusPill tone="green">Ready</StatusPill>} />
      </div>
    ),
  },
  {
    id: "input",
    category: "Atoms",
    title: "Input",
    caption: "Text field on the field token.",
    controls: [{ type: "text", key: "placeholder", label: "Placeholder" }],
    defaults: { placeholder: "Search sessions…" },
    demo: (v) => (
      <div className="w-full max-w-64">
        <Input placeholder={v.placeholder} />
      </div>
    ),
  },
  {
    id: "select",
    category: "Atoms",
    title: "Select",
    caption: "Listbox on the menu skin, with check indicator.",
    demo: () => (
      <Select defaultValue="sol">
        <SelectTrigger />
        <SelectContent>
          <SelectItem value="sol">gpt-5.6-sol</SelectItem>
          <SelectItem value="fable">Fable 5</SelectItem>
          <SelectItem value="sonnet">Sonnet 5</SelectItem>
          <SelectItem value="composer">Composer 2.5</SelectItem>
        </SelectContent>
      </Select>
    ),
    note: "Base UI listbox — type a letter to jump.",
  },
  {
    id: "tabs",
    category: "Atoms",
    title: "Tabs",
    caption: "Underline tabs that switch panels.",
    demo: () => (
      <div className="w-full max-w-80">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTab value="general">General</TabsTab>
            <TabsTab value="models">Models</TabsTab>
            <TabsTab value="usage">Usage</TabsTab>
          </TabsList>
          <TabsPanel value="general">Workspace name, slug and members.</TabsPanel>
          <TabsPanel value="models">Default model and fallbacks per surface.</TabsPanel>
          <TabsPanel value="usage">Tokens, spend and rate limits.</TabsPanel>
        </Tabs>
      </div>
    ),
    note: "Click the tabs — the underline is the accent token.",
  },
  {
    id: "checkbox",
    category: "Atoms",
    title: "Checkbox",
    caption: "Hairline box with accent fill.",
    controls: [{ type: "switch", key: "checked", label: "Checked" }],
    defaults: { checked: true },
    demo: (v, set) => (
      <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-2">
        <Checkbox checked={v.checked} onCheckedChange={(c) => set("checked", c)} label="Remember" />
        Remember this device
      </label>
    ),
  },
  {
    id: "radio-group",
    category: "Atoms",
    title: "Radio Group",
    caption: "Accent dot on a hairline ring.",
    demo: () => (
      <RadioGroup defaultValue="balanced">
        <RadioItem value="fast" label="Fastest" />
        <RadioItem value="balanced" label="Balanced" />
        <RadioItem value="careful" label="Most careful" />
      </RadioGroup>
    ),
    note: "Arrow keys move between options.",
  },
  {
    id: "slider",
    category: "Atoms",
    title: "Slider",
    caption: "Draggable value track — the pg-range look, accessible.",
    demo: () => (
      <div className="w-full max-w-64">
        <Slider defaultValue={40} label="Temperature" />
      </div>
    ),
    note: "Drag the thumb, or focus it and use arrow keys.",
  },
  {
    id: "accordion",
    category: "Atoms",
    title: "Accordion",
    caption: "Ruled rows with a rotating chevron.",
    demo: () => (
      <div className="w-full max-w-80">
        <Accordion>
          <AccordionItem value="a" title="What does the agent remember?">
            Only what you pin. Sessions are local by default.
          </AccordionItem>
          <AccordionItem value="b" title="Can it run tools?">
            Yes — tool calls appear as chips, and approvals gate anything destructive.
          </AccordionItem>
          <AccordionItem value="c" title="Where is my data stored?">
            In your workspace. Nothing leaves the box without an explicit integration.
          </AccordionItem>
        </Accordion>
      </div>
    ),
    note: "Click a row to expand it.",
  },
  {
    id: "avatar",
    category: "Atoms",
    title: "Avatar",
    caption: "Image with initials fallback.",
    controls: [{ type: "slider", key: "size", label: "Size", min: 20, max: 64, step: 1, suffix: "px" }],
    defaults: { size: 28 },
    demo: (v) => (
      <div className="flex items-center gap-2.5">
        <Avatar fallback="SK" size={v.size} />
        <Avatar fallback="TR" size={v.size} />
        <Avatar fallback="AI" size={v.size} />
      </div>
    ),
  },
  {
    id: "badge",
    category: "Atoms",
    title: "Badge",
    caption: "Small count/tag pill — the sidebar counter.",
    controls: [
      {
        type: "select",
        key: "tone",
        label: "Tone",
        options: ["neutral", "accent", "green", "orange", "red"].map((v) => ({ label: v, value: v })),
      },
    ],
    defaults: { tone: "accent" },
    demo: (v) => (
      <div className="flex items-center gap-2">
        <Badge tone={v.tone}>12</Badge>
        <Badge tone={v.tone}>new</Badge>
        <Badge tone="neutral">v2</Badge>
      </div>
    ),
  },
  {
    id: "kbd",
    category: "Atoms",
    title: "Kbd",
    caption: "Keyboard key cap.",
    demo: () => (
      <div className="flex items-center gap-2 text-[12.5px] text-ink-3">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <span>to search</span>
        <Kbd>Esc</Kbd>
        <span>to close</span>
      </div>
    ),
  },
  {
    id: "separator",
    category: "Atoms",
    title: "Separator",
    caption: "Hairline rule between sections.",
    demo: () => (
      <div className="w-full max-w-64">
        <p className="text-[12.5px] text-ink-2">Above the rule</p>
        <Separator className="my-3" />
        <p className="text-[12.5px] text-ink-3">Below the rule</p>
      </div>
    ),
  },

  /* ────────────────────────── BLOCKS ───────────────────────── */
  {
    id: "filter-toolbar",
    category: "Blocks",
    title: "Filter Toolbar",
    caption: "Faceted filter popover with removable chips.",
    demo: () => <FilterToolbar />,
    note: "Interactive — open Filter, pick a facet, then an option. Chips are removable.",
  },
  {
    id: "chart-card",
    category: "Blocks",
    title: "Chart Card",
    caption: "Rounded bars over a track, period switcher, count headline.",
    demo: () => (
      <div className="w-full max-w-96">
        <ChartCard
          title="Revenue"
          value="$18,240"
          delta={9.4}
          data={[32, 48, 41, 56, 47, 62, 58, 71, 66, 78, 72, 84]}
        />
      </div>
    ),
    note: "Bars are divs on the accent token — the theme studio re-skins the chart.",
  },
  {
    id: "insight-chart-card",
    category: "Blocks",
    title: "Insight Chart Card",
    caption: "Liveline Catmull-Rom dual-series analytics with hover pill cursor.",
    demo: () => (
      <div className="w-full max-w-xl">
        <InsightChartCard
          title="Revenue vs Ad Spend"
          seriesList={[
            { id: "rev", name: "Revenue", color: "var(--accent)", data: [14, 18, 16, 21, 24, 28] },
            { id: "spend", name: "Ad Spend", color: "var(--orange)", data: [4, 6, 5, 8, 7, 9.6] },
          ]}
        />
      </div>
    ),
    note: "Interactive — scrub along the curve to see the floating pill tooltip.",
  },
  {
    id: "stats-row",
    category: "Blocks",
    title: "Stats Row",
    caption: "The dashboard top line — stats in an even grid.",
    demo: () => (
      <div className="w-full max-w-2xl">
        <StatsRow
          stats={[
            { label: "Revenue", value: "$18,240", delta: 9.4 },
            { label: "Active users", value: "1,424", delta: 5.2 },
            { label: "Churn", value: "1.9%", delta: -0.4 },
          ]}
        />
      </div>
    ),
  },
  {
    id: "activity-feed",
    category: "Blocks",
    title: "Activity Feed",
    caption: "Who did what, when — rows on the divide.",
    demo: () => (
      <div className="w-full max-w-md">
        <ActivityFeed
          items={[
            { id: "1", initials: "SK", name: "Skander", action: "merged the studio theme engine", time: "2m" },
            { id: "2", initials: "TB", name: "Turbo", action: "shipped 16 overlay atoms", time: "18m" },
            { id: "3", initials: "AI", name: "Agent", action: "re-themed 46 components to Warm", time: "1h" },
            { id: "4", initials: "AN", name: "Ana", action: "commented on the dashboard template", time: "3h" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "empty-state",
    category: "Blocks",
    title: "Empty State",
    caption: "The zero-data moment — icon well, guidance, one action.",
    demo: () => (
      <div className="w-full max-w-md rounded-card border border-line bg-surface shadow-hairline">
        <EmptyState
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          title="No sessions yet"
          description="Start a session and the agent's work shows up here."
          action={<Button variant="accent" size="sm">New session</Button>}
        />
      </div>
    ),
  },
  {
    id: "auth-card",
    category: "Blocks",
    title: "Auth Card",
    caption: "Sign-in panel — provider first, credentials under the rule.",
    demo: () => <AuthCard />,
  },
  {
    id: "settings-section",
    category: "Blocks",
    title: "Settings Section",
    caption: "The settings-page unit — header, then label/control rows.",
    demo: () => (
      <div className="w-full max-w-md">
        <SettingsSection title="Workspace" description="Shown to every member.">
          <SettingsRow
            label="Name"
            description="The workspace's display name."
            control={<Input defaultValue="Beautiful UI" className="w-44" aria-label="Workspace name" />}
          />
          <SettingsRow
            label="Public sessions"
            description="Anyone with the link can watch a session."
            control={<Switch defaultChecked={false} label="Public sessions" />}
          />
          <SettingsRow
            label="Region"
            description="Where sessions are processed."
            control={
              <Select defaultValue="eu">
                <SelectTrigger className="w-36" />
                <SelectContent>
                  <SelectItem value="eu">EU (Frankfurt)</SelectItem>
                  <SelectItem value="us">US (Virginia)</SelectItem>
                  <SelectItem value="ap">AP (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </SettingsSection>
      </div>
    ),
    note: "Interactive — the switch and select are the real atoms.",
  },
  {
    id: "project-card",
    category: "Blocks",
    title: "Project Card",
    caption: "Status, progress and ownership for project grids.",
    controls: [
      {
        type: "select",
        key: "status",
        label: "Status",
        options: ["on-track", "at-risk", "done"].map((v) => ({ label: v, value: v })),
      },
      { type: "slider", key: "progress", label: "Progress", min: 0, max: 100, step: 1, suffix: "%" },
    ],
    defaults: { status: "on-track", progress: 72 },
    demo: (v) => (
      <div className="w-full max-w-80">
        <ProjectCard
          name="Dashboard blocks"
          description="Chart cards, stat rows, activity feeds and the filter toolbar."
          status={v.status}
          progress={v.progress / 100}
          members={["TB", "AN", "AI"]}
          updated="1d ago"
        />
      </div>
    ),
  },
  {
    id: "ticket-list",
    category: "Blocks",
    title: "Ticket List",
    caption: "Linear-style rows — status glyph, labels, priority, assignee.",
    demo: () => (
      <div className="w-full max-w-2xl">
        <TicketList
          tickets={[
            { id: "BUI-101", title: "Theme engine: neutral hue + tint sliders", status: "done", priority: 3, labels: ["studio"], assignee: "SK", date: "Aug 24" },
            { id: "BUI-105", title: "Templates: settings and auth pages", status: "progress", priority: 2, labels: ["templates"], assignee: "TB", date: "Aug 25" },
            { id: "BUI-106", title: "Chart card: area and line variants", status: "todo", priority: 1, labels: ["blocks"], assignee: "AN", date: "Aug 26" },
            { id: "BUI-108", title: "Mobile nav drawer for AppShell", status: "backlog", priority: 0, labels: ["shell"], assignee: "AI", date: "Aug 28" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "member-list",
    category: "Blocks",
    title: "Member List",
    caption: "Team rows — role select, status pill, row menu.",
    demo: () => (
      <div className="w-full max-w-xl">
        <MemberList
          members={[
            { id: "1", name: "Skander K.", email: "skander@vizion.io", role: "Owner", status: "active", lastActive: "now" },
            { id: "2", name: "Turbo B.", email: "turbo@vizion.io", role: "Admin", status: "active", lastActive: "2m" },
            { id: "5", name: "Mira L.", email: "mira@partner.co", role: "Viewer", status: "invited", lastActive: "—" },
          ]}
        />
      </div>
    ),
    note: "Interactive — change a role, open the row menu.",
  },
];

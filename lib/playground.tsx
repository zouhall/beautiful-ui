"use client";

import type { ComponentType, ReactNode } from "react";

/* ─────────────────────────────────────────────────────────
 * PLAYGROUND CATALOG
 * Every component the studio can render, plus a control
 * schema so the props panel knows which knobs to show.
 * ───────────────────────────────────────────────────────── */

/* atoms */
import { Button } from "@/components/atoms/Button";
import { Chip } from "@/components/atoms/Chip";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { Shimmer } from "@/components/atoms/Shimmer";
import { StatusPill } from "@/components/atoms/StatusPill";
import { StreamText } from "@/components/atoms/StreamText";
import { Switch } from "@/components/atoms/Switch";
import { TextRow } from "@/components/atoms/TextRow";

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

export type Category = "Agent" | "Data" | "Atoms";

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

export const CATEGORY_ORDER: Category[] = ["Agent", "Data", "Atoms"];

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
];

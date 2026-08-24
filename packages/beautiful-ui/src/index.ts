/**
 * Beautiful UI — crafted interface primitives for AI-native products.
 *
 * Import the design foundation once in your app root, then any component:
 *
 *   import "beautiful-ui/styles.css";
 *   import { StreamingText, ApprovalCard, Button } from "beautiful-ui";
 *
 * Requires React 18+ and Tailwind CSS v4 (the styles.css foundation builds on
 * Tailwind v4 `@theme inline` utilities and the shadow-plugin shadow scale).
 */

/* atoms */
export { Accordion, AccordionItem } from "./atoms/Accordion";
export { Avatar } from "./atoms/Avatar";
export { Badge, type BadgeTone } from "./atoms/Badge";
export { Button, type ButtonVariant } from "./atoms/Button";
export { Checkbox } from "./atoms/Checkbox";
export { Chip } from "./atoms/Chip";
export { Delta } from "./atoms/Delta";
export { Dialog, DialogTrigger, DialogContent, DialogClose, DialogTitle, DialogDescription } from "./atoms/Dialog";
export { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerTitle, DrawerDescription } from "./atoms/Drawer";
export { Input } from "./atoms/Input";
export { Kbd } from "./atoms/Kbd";
export { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from "./atoms/Menu";
export { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "./atoms/Popover";
export { ProgressRing } from "./atoms/ProgressRing";
export { RadioGroup, RadioItem } from "./atoms/RadioGroup";
export { SegmentedControl } from "./atoms/SegmentedControl";
export { Select, SelectTrigger, SelectContent, SelectItem } from "./atoms/Select";
export { Separator } from "./atoms/Separator";
export { Shimmer } from "./atoms/Shimmer";
export { Slider } from "./atoms/Slider";
export { StatusPill } from "./atoms/StatusPill";
export { StreamText } from "./atoms/StreamText";
export { Switch } from "./atoms/Switch";
export { Tabs, TabsList, TabsTab, TabsPanel } from "./atoms/Tabs";
export { TextRow } from "./atoms/TextRow";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./atoms/Tooltip";

/* primitives */
export { default as AppShell } from "./primitives/AppShell";
export { default as ApprovalCard } from "./primitives/ApprovalCard";
export { default as ChatComposer } from "./primitives/ChatComposer";
export { default as CodeBlock } from "./primitives/CodeBlock";
export { default as ContextCards } from "./primitives/ContextCards";
export { default as DiffTable } from "./primitives/DiffTable";
export { default as FilterTable } from "./primitives/FilterTable";
export { default as FineTuneCard } from "./primitives/FineTuneCard";
export { default as Flowchart } from "./primitives/Flowchart";
export { default as GlideMenu } from "./primitives/GlideMenu";
export { default as InsightCards } from "./primitives/InsightCards";
export { default as LoadingState } from "./primitives/LoadingState";
export { default as PageHeader } from "./primitives/PageHeader";
export {
  default as PromptBar,
  type PromptBarModel,
} from "./primitives/PromptBar";
export { default as RecommendationCard } from "./primitives/RecommendationCard";
export { default as RecordsTable } from "./primitives/RecordsTable";
export { default as SearchList } from "./primitives/SearchList";
export { default as SelectionActions } from "./primitives/SelectionActions";
export {
  default as SidebarNav,
  type SidebarRecent,
} from "./primitives/SidebarNav";
export { default as Stat } from "./primitives/Stat";
export { default as StreamingText } from "./primitives/StreamingText";
export { default as TaskRows } from "./primitives/TaskRows";
export { default as ThinkingState } from "./primitives/ThinkingState";
export { default as ToolChips, type LiveTool } from "./primitives/ToolChips";

/* blocks */
export { ActivityFeed, type ActivityItem } from "./blocks/ActivityFeed";
export { ChartCard } from "./blocks/ChartCard";
export { FilterToolbar, type Facet, type ActiveFilter } from "./blocks/FilterToolbar";
export { StatsRow, type StatDef } from "./blocks/StatsRow";

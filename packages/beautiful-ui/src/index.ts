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
export { Button, type ButtonVariant } from "./atoms/Button";
export { Chip } from "./atoms/Chip";
export { ProgressRing } from "./atoms/ProgressRing";
export { SegmentedControl } from "./atoms/SegmentedControl";
export { Shimmer } from "./atoms/Shimmer";
export { StatusPill } from "./atoms/StatusPill";
export { StreamText } from "./atoms/StreamText";
export { Switch } from "./atoms/Switch";
export { TextRow } from "./atoms/TextRow";

/* primitives */
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
export { default as StreamingText } from "./primitives/StreamingText";
export { default as TaskRows } from "./primitives/TaskRows";
export { default as ThinkingState } from "./primitives/ThinkingState";
export { default as ToolChips, type LiveTool } from "./primitives/ToolChips";

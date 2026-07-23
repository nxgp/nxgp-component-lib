/**
 * `@nxgp/component-lib/assistant` — kit-styled chat UI plus the full assistant-ui surface.
 *
 * Kit wrappers (`Thread`, `ThreadList`, `AssistantShell`, …) are the recommended
 * defaults. Everything from `@assistant-ui/react`, `@assistant-ui/react-ai-sdk`,
 * and `@assistant-ui/react-markdown` is also re-exported so you can compose
 * primitives, runtimes, tools, and markdown directly when needed.
 *
 * @example
 * ```tsx
 * import "@nxgp/component-lib/assistant.css";
 * import {
 *   AssistantRuntimeProvider,
 *   AssistantShell,
 *   useChatRuntime,
 *   ThreadPrimitive, // underlying primitive when you need custom layout
 * } from "@nxgp/component-lib/assistant";
 * ```
 */

// Full upstream surfaces — available for advanced composition.
export * from "@assistant-ui/react";
export * from "@assistant-ui/react-ai-sdk";
export * from "@assistant-ui/react-markdown";

// Kit-styled defaults (override any same-named upstream helpers).
export { AssistantShell, type AssistantShellProps } from "./assistant-shell";
export {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "./attachment";
export { ThreadFollowupSuggestions } from "./follow-up-suggestions";
export { MarkdownText } from "./markdown-text";
export { OpenUIToolFallback, type OpenUIToolResult } from "./openui-tool-fallback";
export {
  Reasoning,
  ReasoningContent,
  ReasoningGroup,
  ReasoningRoot,
  ReasoningText,
  ReasoningTrigger,
  reasoningVariants,
} from "./reasoning";
export { Thread, type ThreadComponents, type ThreadGroupPart, type ThreadProps } from "./thread";
export {
  ThreadList,
  ThreadListItem,
  ThreadListItems,
  ThreadListNew,
  ThreadListRoot,
  ThreadListSearch,
} from "./thread-list";
export { ThreadListSidebar, type ThreadListSidebarProps } from "./thread-list-sidebar";
export {
  ToolFallback,
  ToolFallbackApproval,
  ToolFallbackArgs,
  ToolFallbackContent,
  ToolFallbackError,
  ToolFallbackResult,
  ToolFallbackRoot,
  ToolFallbackTrigger,
} from "./tool-fallback";
export {
  ToolGroup,
  ToolGroupContent,
  ToolGroupRoot,
  ToolGroupTrigger,
  toolGroupVariants,
} from "./tool-group";
export { TooltipIconButton, type TooltipIconButtonProps } from "./tooltip-icon-button";
export { useDemoAssistantRuntime } from "./use-demo-assistant-runtime";

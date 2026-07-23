import type { HTMLAttributes } from "react";
import { SidebarInset, SidebarProvider } from "../components/sidebar/sidebar";
import { cn } from "../lib/cn";
import { Thread } from "./thread";
import { ThreadListSidebar } from "./thread-list-sidebar";

export type AssistantShellProps = HTMLAttributes<HTMLDivElement> & {
  sidebarTitle?: string;
};

/**
 * Full assistant layout — thread list sidebar plus active thread.
 *
 * @example
 * ```tsx
 * <AssistantRuntimeProvider runtime={runtime}>
 *   <AssistantShell className="h-dvh" />
 * </AssistantRuntimeProvider>
 * ```
 */
export function AssistantShell({ className, sidebarTitle, ...props }: AssistantShellProps) {
  return (
    <div className={cn("flex h-full min-h-0 w-full", className)} {...props}>
      <SidebarProvider>
        <ThreadListSidebar title={sidebarTitle} />
        <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Thread />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

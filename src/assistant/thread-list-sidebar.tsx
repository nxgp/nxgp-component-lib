import { MessagesSquare } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "../components/sidebar/sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/sidebar/sidebar-menu";
import { ThreadList } from "./thread-list";

export type ThreadListSidebarProps = ComponentPropsWithoutRef<typeof Sidebar> & {
  title?: string;
};

/**
 * Sidebar shell with thread list — pair with `AssistantShell` or compose manually.
 *
 * @example
 * ```tsx
 * <SidebarProvider>
 *   <ThreadListSidebar title="Assistant" />
 *   <SidebarInset><Thread /></SidebarInset>
 * </SidebarProvider>
 * ```
 */
export function ThreadListSidebar({ title = "Assistant", ...props }: ThreadListSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="mb-2 border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessagesSquare className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <ThreadList />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

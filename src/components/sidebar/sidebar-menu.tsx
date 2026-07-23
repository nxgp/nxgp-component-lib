import { Slot } from "radix-ui";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { useSidebar } from "./sidebar";
import {
  type SidebarMenuButtonVariantProps,
  sidebarMenuButtonVariants,
} from "./sidebar-menu.variants";

export type SidebarGroupProps = HTMLAttributes<HTMLDivElement>;

/** Groups related sidebar menu items with optional label. */
export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-group"
      className={cn("relative flex w-full flex-col gap-0.5 p-1", className)}
      {...props}
    />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

export type SidebarGroupLabelProps = HTMLAttributes<HTMLDivElement>;

export const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 group-data-[state=collapsed]/sidebar-wrapper:sr-only",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export type SidebarMenuProps = HTMLAttributes<HTMLUListElement>;

export const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="sidebar-menu"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

export type SidebarMenuItemProps = HTMLAttributes<HTMLLIElement>;

export const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

export type SidebarMenuButtonProps = HTMLAttributes<HTMLButtonElement> &
  SidebarMenuButtonVariantProps & {
    asChild?: boolean;
    /** Tooltip label when sidebar is icon-collapsed. Defaults to string children. */
    tooltip?: string;
  };

/**
 * Sidebar navigation button — shows a tooltip when the sidebar is icon-collapsed.
 */
export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    { asChild = false, isActive = false, variant, size, tooltip, className, children, ...props },
    ref,
  ) => {
    const { state, isMobile } = useSidebar();
    const Comp = asChild ? Slot.Root : "button";
    const tooltipLabel = tooltip ?? (typeof children === "string" ? children : undefined);
    const showTooltip = state === "collapsed" && !isMobile && Boolean(tooltipLabel);

    const button = (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        data-slot="sidebar-menu-button"
        data-active={isActive ? true : undefined}
        className={cn(sidebarMenuButtonVariants({ variant, size, isActive, className }))}
        {...props}
      >
        {children}
      </Comp>
    );

    if (!showTooltip || !tooltipLabel) {
      return button;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center">
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export type SidebarMenuBadgeProps = HTMLAttributes<HTMLDivElement>;

export const SidebarMenuBadge = forwardRef<HTMLDivElement, SidebarMenuBadgeProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-menu-badge"
      className={cn(
        "pointer-events-none absolute right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-meta font-medium tabular-nums text-primary group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

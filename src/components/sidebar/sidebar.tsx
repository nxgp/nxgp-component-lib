import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  createContext,
  forwardRef,
  type HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon, PanelLeftIcon } from "../../lib/icons";
import { useControllableState } from "../../lib/use-controllable-state";
import { useIsMobile } from "../../lib/use-is-mobile";
import { Button } from "../button/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../drawer/drawer";

type SidebarCollapsible = "offcanvas" | "icon" | "none";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void;
  isMobile: boolean;
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Sidebar layout state — open/collapsed on desktop, sheet on mobile.
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export type SidebarProviderProps = HTMLAttributes<HTMLDivElement> & {
  /** Initial open state for uncontrolled usage. @default true */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Persist open state in `localStorage` under this key. */
  storageKey?: string;
  /** Register ⌘/Ctrl+B to toggle the sidebar. @default true */
  keyboardShortcut?: boolean;
};

function readStoredSidebarOpen(storageKey: string | undefined, defaultOpen: boolean): boolean {
  if (!storageKey || typeof window === "undefined") {
    return defaultOpen;
  }
  const stored = window.localStorage.getItem(storageKey);
  if (stored === "true") {
    return true;
  }
  if (stored === "false") {
    return false;
  }
  return defaultOpen;
}

/**
 * Provides sidebar open state to {@link Sidebar} and {@link SidebarTrigger}.
 *
 * @example
 * ```tsx
 * <SidebarProvider>
 *   <Sidebar>...</Sidebar>
 *   <SidebarInset>...</SidebarInset>
 * </SidebarProvider>
 * ```
 */
export function SidebarProvider(props: SidebarProviderProps) {
  const {
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    storageKey,
    keyboardShortcut = true,
    className,
    style,
    children,
    ...rest
  } = props;
  const isMobile = useIsMobile();
  const isOpenControlled = "open" in props;
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: readStoredSidebarOpen(storageKey, defaultOpen),
    onValueChange: onOpenChange,
    isControlled: isOpenControlled,
  });
  const [openMobile, setOpenMobile] = useState(false);

  const setOpen = useCallback(
    (value: boolean | ((current: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open ?? false) : value;
      setOpenState(next);
    },
    [open, setOpenState],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((current) => !current);
      return;
    }
    setOpen((current) => !current);
  }, [isMobile, setOpen]);

  useEffect(() => {
    if (!storageKey || isOpenControlled) {
      return;
    }
    window.localStorage.setItem(storageKey, String(open));
  }, [open, isOpenControlled, storageKey]);

  useEffect(() => {
    if (!keyboardShortcut) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "b" || !(event.metaKey || event.ctrlKey)) {
        return;
      }
      event.preventDefault();
      toggleSidebar();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardShortcut, toggleSidebar]);

  const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

  const value = useMemo(
    () => ({
      open: open ?? false,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      state,
      toggleSidebar,
    }),
    [open, setOpen, openMobile, isMobile, state, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-state={state}
        className={cn("group/sidebar-wrapper flex min-h-svh w-full overflow-visible", className)}
        style={
          {
            "--sidebar-width": "15rem",
            "--sidebar-width-icon": "3.25rem",
            "--sidebar-width-mobile": "18rem",
            ...style,
          } as CSSProperties
        }
        {...rest}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  /** Which side the sidebar is anchored to. @default "left" */
  side?: "left" | "right";
  /**
   * Collapse behavior on desktop. Mobile always uses a sheet overlay.
   * @default "offcanvas"
   */
  collapsible?: SidebarCollapsible;
};

export type SidebarRailProps = ComponentPropsWithoutRef<"button">;

/**
 * Floating toggle on the sidebar border — collapse/expand control with chevron affordance.
 * Rendered automatically by {@link Sidebar}; export for custom placement only.
 */
export const SidebarRail = forwardRef<HTMLButtonElement, SidebarRailProps>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-rail"
        data-state={state}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className={cn(
          "absolute top-3 z-30 hidden size-6 items-center justify-center rounded-full border border-border-subtle bg-background text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:flex",
          "group-data-[side=left]/sidebar:right-0 group-data-[side=left]/sidebar:translate-x-1/2",
          "group-data-[side=right]/sidebar:left-0 group-data-[side=right]/sidebar:-translate-x-1/2",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        {collapsed ? (
          <ChevronRightIcon
            className="size-3 group-data-[side=right]/sidebar:rotate-180"
            aria-hidden
          />
        ) : (
          <ChevronLeftIcon
            className="size-3 group-data-[side=right]/sidebar:rotate-180"
            aria-hidden
          />
        )}
      </button>
    );
  },
);
SidebarRail.displayName = "SidebarRail";

/**
 * Collapsible application sidebar panel. Renders as a sheet on mobile viewports.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ side = "left", collapsible = "offcanvas", className, children, ...props }, ref) => {
    const { isMobile, open, openMobile, setOpenMobile, state } = useSidebar();

    if (collapsible === "none") {
      return (
        <aside
          ref={ref}
          data-slot="sidebar"
          data-state="expanded"
          data-side={side}
          data-collapsible="none"
          className={cn(
            "group/sidebar relative flex h-svh w-[var(--sidebar-width)] shrink-0 flex-col border-border-subtle bg-chrome text-foreground",
            side === "left" ? "border-r" : "border-l",
            className,
          )}
          {...props}
        >
          {children}
        </aside>
      );
    }

    if (isMobile) {
      return (
        <Drawer
          direction={side}
          open={openMobile}
          onOpenChange={setOpenMobile}
          shouldScaleBackground={false}
        >
          <DrawerContent
            size="default"
            showCloseButton
            className="w-[var(--sidebar-width-mobile)] max-w-[var(--sidebar-width-mobile)] gap-0 p-0 shadow-lg"
            aria-describedby={undefined}
          >
            <DrawerHeader className="sr-only">
              <DrawerTitle>Sidebar</DrawerTitle>
              <DrawerDescription>Application navigation</DrawerDescription>
            </DrawerHeader>
            <div
              data-slot="sidebar-mobile"
              data-side={side}
              className="flex h-full flex-col bg-chrome text-foreground"
            >
              {children}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    const expanded = open;
    const showContent = expanded || collapsible === "icon";

    return (
      <div
        data-slot="sidebar"
        data-state={state}
        data-side={side}
        data-collapsible={collapsible}
        className={cn(
          "group/sidebar relative shrink-0 overflow-visible transition-[width] duration-300 ease-product motion-reduce:transition-none",
          expanded
            ? "w-[var(--sidebar-width)]"
            : collapsible === "icon"
              ? "w-[var(--sidebar-width-icon)]"
              : "w-0 overflow-hidden",
          !expanded && collapsible === "offcanvas" ? "w-0" : "",
        )}
      >
        <aside
          ref={ref}
          className={cn(
            "flex h-svh w-full flex-col overflow-hidden border-border-subtle bg-chrome/95 text-foreground backdrop-blur-md",
            side === "left" ? "border-r" : "border-l",
            !expanded && collapsible === "offcanvas" ? "border-0" : "",
            className,
          )}
          {...props}
        >
          {showContent ? children : null}
        </aside>
        <SidebarRail />
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export type SidebarHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Top section of the sidebar — branding, title, or actions. */
export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-header"
      className={cn(
        "flex shrink-0 flex-col gap-2 border-b border-border-subtle px-3 py-3 group-data-[state=collapsed]/sidebar-wrapper:items-center group-data-[state=collapsed]/sidebar-wrapper:px-2",
        className,
      )}
      {...props}
    />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

export type SidebarContentProps = HTMLAttributes<HTMLDivElement>;

/** Scrollable main sidebar content area. */
export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-1 overflow-auto px-2 py-2", className)}
      {...props}
    />
  ),
);
SidebarContent.displayName = "SidebarContent";

export type SidebarFooterProps = HTMLAttributes<HTMLDivElement>;

/** Bottom section of the sidebar — user menu, settings, etc. */
export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto flex shrink-0 flex-col gap-2 border-t border-border-subtle p-2 group-data-[state=collapsed]/sidebar-wrapper:items-center",
        className,
      )}
      {...props}
    />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

export type SidebarTriggerProps = ComponentPropsWithoutRef<typeof Button>;

/** Button that toggles sidebar visibility. */
export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={className}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        {children ?? (
          <>
            <PanelLeftIcon />
            <span className="sr-only">Toggle sidebar</span>
          </>
        )}
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

export type SidebarInsetProps = HTMLAttributes<HTMLElement>;

/** Main content area displayed beside the sidebar. */
export const SidebarInset = forwardRef<HTMLElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      data-slot="sidebar-inset"
      className={cn("relative flex min-h-svh flex-1 flex-col bg-background", className)}
      {...props}
    />
  ),
);
SidebarInset.displayName = "SidebarInset";

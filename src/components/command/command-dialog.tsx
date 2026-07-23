import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import { useControllableState } from "../../lib/use-controllable-state";
import {
  Dialog,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../dialog/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

type CommandDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  shortcutLabel: string;
};

const CommandDialogContext = createContext<CommandDialogContextValue | null>(null);

/** Access command dialog open state from child actions. */
export function useCommandDialog(): CommandDialogContextValue {
  const context = useContext(CommandDialogContext);
  if (!context) {
    throw new Error("useCommandDialog must be used within CommandDialogProvider");
  }
  return context;
}

export type CommandDialogProviderProps = {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Register ⌘/Ctrl+K shortcut. @default true */
  keyboardShortcut?: boolean;
  /**
   * Keyboard shortcut keys (without modifiers). Modifiers are meta on macOS and ctrl elsewhere.
   * @default "k"
   */
  shortcut?: string;
  /** Keyboard shortcut label for assistive tech. @default Meta+K */
  shortcutLabel?: string;
};

/**
 * Provides global command dialog state and optional ⌘K shortcut.
 *
 * @example
 * ```tsx
 * <CommandDialogProvider>
 *   <App />
 *   <CommandDialog title="Search">
 *     <CommandInput placeholder="Search..." />
 *   </CommandDialog>
 * </CommandDialogProvider>
 * ```
 */
export function CommandDialogProvider(props: CommandDialogProviderProps) {
  const {
    children,
    open: openProp,
    onOpenChange,
    keyboardShortcut = true,
    shortcut = "k",
    shortcutLabel = a11yLabels.commandDialogShortcut,
  } = props;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: false,
    onValueChange: onOpenChange,
    isControlled: "open" in props,
  });

  useEffect(() => {
    if (!keyboardShortcut) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        !open &&
        (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable)
      ) {
        return;
      }
      if (event.key.toLowerCase() !== shortcut.toLowerCase() || !(event.metaKey || event.ctrlKey)) {
        return;
      }
      event.preventDefault();
      setOpen(!(open ?? false));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardShortcut, open, setOpen, shortcut]);

  const value = useMemo(
    () => ({ open: open ?? false, setOpen, shortcutLabel }),
    [open, setOpen, shortcutLabel],
  );

  return <CommandDialogContext.Provider value={value}>{children}</CommandDialogContext.Provider>;
}

export type CommandDialogProps = ComponentPropsWithoutRef<typeof Dialog> & {
  /** Dialog content props forwarded to the inner shell. */
  contentProps?: Omit<DialogContentProps, "children">;
  title?: string;
  description?: string;
};

/**
 * Modal command palette — global search / ⌘K menus.
 *
 * @example
 * ```tsx
 * <CommandDialogProvider>
 *   <CommandDialog title="Command palette">
 *     <CommandInput placeholder="Type a command..." />
 *     <CommandList>
 *       <CommandEmpty>No results.</CommandEmpty>
 *       <CommandGroup heading="Actions">
 *         <CommandItem value="copy">Copy</CommandItem>
 *       </CommandGroup>
 *     </CommandList>
 *   </CommandDialog>
 * </CommandDialogProvider>
 * ```
 */
export function CommandDialog({
  open: openProp,
  onOpenChange,
  children,
  contentProps,
  title = "Command palette",
  description,
  ...props
}: CommandDialogProps) {
  const provider = useContext(CommandDialogContext);
  const [localOpen, setLocalOpen] = useState(false);
  const open = openProp ?? provider?.open ?? localOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (openProp === undefined && provider === null) {
        setLocalOpen(next);
      }
      provider?.setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp, provider],
  );

  const { className: contentClassName, ...restContentProps } = contentProps ?? {};

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      aria-keyshortcuts={provider?.shortcutLabel}
      {...props}
    >
      <DialogContent
        className={cn(
          "overflow-hidden p-0 [&>button]:top-5 [&>button]:-translate-y-1/2",
          contentClassName,
        )}
        size="lg"
        {...restContentProps}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <Command className="rounded-none border-0 shadow-none [&_[data-slot=command-input-wrapper]]:pr-10">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator };

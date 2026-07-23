import { Command as CommandPrimitive } from "cmdk";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import {
  commandEmptyVariants,
  commandGroupVariants,
  commandInputVariants,
  commandInputWrapperVariants,
  commandItemVariants,
  commandListVariants,
  commandSearchIconVariants,
  commandSeparatorVariants,
  commandVariants,
} from "./command.variants";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn(commandSearchIconVariants(), className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export type CommandProps = ComponentPropsWithoutRef<typeof CommandPrimitive>;

/**
 * Command palette root — filterable list for menus, comboboxes, and shortcuts.
 *
 * @example
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandEmpty>No results.</CommandEmpty>
 *     <CommandGroup heading="Actions">
 *       <CommandItem value="copy">Copy</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 */
export const Command = forwardRef<HTMLDivElement, CommandProps>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(commandVariants(), className)}
    {...props}
  />
));
Command.displayName = "Command";

export type CommandInputProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;

/** Search input for filtering command items. */
export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div data-slot="command-input-wrapper" className={commandInputWrapperVariants()}>
      <SearchIcon />
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        className={cn(commandInputVariants(), className)}
        {...props}
      />
    </div>
  ),
);
CommandInput.displayName = "CommandInput";

export type CommandListProps = ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

/** Scrollable list container for command items. */
export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref}
      data-slot="command-list"
      className={cn(commandListVariants(), className)}
      {...props}
    />
  ),
);
CommandList.displayName = "CommandList";

export type CommandEmptyProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

/** Shown when filtering yields no matches. */
export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={commandEmptyVariants()}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

export type CommandGroupProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;

/** Grouped section with optional heading. */
export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      data-slot="command-group"
      className={cn(commandGroupVariants(), className)}
      {...props}
    />
  ),
);
CommandGroup.displayName = "CommandGroup";

export type CommandSeparatorProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

/** Visual separator between command groups or items. */
export const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Separator
      ref={ref}
      data-slot="command-separator"
      className={cn(commandSeparatorVariants(), className)}
      {...props}
    />
  ),
);
CommandSeparator.displayName = "CommandSeparator";

export type CommandItemProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;

/** Selectable command menu item. */
export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref}
      data-slot="command-item"
      className={cn(commandItemVariants(), className)}
      {...props}
    />
  ),
);
CommandItem.displayName = "CommandItem";

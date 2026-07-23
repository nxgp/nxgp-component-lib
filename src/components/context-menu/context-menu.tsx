import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { CheckIcon, ChevronRightIcon } from "../../lib/icons";
import { type MenuItemVariantProps, menuItemVariants } from "../../lib/menu-item.variants";
import {
  contextMenuCheckboxItemVariants,
  contextMenuContentVariants,
  contextMenuItemIndicatorVariants,
  contextMenuLabelVariants,
  contextMenuRadioIndicatorVariants,
  contextMenuRadioItemVariants,
  contextMenuSeparatorVariants,
  contextMenuShortcutVariants,
  contextMenuSubContentVariants,
  contextMenuSubTriggerVariants,
} from "./context-menu.variants";

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
> &
  Pick<MenuItemVariantProps, "inset" | "size">;

export const ContextMenuSubTrigger = forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(
  ({ className, inset, size, children, ...props }, ref) => (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(menuItemVariants({ inset, size }), contextMenuSubTriggerVariants(), className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  ),
);
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";

export type ContextMenuSubContentProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubContent
>;

export const ContextMenuSubContent = forwardRef<HTMLDivElement, ContextMenuSubContentProps>(
  ({ className, ...props }, ref) => (
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(contextMenuSubContentVariants(), className)}
      {...props}
    />
  ),
);
ContextMenuSubContent.displayName = "ContextMenuSubContent";

export type ContextMenuContentProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={cn(contextMenuContentVariants(), className)}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  ),
);
ContextMenuContent.displayName = "ContextMenuContent";

export type ContextMenuItemProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> &
  MenuItemVariantProps;

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, inset, variant, size, ...props }, ref) => (
    <ContextMenuPrimitive.Item
      ref={ref}
      className={cn(menuItemVariants({ inset, variant, size, className }))}
      {...props}
    />
  ),
);
ContextMenuItem.displayName = "ContextMenuItem";

export type ContextMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.CheckboxItem
> &
  Pick<MenuItemVariantProps, "size">;

export const ContextMenuCheckboxItem = forwardRef<HTMLDivElement, ContextMenuCheckboxItemProps>(
  ({ className, children, checked, size, ...props }, ref) => (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(menuItemVariants({ size }), contextMenuCheckboxItemVariants(), className)}
      checked={checked}
      {...props}
    >
      <span className={contextMenuItemIndicatorVariants()}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  ),
);
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

export type ContextMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.RadioItem
> &
  Pick<MenuItemVariantProps, "size">;

export const ContextMenuRadioItem = forwardRef<HTMLDivElement, ContextMenuRadioItemProps>(
  ({ className, children, size, ...props }, ref) => (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(menuItemVariants({ size }), contextMenuRadioItemVariants(), className)}
      {...props}
    >
      <span className={contextMenuItemIndicatorVariants()}>
        <ContextMenuPrimitive.ItemIndicator>
          <span className={contextMenuRadioIndicatorVariants()} />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  ),
);
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

export type ContextMenuLabelProps = ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean;
};

export const ContextMenuLabel = forwardRef<HTMLDivElement, ContextMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(contextMenuLabelVariants({ inset }), className)}
      {...props}
    />
  ),
);
ContextMenuLabel.displayName = "ContextMenuLabel";

export type ContextMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Separator
>;

export const ContextMenuSeparator = forwardRef<HTMLDivElement, ContextMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Separator
      ref={ref}
      className={cn(contextMenuSeparatorVariants(), className)}
      {...props}
    />
  ),
);
ContextMenuSeparator.displayName = "ContextMenuSeparator";

export type ContextMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;

export const ContextMenuShortcut = ({ className, ...props }: ContextMenuShortcutProps) => (
  <span className={cn(contextMenuShortcutVariants(), className)} {...props} />
);

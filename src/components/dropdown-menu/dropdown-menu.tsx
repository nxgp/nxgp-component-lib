import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { CheckIcon, ChevronRightIcon } from "../../lib/icons";
import { type MenuItemVariantProps, menuItemVariants } from "../../lib/menu-item.variants";
import {
  dropdownMenuCheckboxItemIndicatorOffsetVariants,
  dropdownMenuCheckboxItemVariants,
  dropdownMenuContentVariants,
  dropdownMenuItemIndicatorVariants,
  dropdownMenuLabelVariants,
  dropdownMenuRadioIndicatorVariants,
  dropdownMenuRadioItemVariants,
  dropdownMenuSeparatorVariants,
  dropdownMenuShortcutVariants,
  dropdownMenuSubContentVariants,
  dropdownMenuSubTriggerVariants,
} from "./dropdown-menu.variants";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
> &
  Pick<MenuItemVariantProps, "inset" | "size">;

export const DropdownMenuSubTrigger = forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  ({ className, inset, size, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(menuItemVariants({ inset, size }), dropdownMenuSubTriggerVariants(), className)}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  ),
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;

export const DropdownMenuSubContent = forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(dropdownMenuSubContentVariants(), className)}
      {...props}
    />
  ),
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>;

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(dropdownMenuContentVariants(), className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
  MenuItemVariantProps;

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, inset, variant, size, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(menuItemVariants({ inset, variant, size, className }))}
      {...props}
    />
  ),
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
> &
  Pick<MenuItemVariantProps, "size"> & {
    /** Optional leading control rendered before the checked indicator. */
    leadingSlot?: ReactNode;
  };

export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, size, leadingSlot, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        menuItemVariants({ size }),
        dropdownMenuCheckboxItemVariants({ leadingSlot: Boolean(leadingSlot) }),
        className,
      )}
      checked={checked}
      {...props}
    >
      {leadingSlot ? (
        <span className="absolute left-2 flex size-3.5 items-center justify-center text-muted-foreground">
          {leadingSlot}
        </span>
      ) : null}
      <span
        className={cn(
          dropdownMenuItemIndicatorVariants(),
          leadingSlot && dropdownMenuCheckboxItemIndicatorOffsetVariants(),
        )}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  ),
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
> &
  Pick<MenuItemVariantProps, "size">;

export const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ className, children, size, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(menuItemVariants({ size }), dropdownMenuRadioItemVariants(), className)}
      {...props}
    >
      <span className={dropdownMenuItemIndicatorVariants()}>
        <DropdownMenuPrimitive.ItemIndicator>
          <span className={dropdownMenuRadioIndicatorVariants()} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  ),
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean;
};

export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(dropdownMenuLabelVariants({ inset }), className)}
      {...props}
    />
  ),
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn(dropdownMenuSeparatorVariants(), className)}
      {...props}
    />
  ),
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;

export const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => (
  <span className={cn(dropdownMenuShortcutVariants(), className)} {...props} />
);

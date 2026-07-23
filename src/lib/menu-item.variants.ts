import { cva, type VariantProps } from "class-variance-authority";

/**
 * Shared menu item styles for DropdownMenu and ContextMenu.
 */
export const menuItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-destructive focus:bg-destructive/10 focus:text-destructive",
      },
      inset: {
        true: "pl-8",
        false: "",
      },
      size: {
        default: "px-2 py-1.5",
        sm: "px-2 py-1 text-xs",
        lg: "px-3 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
      size: "default",
    },
  },
);

export type MenuItemVariantProps = VariantProps<typeof menuItemVariants>;

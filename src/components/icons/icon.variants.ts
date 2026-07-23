import { cva, type VariantProps } from "class-variance-authority";

/**
 * Shared size and color presets for {@link Icon}.
 */
export const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      "2xs": "size-2",
      xs: "size-3",
      sm: "size-3.5",
      default: "size-4",
      lg: "size-5",
      xl: "size-6",
    },
    color: {
      current: "text-current",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      foreground: "text-foreground",
    },
  },
  defaultVariants: {
    size: "default",
    color: "current",
  },
});

export type IconVariantProps = VariantProps<typeof iconVariants>;

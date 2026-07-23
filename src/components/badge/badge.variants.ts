import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_[data-icon=inline-start]]:shrink-0 [&_[data-icon=inline-end]]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-muted text-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border text-foreground",
      },
      size: {
        sm: "gap-1 px-1.5 py-0 text-meta",
        default: "gap-1.5 px-2.5 py-0.5 text-xs",
        lg: "gap-2 px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const badgeDotVariants = cva("shrink-0 rounded-full", {
  variants: {
    size: {
      sm: "size-1.5",
      default: "size-2",
      lg: "size-2.5",
    },
    variant: {
      default: "bg-primary-foreground",
      secondary: "bg-foreground",
      destructive: "bg-destructive-foreground",
      outline: "bg-foreground",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export const badgeIconSlotVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:size-full [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "size-icon-xs",
        default: "size-icon-sm",
        lg: "size-icon-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

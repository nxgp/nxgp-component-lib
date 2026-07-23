import { cva, type VariantProps } from "class-variance-authority";

export const avatarWrapperVariants = cva("relative inline-flex shrink-0", {
  variants: {
    size: {
      sm: "size-8",
      default: "size-10",
      lg: "size-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const avatarInnerVariants = cva("flex size-full overflow-hidden rounded-full");

export const avatarStatusVariants = cva("absolute rounded-full border-2 border-background", {
  variants: {
    status: {
      online: "bg-chart-2",
      offline: "bg-muted-foreground",
      busy: "bg-destructive",
      away: "bg-chart-3",
    },
    size: {
      sm: "bottom-0 right-0 size-2",
      default: "bottom-0.5 right-0.5 size-2.5",
      lg: "bottom-1 right-1 size-3",
    },
  },
  defaultVariants: {
    status: "online",
    size: "default",
  },
});

/** @deprecated Use {@link avatarWrapperVariants} — kept for barrel compatibility. */
export const avatarVariants = avatarWrapperVariants;

export type AvatarVariantProps = VariantProps<typeof avatarWrapperVariants>;
export type AvatarStatusVariantProps = VariantProps<typeof avatarStatusVariants>;

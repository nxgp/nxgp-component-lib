import { cva, type VariantProps } from "class-variance-authority";

export const progressVariants = cva("relative w-full overflow-hidden rounded-full bg-muted", {
  variants: {
    size: {
      sm: "h-1.5",
      default: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type ProgressVariantProps = VariantProps<typeof progressVariants>;

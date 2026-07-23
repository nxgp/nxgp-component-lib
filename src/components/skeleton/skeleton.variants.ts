import { cva, type VariantProps } from "class-variance-authority";

export const skeletonVariants = cva("animate-pulse rounded-md bg-border", {
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;

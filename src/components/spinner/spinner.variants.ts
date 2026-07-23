import { cva, type VariantProps } from "class-variance-authority";

export const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;

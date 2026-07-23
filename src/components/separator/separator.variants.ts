import { cva, type VariantProps } from "class-variance-authority";

export const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const separatorWithLabelVariants = cva(
  "flex items-center gap-3 text-xs text-muted-foreground",
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const separatorWithLabelDividerVariants = cva("flex-1");

export type SeparatorVariantProps = VariantProps<typeof separatorVariants>;

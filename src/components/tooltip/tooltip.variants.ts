import { cva, type VariantProps } from "class-variance-authority";

export const tooltipContentVariants = cva(
  "z-50 overflow-hidden rounded-md border px-3 py-1.5 text-xs shadow-md animate-in fade-in-0 zoom-in-95",
  {
    variants: {
      variant: {
        default: "border-border bg-foreground text-background",
        inverted: "border-border bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "inverted",
    },
  },
);

export type TooltipContentVariantProps = VariantProps<typeof tooltipContentVariants>;

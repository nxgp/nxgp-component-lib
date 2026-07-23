import { cva, type VariantProps } from "class-variance-authority";

/**
 * Variants for {@link FieldLegend}.
 */
export const fieldLegendVariants = cva("text-foreground", {
  variants: {
    variant: {
      legend: "text-base font-medium",
      label: "text-sm font-medium leading-none",
    },
  },
  defaultVariants: {
    variant: "legend",
  },
});

export type FieldLegendVariantProps = VariantProps<typeof fieldLegendVariants>;

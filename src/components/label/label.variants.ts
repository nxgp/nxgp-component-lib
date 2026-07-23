import { cva, type VariantProps } from "class-variance-authority";

export const labelVariants = cva(
  "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export const labelRequiredVariants = cva("ml-0.5 text-destructive");

export const labelHintVariants = cva("ml-2 text-meta font-normal text-muted-foreground");

export type LabelVariantProps = VariantProps<typeof labelVariants>;

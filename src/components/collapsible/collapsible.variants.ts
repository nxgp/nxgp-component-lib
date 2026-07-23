import { cva, type VariantProps } from "class-variance-authority";

export const collapsibleContentVariants = cva("overflow-hidden text-sm");

export type CollapsibleVariantProps = VariantProps<typeof collapsibleContentVariants>;

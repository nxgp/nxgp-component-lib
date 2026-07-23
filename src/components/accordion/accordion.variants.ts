import { cva, type VariantProps } from "class-variance-authority";

export const accordionItemVariants = cva("border-b border-border");

export const accordionHeaderVariants = cva("flex");

export const accordionTriggerVariants = cva(
  "flex flex-1 items-center justify-between py-4 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&[data-state=open]>svg]:rotate-180",
);

export const accordionTriggerIconVariants = cva("shrink-0 transition-transform duration-200");

export const accordionContentVariants = cva(
  "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
);

export const accordionContentInnerVariants = cva("pb-4 pt-0");

export type AccordionVariantProps = VariantProps<typeof accordionItemVariants>;

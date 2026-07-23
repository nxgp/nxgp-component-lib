import { cva, type VariantProps } from "class-variance-authority";

export const comboboxTriggerVariants = cva(
  "items-center justify-between text-left font-normal [&>span]:line-clamp-1",
  {
    variants: {
      placeholder: {
        true: "text-muted-foreground",
        false: "",
      },
    },
    defaultVariants: {
      placeholder: false,
    },
  },
);

export const comboboxTriggerLabelVariants = cva(
  "flex min-w-0 flex-1 items-center gap-1 overflow-hidden",
);

export const comboboxTriggerChevronVariants = cva("opacity-50");

export const comboboxContentVariants = cva("p-0");

export const comboboxLoadingVariants = cva(
  "flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground",
);

export const comboboxBadgeListVariants = cva("flex flex-wrap items-center gap-1");

export const comboboxOverflowCountVariants = cva("text-xs text-muted-foreground", {
  variants: {
    interactive: {
      true: "cursor-default rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-ring/70 focus-visible:ring-offset-0",
      false: "",
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

export const comboboxOverflowTooltipVariants = cva("flex flex-col gap-1 text-xs");

export type ComboboxVariantProps = VariantProps<typeof comboboxTriggerVariants>;

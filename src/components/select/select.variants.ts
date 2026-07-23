import { cva, type VariantProps } from "class-variance-authority";
import { overlayPopoverClasses } from "../../lib/overlay.variants";

export const selectTriggerVariants = cva("items-center justify-between [&>span]:line-clamp-1");

export const selectTriggerIconVariants = cva("opacity-50");

export const selectScrollButtonVariants = cva(
  "flex cursor-default items-center justify-center py-1 text-muted-foreground",
);

export const selectContentVariants = cva(`relative ${overlayPopoverClasses("md")} max-h-96`, {
  variants: {
    position: {
      popper:
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      "item-aligned": "",
    },
  },
  defaultVariants: {
    position: "popper",
  },
});

export const selectViewportVariants = cva("p-1", {
  variants: {
    position: {
      popper:
        "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
      "item-aligned": "",
    },
  },
  defaultVariants: {
    position: "popper",
  },
});

export const selectLabelVariants = cva("px-2 py-1.5 text-sm font-semibold");

export const selectItemVariants = cva(
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
);

export const selectItemIndicatorVariants = cva(
  "absolute left-2 flex size-3.5 items-center justify-center",
);

export const selectSeparatorVariants = cva("-mx-1 my-1 h-px bg-border");

export type SelectVariantProps = VariantProps<typeof selectTriggerVariants>;

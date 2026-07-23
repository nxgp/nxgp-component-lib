import { cva, type VariantProps } from "class-variance-authority";
import { overlayPopoverClasses } from "../../lib/overlay.variants";

export const dropdownMenuSubTriggerVariants = cva("data-[state=open]:bg-accent");

export const dropdownMenuSubContentVariants = cva(`${overlayPopoverClasses("lg")} p-1`);

export const dropdownMenuContentVariants = cva(`${overlayPopoverClasses("md")} p-1`);

export const dropdownMenuCheckboxItemVariants = cva("pr-2", {
  variants: {
    leadingSlot: {
      true: "pl-12",
      false: "pl-8",
    },
  },
  defaultVariants: {
    leadingSlot: false,
  },
});

export const dropdownMenuCheckboxItemIndicatorOffsetVariants = cva("left-6");

export const dropdownMenuRadioItemVariants = cva("pl-8 pr-2");

export const dropdownMenuLabelVariants = cva("px-2 py-1.5 text-sm font-semibold", {
  variants: {
    inset: {
      true: "pl-8",
      false: "",
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const dropdownMenuSeparatorVariants = cva("-mx-1 my-1 h-px bg-border");

export const dropdownMenuShortcutVariants = cva("ml-auto text-xs tracking-widest opacity-60");

export const dropdownMenuItemIndicatorVariants = cva(
  "absolute left-2 flex size-3.5 items-center justify-center",
);

export const dropdownMenuRadioIndicatorVariants = cva("size-2 rounded-full bg-current");

export type DropdownMenuVariantProps = VariantProps<typeof dropdownMenuContentVariants>;

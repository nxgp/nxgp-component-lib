import { cva, type VariantProps } from "class-variance-authority";
import { overlayPopoverClasses } from "../../lib/overlay.variants";

export const contextMenuSubTriggerVariants = cva("data-[state=open]:bg-accent");

export const contextMenuSubContentVariants = cva(`${overlayPopoverClasses("lg")} p-1`);

export const contextMenuContentVariants = cva(`${overlayPopoverClasses("md")} p-1`);

export const contextMenuCheckboxItemVariants = cva("pl-8 pr-2");

export const contextMenuRadioItemVariants = cva("pl-8 pr-2");

export const contextMenuLabelVariants = cva("px-2 py-1.5 text-sm font-semibold text-foreground", {
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

export const contextMenuSeparatorVariants = cva("-mx-1 my-1 h-px bg-border");

export const contextMenuShortcutVariants = cva("ml-auto text-xs tracking-widest opacity-60");

export const contextMenuItemIndicatorVariants = cva(
  "absolute left-2 flex size-3.5 items-center justify-center",
);

export const contextMenuRadioIndicatorVariants = cva("size-2 rounded-full bg-current");

export type ContextMenuVariantProps = VariantProps<typeof contextMenuContentVariants>;

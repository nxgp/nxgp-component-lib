import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, formFieldMotion } from "../../lib/interactive.variants";

export const radioGroupVariants = cva("gap-2", {
  variants: {
    orientation: {
      vertical: "grid",
      horizontal: "flex flex-wrap items-center",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export const radioGroupItemVariants = cva(
  `aspect-square rounded-full border border-border text-primary disabled:cursor-not-allowed disabled:opacity-50 ${formFieldMotion} ${focusRing}`,
  {
    variants: {
      size: {
        sm: "size-3.5 [&_[data-slot=indicator]]:size-1.5",
        default: "size-4 [&_[data-slot=indicator]]:size-2",
        lg: "size-5 [&_[data-slot=indicator]]:size-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type RadioGroupVariantProps = VariantProps<typeof radioGroupVariants>;
export type RadioGroupItemVariantProps = VariantProps<typeof radioGroupItemVariants>;

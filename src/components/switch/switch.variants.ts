import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, formFieldMotion } from "../../lib/interactive.variants";

export const switchVariants = cva(
  `peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-muted disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary ${formFieldMotion} ${focusRing}`,
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        default: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type SwitchVariantProps = VariantProps<typeof switchVariants>;

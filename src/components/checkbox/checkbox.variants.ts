import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, formFieldMotion } from "../../lib/interactive.variants";

export const checkboxVariants = cva(
  `peer shrink-0 rounded-sm border border-border bg-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground ${formFieldMotion} ${focusRing}`,
  {
    variants: {
      size: {
        sm: "size-3.5 [&_svg]:size-2.5",
        default: "size-4 [&_svg]:size-3.5",
        lg: "size-5 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type CheckboxVariantProps = VariantProps<typeof checkboxVariants>;

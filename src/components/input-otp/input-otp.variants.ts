import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, formFieldMotion, invalidFieldState } from "../../lib/interactive.variants";

/**
 * Size variants for OTP slots.
 */
export const inputOtpSlotVariants = cva(
  `flex items-center justify-center rounded-md border border-border bg-background text-center text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50 ${formFieldMotion} ${focusRing} ${invalidFieldState}`,
  {
    variants: {
      size: {
        sm: "size-control-sm text-xs",
        default: "size-control-md text-sm",
        comfortable: "size-control-comfortable text-sm",
        lg: "size-control-lg text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type InputOtpSlotVariantProps = VariantProps<typeof inputOtpSlotVariants>;

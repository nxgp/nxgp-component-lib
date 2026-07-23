import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, formFieldMotion, invalidFieldState } from "../../lib/interactive.variants";

/**
 * Shared field styles for Input, Textarea, Select trigger, SelectSearch, and DatePicker.
 */
export const inputFieldVariants = cva(
  `flex w-full rounded-md border bg-background text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${formFieldMotion} ${focusRing} ${invalidFieldState}`,
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent bg-transparent hover:bg-muted/50",
        flushed:
          "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0",
      },
      size: {
        default:
          "h-control-md px-control-px-md py-1.5 data-[density=comfortable]:h-control-comfortable data-[density=comfortable]:py-2",
        comfortable: "h-control-comfortable px-control-px-md py-2",
        sm: "h-control-sm px-control-px-sm text-xs",
        lg: "h-control-lg px-control-px-lg text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** @deprecated Use {@link inputFieldVariants} */
export const fieldVariants = inputFieldVariants;

export type InputFieldVariantProps = VariantProps<typeof inputFieldVariants>;

/** @deprecated Use {@link InputFieldVariantProps} */
export type FieldVariantProps = InputFieldVariantProps;

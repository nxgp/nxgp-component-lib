import { Label as LabelPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { labelHintVariants, labelRequiredVariants, labelVariants } from "./label.variants";

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  /** Shows a required asterisk after the label text. */
  required?: boolean;
  /** Optional hint shown in muted text beside the label. */
  hint?: string;
};

/**
 * Accessible form label associated with a control via `htmlFor`.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>Email</Label>
 * ```
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, hint, children, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
      {children}
      {required ? (
        <span className={labelRequiredVariants()} aria-hidden="true">
          *
        </span>
      ) : null}
      {hint ? <span className={labelHintVariants()}>({hint})</span> : null}
    </LabelPrimitive.Root>
  ),
);

Label.displayName = "Label";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { CheckIcon } from "../../lib/icons";
import { type CheckboxVariantProps, checkboxVariants } from "./checkbox.variants";

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  CheckboxVariantProps;

/**
 * Checkbox input with size options and keyboard support via Radix.
 *
 * @example
 * ```tsx
 * <Checkbox size="lg" checked={on} onCheckedChange={setOn} aria-label="Accept terms" />
 * ```
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, size, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <CheckIcon strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);

Checkbox.displayName = "Checkbox";

import { Switch as SwitchPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { type SwitchVariantProps, switchVariants } from "./switch.variants";

const thumbSizeClasses = {
  sm: "size-4 data-[state=checked]:translate-x-4",
  default: "size-5 data-[state=checked]:translate-x-5",
  lg: "size-6 data-[state=checked]:translate-x-7",
} as const;

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> &
  SwitchVariantProps;

/**
 * Toggle switch for boolean settings with size options.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size = "default", ...props }, ref) => {
    const resolvedSize = size ?? "default";

    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(switchVariants({ size, className }))}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
            thumbSizeClasses[resolvedSize],
          )}
        />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = "Switch";

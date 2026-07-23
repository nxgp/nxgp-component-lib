import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { LoaderIcon } from "../../lib/icons";
import { type SpinnerVariantProps, spinnerVariants } from "./spinner.variants";

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> &
  SpinnerVariantProps & {
    /** Accessible label for the loading indicator. @default "Loading" */
    label?: string;
  };

/**
 * Loading spinner with size presets.
 *
 * @example
 * ```tsx
 * <Spinner size="lg" label="Saving" />
 * ```
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = "Loading", ...props }, ref) => (
    <span ref={ref} role="status" className="inline-flex" {...props}>
      <LoaderIcon aria-label={label} className={cn(spinnerVariants({ size, className }))} />
    </span>
  ),
);

Spinner.displayName = "Spinner";

import { Progress as ProgressPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { type ProgressVariantProps, progressVariants } from "./progress.variants";

export type ProgressProps = ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
  ProgressVariantProps;

/**
 * Determinate progress bar.
 *
 * @example
 * ```tsx
 * <Progress value={60} aria-label="Upload progress" />
 * ```
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, size, value, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ size, className }))}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);

Progress.displayName = "Progress";

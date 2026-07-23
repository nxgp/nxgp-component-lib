import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { type SkeletonVariantProps, skeletonVariants } from "./skeleton.variants";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & SkeletonVariantProps;

/**
 * Placeholder shimmer for loading content.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-48" />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  ),
);

Skeleton.displayName = "Skeleton";

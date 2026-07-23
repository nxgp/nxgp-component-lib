import { Separator as SeparatorPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import {
  separatorVariants,
  separatorWithLabelDividerVariants,
  separatorWithLabelVariants,
} from "./separator.variants";

export type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

/**
 * Visual divider between sections.
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ orientation }), className)}
      {...props}
    />
  ),
);

Separator.displayName = "Separator";

export type SeparatorWithLabelProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  orientation?: "horizontal" | "vertical";
};

/** Divider with centered label text — common for “or continue with” patterns. */
export const SeparatorWithLabel = ({
  className,
  label,
  orientation = "horizontal",
  ...props
}: SeparatorWithLabelProps) => (
  <div className={cn(separatorWithLabelVariants({ orientation }), className)} {...props}>
    <Separator
      orientation={orientation}
      className={separatorWithLabelDividerVariants()}
      decorative
    />
    <span>{label}</span>
    <Separator
      orientation={orientation}
      className={separatorWithLabelDividerVariants()}
      decorative
    />
  </div>
);

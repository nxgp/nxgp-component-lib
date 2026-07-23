import { Slot } from "radix-ui";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  type BadgeVariantProps,
  badgeDotVariants,
  badgeIconSlotVariants,
  badgeVariants,
} from "./badge.variants";

export type BadgeProps = HTMLAttributes<HTMLDivElement> &
  BadgeVariantProps & {
    asChild?: boolean;
    /** Renders a status dot before the label — useful for live indicators. */
    dot?: boolean;
    /** Icon or element rendered before the label. */
    iconBefore?: ReactNode;
    /** Icon or element rendered after the label. */
    iconAfter?: ReactNode;
  };

type BadgeIconSlotProps = {
  slot: "inline-start" | "inline-end";
  size: BadgeVariantProps["size"];
  children: ReactNode;
};

function BadgeIconSlot({ slot, size, children }: BadgeIconSlotProps) {
  return (
    <span data-icon={slot} aria-hidden className={badgeIconSlotVariants({ size })}>
      {children}
    </span>
  );
}

/**
 * Small status label with variant and size presets.
 *
 * @example
 * ```tsx
 * <Badge dot variant="secondary" size="sm">Online</Badge>
 * <Badge iconBefore={<CheckIcon />}>Verified</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot = false,
      iconBefore,
      iconAfter,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : "div";

    if (asChild) {
      return (
        <Comp ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props}>
        {dot ? (
          <span data-slot="badge-dot" aria-hidden className={badgeDotVariants({ size, variant })} />
        ) : null}
        {iconBefore ? (
          <BadgeIconSlot slot="inline-start" size={size}>
            {iconBefore}
          </BadgeIconSlot>
        ) : null}
        {children}
        {iconAfter ? (
          <BadgeIconSlot slot="inline-end" size={size}>
            {iconAfter}
          </BadgeIconSlot>
        ) : null}
      </Comp>
    );
  },
);

Badge.displayName = "Badge";

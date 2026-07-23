import type { LucideIcon, LucideProps } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "../../lib/cn";
import { type IconVariantProps, iconVariants } from "./icon.variants";

export type IconProps = Omit<LucideProps, "ref" | "size" | "color"> &
  IconVariantProps & {
    /** Lucide icon component to render. */
    icon: LucideIcon;
    /**
     * Accessible name when the icon conveys meaning.
     * Omit for decorative icons (sets `aria-hidden`).
     */
    label?: string;
  };

/**
 * Thin wrapper over lucide-react icons with consistent sizing, semantic colors, and a11y.
 *
 * @example
 * ```tsx
 * import { Icon, Search } from "@nxgp/component-lib";
 *
 * <Icon icon={Search} label="Search" size="lg" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, className, size, color, label, ...props }, ref) => {
    const accessibleLabel = label ?? props["aria-label"];
    const isDecorative = accessibleLabel === undefined;

    return (
      <IconComponent
        ref={ref}
        {...props}
        className={cn(iconVariants({ size, color, className }))}
        aria-hidden={isDecorative ? true : undefined}
        role={isDecorative ? undefined : "img"}
        aria-label={accessibleLabel}
      />
    );
  },
);

Icon.displayName = "Icon";

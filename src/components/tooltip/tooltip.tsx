import { Tooltip as TooltipPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { type TooltipContentVariantProps, tooltipContentVariants } from "./tooltip.variants";

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/** Configures delay and skip-delay behavior for descendant tooltips. */
export const TooltipProvider = ({
  delayDuration = 200,
  skipDelayDuration = 300,
  ...props
}: TooltipProviderProps) => (
  <TooltipPrimitive.Provider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    {...props}
  />
);

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
  TooltipContentVariantProps & {
    /** Preferred edge of the trigger to render against — alias for Radix `side`. */
    position?: ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>["side"];
  };

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, variant, position, side, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side ?? position}
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ variant, className }))}
        {...props}
      />
    </TooltipPrimitive.Portal>
  ),
);
TooltipContent.displayName = "TooltipContent";

export type TooltipArrowProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow> &
  Pick<TooltipContentVariantProps, "variant">;

/** Optional pointer arrow for {@link TooltipContent}. */
export const TooltipArrow = forwardRef<SVGSVGElement, TooltipArrowProps>(
  ({ className, variant = "inverted", ...props }, ref) => (
    <TooltipPrimitive.Arrow
      ref={ref}
      className={cn(variant === "inverted" ? "fill-background" : "fill-foreground", className)}
      {...props}
    />
  ),
);
TooltipArrow.displayName = "TooltipArrow";

import { Slider as SliderPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { focusRing } from "../../lib/interactive.variants";
import { type SliderVariantProps, sliderVariants } from "./slider.variants";

export type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root> &
  SliderVariantProps;

/**
 * Range slider with size options for track and thumb.
 *
 * @example
 * ```tsx
 * <Slider size="lg" defaultValue={[50]} max={100} step={1} aria-label="Volume" />
 * ```
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(
  ({ className, size, ...props }, ref) => (
    <SliderPrimitive.Root ref={ref} className={cn(sliderVariants({ size, className }))} {...props}>
      <SliderPrimitive.Track
        data-slot="track"
        className="relative w-full grow overflow-hidden rounded-full bg-muted"
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="thumb"
        className={cn(
          "block rounded-full border-2 border-primary bg-background shadow transition-colors disabled:pointer-events-none disabled:opacity-50",
          focusRing,
        )}
      />
    </SliderPrimitive.Root>
  ),
);

Slider.displayName = "Slider";

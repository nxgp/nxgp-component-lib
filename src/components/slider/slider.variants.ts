import { cva, type VariantProps } from "class-variance-authority";

export const sliderVariants = cva("relative flex w-full touch-none select-none items-center", {
  variants: {
    size: {
      sm: "[&_[data-slot=track]]:h-1.5 [&_[data-slot=thumb]]:size-4",
      default: "[&_[data-slot=track]]:h-2 [&_[data-slot=thumb]]:size-5",
      lg: "[&_[data-slot=track]]:h-2.5 [&_[data-slot=thumb]]:size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type SliderVariantProps = VariantProps<typeof sliderVariants>;

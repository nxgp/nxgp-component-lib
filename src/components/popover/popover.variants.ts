import { cva, type VariantProps } from "class-variance-authority";
import {
  overlayPopoverMotion,
  overlayPopoverSurface,
  overlayZIndex,
} from "../../lib/overlay.variants";

export const popoverContentVariants = cva(
  `${overlayZIndex} ${overlayPopoverSurface} shadow-md outline-none ${overlayPopoverMotion}`,
  {
    variants: {
      size: {
        sm: "w-56",
        default: "w-72",
        lg: "w-96",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type PopoverContentVariantProps = VariantProps<typeof popoverContentVariants>;

/** @deprecated Use {@link PopoverContentVariantProps}. */
export type HoverCardContentVariantProps = PopoverContentVariantProps;

/** @deprecated Use {@link popoverContentVariants}. */
export const hoverCardContentVariants = popoverContentVariants;

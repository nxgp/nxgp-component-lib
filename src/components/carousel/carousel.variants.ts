import { cva, type VariantProps } from "class-variance-authority";

export const carouselContentVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "-ml-4",
      vertical: "-mt-4 flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const carouselItemVariants = cva("min-w-0 shrink-0 grow-0 basis-full", {
  variants: {
    orientation: {
      horizontal: "pl-4",
      vertical: "pt-4",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type CarouselContentVariantProps = VariantProps<typeof carouselContentVariants>;
export type CarouselItemVariantProps = VariantProps<typeof carouselItemVariants>;

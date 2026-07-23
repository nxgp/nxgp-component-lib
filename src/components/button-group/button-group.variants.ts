import { cva, type VariantProps } from "class-variance-authority";

/**
 * Layout variants for grouped buttons — merges borders between adjacent controls.
 */
export const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:relative [&>*]:focus-visible:z-10",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>[data-slot=button]:not(:first-child)]:rounded-l-none [&>[data-slot=button]:not(:last-child)]:rounded-r-none [&>[data-slot=button]:not(:first-child)]:border-l-0 [&>[data-slot=button-group-text]:not(:first-child)]:rounded-l-none [&>[data-slot=button-group-text]:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>[data-slot=button]:not(:first-child)]:rounded-t-none [&>[data-slot=button]:not(:last-child)]:rounded-b-none [&>[data-slot=button]:not(:first-child)]:border-t-0 [&>[data-slot=button-group-text]:not(:first-child)]:rounded-t-none [&>[data-slot=button-group-text]:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export type ButtonGroupVariantProps = VariantProps<typeof buttonGroupVariants>;

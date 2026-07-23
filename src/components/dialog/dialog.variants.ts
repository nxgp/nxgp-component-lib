import { cva, type VariantProps } from "class-variance-authority";

export const dialogContentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-popover p-4 shadow-lg duration-fast ease-product sm:rounded-overlay",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-dialog-inset sm:max-w-dialog-full",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type DialogContentVariantProps = VariantProps<typeof dialogContentVariants>;

export const dialogCloseButtonVariants = cva(
  "absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
);

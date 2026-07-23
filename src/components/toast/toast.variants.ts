import { cva, type VariantProps } from "class-variance-authority";

export const toasterVariants = cva(
  [
    "toaster group",
    "[&_[data-sonner-toast][data-styled=true]:not([data-type])]:bg-card",
    "[&_[data-sonner-toast][data-styled=true]:not([data-type])]:text-card-foreground",
    "[&_[data-sonner-toast][data-styled=true]:not([data-type])]:border-border",
    "[&_[data-sonner-toast][data-mounted=true]]:opacity-100",
  ].join(" "),
);

export const toasterLoadingIconVariants = cva("size-4");

export type ToastVariantProps = VariantProps<typeof toasterVariants>;

import { cva, type VariantProps } from "class-variance-authority";
import { overlayBackdropClasses } from "../../lib/overlay.variants";

export const alertDialogOverlayVariants = cva(overlayBackdropClasses);

export const alertDialogContentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2 gap-4 p-6",
);

export const alertDialogHeaderVariants = cva("flex flex-col gap-2 text-center sm:text-left");

export const alertDialogFooterVariants = cva(
  "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
);

export const alertDialogTitleVariants = cva("text-lg font-semibold");

export const alertDialogDescriptionVariants = cva("text-sm text-muted-foreground");

export const alertDialogCancelVariants = cva("mt-2 sm:mt-0");

export type AlertDialogVariantProps = VariantProps<typeof alertDialogOverlayVariants>;

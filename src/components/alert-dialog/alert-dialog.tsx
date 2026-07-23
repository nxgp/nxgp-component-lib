import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { buttonVariants } from "../button/button.variants";
import { type DialogContentVariantProps, dialogContentVariants } from "../dialog/dialog.variants";
import {
  alertDialogCancelVariants,
  alertDialogContentVariants,
  alertDialogDescriptionVariants,
  alertDialogFooterVariants,
  alertDialogHeaderVariants,
  alertDialogOverlayVariants,
  alertDialogTitleVariants,
} from "./alert-dialog.variants";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogPortal = AlertDialogPrimitive.Portal;

export type AlertDialogOverlayProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>;

export const AlertDialogOverlay = forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn(alertDialogOverlayVariants(), className)}
      {...props}
    />
  ),
);
AlertDialogOverlay.displayName = "AlertDialogOverlay";

export type AlertDialogContentProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> &
  DialogContentVariantProps;

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, size, ...props }, ref) => (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ size }), alertDialogContentVariants(), className)}
        {...props}
      />
    </AlertDialogPortal>
  ),
);
AlertDialogContent.displayName = "AlertDialogContent";

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => (
  <div className={cn(alertDialogHeaderVariants(), className)} {...props} />
);

export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => (
  <div className={cn(alertDialogFooterVariants(), className)} {...props} />
);

export type AlertDialogTitleProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>;

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn(alertDialogTitleVariants(), className)}
      {...props}
    />
  ),
);
AlertDialogTitle.displayName = "AlertDialogTitle";

export type AlertDialogDescriptionProps = ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;

export const AlertDialogDescription = forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn(alertDialogDescriptionVariants(), className)}
      {...props}
    />
  ),
);
AlertDialogDescription.displayName = "AlertDialogDescription";

export type AlertDialogActionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>;

export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
  ),
);
AlertDialogAction.displayName = "AlertDialogAction";

export type AlertDialogCancelProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>;

export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }), alertDialogCancelVariants(), className)}
      {...props}
    />
  ),
);
AlertDialogCancel.displayName = "AlertDialogCancel";

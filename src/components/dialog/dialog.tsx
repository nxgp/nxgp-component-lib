import { Dialog as DialogPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { XIcon } from "../../lib/icons";
import { overlayBackdropClasses } from "../../lib/overlay.variants";
import {
  type DialogContentVariantProps,
  dialogCloseButtonVariants,
  dialogContentVariants,
} from "./dialog.variants";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export type DialogOverlayProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(overlayBackdropClasses, className)}
      {...props}
    />
  ),
);
DialogOverlay.displayName = "DialogOverlay";

export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  DialogContentVariantProps & {
    /** When false, the built-in close button is not rendered. @default true */
    showCloseButton?: boolean;
    /** Class names for the overlay element. */
    overlayClassName?: string;
    /** When false, children render without portal/overlay wrapper. @default true */
    portalled?: boolean;
  };

/**
 * Modal dialog with size presets and optional close control.
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      children,
      size,
      showCloseButton = true,
      overlayClassName,
      portalled = true,
      ...props
    },
    ref,
  ) => {
    const content = (
      <DialogPrimitive.Content
        ref={ref}
        className={cn(dialogContentVariants({ size, className }))}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close className={dialogCloseButtonVariants()} aria-label="Close">
            <XIcon />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    );

    if (!portalled) {
      return content;
    }

    return (
      <DialogPortal>
        <DialogOverlay className={overlayClassName} />
        {content}
      </DialogPortal>
    );
  },
);
DialogContent.displayName = "DialogContent";

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />
);

export type DialogFooterProps = HTMLAttributes<HTMLDivElement> & {
  sticky?: boolean;
};

export const DialogFooter = ({ className, sticky, ...props }: DialogFooterProps) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      sticky && "sticky bottom-0 border-t border-border bg-background pt-4",
      className,
    )}
    {...props}
  />
);

export type DialogTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
DialogDescription.displayName = "DialogDescription";

import { forwardRef, type HTMLAttributes } from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import { XIcon } from "../../lib/icons";
import {
  type AlertVariantProps,
  alertActionVariants,
  alertCloseVariants,
  alertDescriptionVariants,
  alertSlotPaddingVariants,
  alertTitleVariants,
  alertVariants,
} from "./alert.variants";

export type AlertProps = HTMLAttributes<HTMLDivElement> & AlertVariantProps;

/**
 * Inline alert message with optional title and description.
 *
 * @example
 * ```tsx
 * <Alert variant="success">
 *   <AlertTitle>Saved</AlertTitle>
 *   <AlertDescription>Your changes were applied.</AlertDescription>
 *   <AlertClose onClick={() => setOpen(false)} />
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      aria-atomic="true"
      className={cn(alertVariants({ variant }), alertSlotPaddingVariants(), className)}
      {...props}
    />
  ),
);

Alert.displayName = "Alert";

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn(alertTitleVariants(), className)} {...props} />
  ),
);

AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(alertDescriptionVariants(), className)} {...props} />
  ),
);

AlertDescription.displayName = "AlertDescription";

export type AlertActionProps = HTMLAttributes<HTMLDivElement>;

/** Optional action slot aligned to the alert's top-right. */
export const AlertAction = forwardRef<HTMLDivElement, AlertActionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-action"
      className={cn(alertActionVariants(), className)}
      {...props}
    />
  ),
);

AlertAction.displayName = "AlertAction";

export type AlertCloseProps = HTMLAttributes<HTMLButtonElement>;

/** Dismiss control for alerts — pair with local state or `onClick` to hide. */
export const AlertClose = forwardRef<HTMLButtonElement, AlertCloseProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-slot="alert-close"
      className={cn(alertCloseVariants(), className)}
      {...props}
    >
      {children ?? (
        <>
          <XIcon className="size-4" />
          <span className="sr-only">{a11yLabels.dismissAlert}</span>
        </>
      )}
    </button>
  ),
);

AlertClose.displayName = "AlertClose";

import { Slot } from "radix-ui";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { LoaderIcon } from "../../lib/icons";
import { type ButtonVariantProps, buttonVariants } from "./button.variants";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    /** Render as child element (e.g. anchor) via Radix Slot. */
    asChild?: boolean;
    /** Shows spinner and disables interaction while true. */
    loading?: boolean;
    /** Visually hidden text announced while loading (defaults to children string when string). */
    loadingLabel?: string;
  };

/**
 * Primary action button with variant, size, loading, and full-width options.
 *
 * @example
 * ```tsx
 * <Button variant="outline" size="sm" loading={saving}>Save</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      type = "button",
      loading = false,
      loadingLabel,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        {...props}
      >
        {loading ? (
          <>
            <LoaderIcon />
            {loadingLabel ? (
              <span className="sr-only">{loadingLabel}</span>
            ) : typeof children === "string" ? (
              <span className="sr-only">{children}</span>
            ) : null}
            {!loadingLabel && typeof children !== "string" ? children : null}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

import { forwardRef, type HTMLAttributes, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { focusWithinRing, invalidFieldShellState } from "../../lib/interactive.variants";
import { type FieldVariantProps, fieldVariants } from "../input/input.variants";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  FieldVariantProps & {
    /** Marks the field invalid for styling and assistive tech (`aria-invalid`). */
    invalid?: boolean;
  };

/**
 * Text input field with size, variant, and invalid states.
 *
 * Prefer associating a visible {@link FieldLabel} via `htmlFor` + `id` over a bare
 * `aria-label` when a label is shown in the UI.
 *
 * @example
 * ```tsx
 * <FieldLabel htmlFor="email">Email</FieldLabel>
 * <Input id="email" size="sm" invalid={!!error} />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size, variant, invalid, type = "text", "aria-invalid": ariaInvalid, ...props },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid ?? ariaInvalid}
        className={cn(fieldVariants({ size, variant, className }))}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export type InputGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Groups an input with addons, icons, or buttons.
 */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-md border border-border bg-background",
        focusWithinRing,
        invalidFieldShellState,
        className,
      )}
      {...props}
    />
  ),
);
InputGroup.displayName = "InputGroup";

export type InputGroupAddonProps = HTMLAttributes<HTMLDivElement> & {
  align?: "inline-start" | "inline-end";
};

/** Addon slot for icons, text, or buttons beside an input. */
export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center bg-muted px-3 text-sm text-muted-foreground",
        align === "inline-end" && "border-l border-border",
        align === "inline-start" && "border-r border-border",
        className,
      )}
      {...props}
    />
  ),
);
InputGroupAddon.displayName = "InputGroupAddon";

export type InputGroupInputProps = InputProps;

/** Input styled for use inside {@link InputGroup} — borderless shell. */
export const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      variant="ghost"
      className={cn(
        "flex-1 rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className,
      )}
      {...props}
    />
  ),
);
InputGroupInput.displayName = "InputGroupInput";

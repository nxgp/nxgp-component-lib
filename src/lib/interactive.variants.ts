/**
 * Shared motion and focus styles for product-grade interactive primitives.
 * Consumed by Button, Input, and other pressable components.
 */

/** Subtle focus ring for form fields and controls. */
export const focusRing =
  "outline-none focus-visible:ring-1 focus-visible:ring-ring/70 focus-visible:ring-offset-0";

/** Match {@link focusRing} for composite shells such as {@link InputGroup}. */
export const focusWithinRing =
  "outline-none focus-within:ring-1 focus-within:ring-ring/70 focus-within:ring-offset-0";

/** Color transitions for inputs, selects, and other form fields — no press scale. */
export const formFieldMotion =
  "transition-[color,background-color,border-color,box-shadow] duration-fast ease-product motion-reduce:transition-none";

/** Press feedback for buttons and similar controls. */
export const pressableMotion = `transition-[color,background-color,box-shadow,transform] duration-fast ease-product motion-reduce:transition-none active:scale-press motion-reduce:active:scale-100`;

/** Combines press feedback and focus for buttons and similar controls. */
export const interactiveControl = `${pressableMotion} ${focusRing}`;

/** Invalid field border + focus ring — pair with `aria-[invalid=true]`. */
export const invalidFieldState =
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/70";

/** Invalid composite shell — pair with `has-[[aria-invalid=true]]`. */
export const invalidFieldShellState =
  "has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:focus-within:ring-destructive/70";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { type KbdVariantProps, kbdVariants } from "./kbd.variants";

export type KbdProps = HTMLAttributes<HTMLElement> & KbdVariantProps;

/**
 * Keyboard hint styling for shortcuts and key labels.
 *
 * @example
 * ```tsx
 * <p>
 *   Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
 * </p>
 * ```
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd ref={ref} className={cn(kbdVariants({ className }))} {...props} />
));

Kbd.displayName = "Kbd";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import type { FieldVariantProps } from "../input/input.variants";
import { textareaExtraVariants, textareaFieldVariants } from "./textarea.variants";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldVariantProps & {
    invalid?: boolean;
  };

/**
 * Multi-line text input with size, variant, and invalid states.
 *
 * @example
 * ```tsx
 * <Textarea size="lg" rows={4} aria-label="Notes" />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, variant, invalid, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={invalid ?? ariaInvalid}
        className={cn(textareaFieldVariants({ size, variant }), textareaExtraVariants(), className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

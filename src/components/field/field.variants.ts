import { cva, type VariantProps } from "class-variance-authority";

/**
 * Layout variants for {@link Field} root containers.
 */
export const fieldVariants = cva(
  [
    "grid w-full gap-y-1.5 gap-x-2",
    "[&>[data-slot=field-description]]:-mt-0.5",
    "[&>[data-slot=field-error]]:-mt-1",
  ].join(" "),
  {
    variants: {
      orientation: {
        vertical: "",
        horizontal:
          "grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 [&>[data-slot=field-label]]:mb-0",
        responsive:
          "grid-cols-1 @md/field-group:grid-cols-[minmax(0,1fr)_auto] @md/field-group:items-center @md/field-group:gap-x-4 @md/field-group:[&>[data-slot=field-label]]:mb-0",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

/** Helper text below a field control. */
export const fieldDescriptionVariants = cva("text-meta leading-snug text-muted-foreground");

/** Validation error text below a field control. */
export const fieldErrorVariants = cva("text-meta leading-snug text-destructive");

/** List layout for multiple {@link FieldError} messages. */
export const fieldErrorListVariants = cva("ms-3.5 list-disc space-y-0.5");

export type FieldVariantProps = VariantProps<typeof fieldVariants>;

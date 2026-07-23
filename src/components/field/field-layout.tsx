import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Separator } from "../separator/separator";
import { type FieldLegendVariantProps, fieldLegendVariants } from "./field-legend.variants";

export type FieldGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Stacks {@link Field} components with consistent spacing and container queries.
 *
 * @example
 * ```tsx
 * <FieldGroup>
 *   <Field>...</Field>
 *   <Field>...</Field>
 * </FieldGroup>
 * ```
 */
export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn("@container/field-group flex w-full flex-col gap-6", className)}
      {...props}
    />
  ),
);
FieldGroup.displayName = "FieldGroup";

export type FieldSetProps = HTMLAttributes<HTMLFieldSetElement>;

/**
 * Groups related fields with an accessible legend — use for checkbox/radio sections.
 */
export const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(
  ({ className, ...props }, ref) => (
    <fieldset
      ref={ref}
      data-slot="field-set"
      className={cn("flex min-w-0 flex-col gap-4 border-0 p-0", className)}
      {...props}
    />
  ),
);
FieldSet.displayName = "FieldSet";

export type FieldLegendProps = HTMLAttributes<HTMLLegendElement> & FieldLegendVariantProps;

/**
 * Legend for {@link FieldSet}. Use `variant="label"` for nested field sets.
 */
export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(
  ({ className, variant, ...props }, ref) => (
    <legend
      ref={ref}
      data-slot="field-legend"
      className={cn(fieldLegendVariants({ variant }), className)}
      {...props}
    />
  ),
);
FieldLegend.displayName = "FieldLegend";

export type FieldSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/**
 * Visual divider between sections inside a {@link FieldGroup}.
 */
export const FieldSeparator = forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-separator"
      className={cn("relative flex items-center py-2", className)}
      {...props}
    >
      <Separator className="absolute inset-x-0" />
      {children ? (
        <span className="relative mx-auto bg-card px-2 text-xs text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  ),
);
FieldSeparator.displayName = "FieldSeparator";

import { type Label as LabelPrimitive, Slot } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import { cn } from "../../lib/cn";
import { Label } from "../label";
import {
  type FieldVariantProps,
  fieldDescriptionVariants,
  fieldErrorListVariants,
  fieldErrorVariants,
  fieldVariants,
} from "./field.variants";

export type FieldLabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  /** Shows a required asterisk after the label text. */
  required?: boolean;
  /** Hint text shown in parentheses after the label. */
  hint?: string;
  /** Merge props onto child via Radix Slot. */
  asChild?: boolean;
};

type FieldContextValue = {
  controlId: string;
  descriptionId?: string;
  errorId?: string;
  invalid: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(component: string): FieldContextValue {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error(`${component} must be used within Field`);
  }
  return context;
}

export type FieldProps = HTMLAttributes<HTMLDivElement> &
  FieldVariantProps & {
    /** Marks the field invalid for assistive tech and error styling. */
    invalid?: boolean;
    children?: ReactNode;
  };

/**
 * Form field layout root — wires label, control, description, and error via context.
 *
 * @example
 * ```tsx
 * <Field invalid={!!error}>
 *   <FieldLabel>Email</FieldLabel>
 *   <FieldControl asChild>
 *     <Input type="email" />
 *   </FieldControl>
 *   <FieldDescription>We will never share your email.</FieldDescription>
 *   <FieldError>{error}</FieldError>
 * </Field>
 * ```
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ className, orientation, invalid = false, children, ...props }, ref) => {
    const baseId = useId();
    const controlId = `${baseId}-control`;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;

    const value = useMemo<FieldContextValue>(
      () => ({
        controlId,
        descriptionId,
        errorId,
        invalid,
      }),
      [controlId, descriptionId, errorId, invalid],
    );

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          data-slot="field"
          data-invalid={invalid ? true : undefined}
          className={cn(fieldVariants({ orientation, className }))}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    );
  },
);
Field.displayName = "Field";

/**
 * Field label — wraps {@link Label} and associates with the control slot.
 */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, htmlFor, asChild = false, required, hint, children, ...props }, ref) => {
    const { controlId } = useFieldContext("FieldLabel");

    if (asChild) {
      return (
        <Slot.Root ref={ref} data-slot="field-label" className={cn(className)} {...props}>
          {children}
        </Slot.Root>
      );
    }

    return (
      <Label
        ref={ref}
        data-slot="field-label"
        htmlFor={htmlFor ?? controlId}
        className={cn(className)}
        required={required}
        hint={hint}
        {...props}
      >
        {children}
      </Label>
    );
  },
);
FieldLabel.displayName = "FieldLabel";

export type FieldContentProps = HTMLAttributes<HTMLDivElement>;

/** Groups label and description beside a control in horizontal fields. */
export const FieldContent = forwardRef<HTMLDivElement, FieldContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  ),
);
FieldContent.displayName = "FieldContent";

export type FieldTitleProps = HTMLAttributes<HTMLDivElement>;

/** Title text inside {@link FieldContent} with label styling. */
export const FieldTitle = forwardRef<HTMLDivElement, FieldTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-title"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  ),
);
FieldTitle.displayName = "FieldTitle";

export type FieldControlProps = HTMLAttributes<HTMLElement> & {
  /** Merge props onto the child control via Radix Slot. @default true */
  asChild?: boolean;
};

/**
 * Control slot — merges `id`, `aria-describedby`, and `aria-invalid` onto the field control.
 */
export const FieldControl = forwardRef<HTMLDivElement, FieldControlProps>(
  ({ className, asChild = true, ...props }, ref) => {
    const { controlId, descriptionId, errorId, invalid } = useFieldContext("FieldControl");
    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    if (asChild) {
      return (
        <Slot.Root
          data-slot="field-control"
          id={controlId}
          aria-describedby={describedBy}
          aria-invalid={invalid ? true : undefined}
          className={className}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        data-slot="field-control"
        id={controlId}
        aria-describedby={describedBy}
        aria-invalid={invalid ? true : undefined}
        className={cn("w-full", className)}
        {...props}
      />
    );
  },
);
FieldControl.displayName = "FieldControl";

export type FieldDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Helper text displayed below the control. */
export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const { descriptionId } = useFieldContext("FieldDescription");

    return (
      <p
        ref={ref}
        id={id ?? descriptionId}
        data-slot="field-description"
        className={cn(fieldDescriptionVariants(), className)}
        {...props}
      />
    );
  },
);
FieldDescription.displayName = "FieldDescription";

export type FieldErrorProps = HTMLAttributes<HTMLDivElement> & {
  /** Multiple validation messages (e.g. from react-hook-form). */
  errors?: Array<{ message?: string } | undefined>;
};

/** Validation error message — only renders when children or errors are provided. */
export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, id, children, errors, ...props }, ref) => {
    const { errorId } = useFieldContext("FieldError");

    const content = useMemo(() => {
      if (children) {
        return children;
      }
      if (!errors?.length) {
        return null;
      }
      const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];
      if (uniqueErrors.length === 1) {
        return uniqueErrors[0]?.message;
      }
      return (
        <ul className={fieldErrorListVariants()}>
          {uniqueErrors.map(
            (error) => error?.message && <li key={error.message}>{error.message}</li>,
          )}
        </ul>
      );
    }, [children, errors]);

    if (!content) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={id ?? errorId}
        role="alert"
        data-slot="field-error"
        className={cn(fieldErrorVariants(), className)}
        {...props}
      >
        {content}
      </div>
    );
  },
);
FieldError.displayName = "FieldError";

import { Select as SelectPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, LoaderIcon } from "../../lib/icons";
import { useControllableState } from "../../lib/use-controllable-state";
import { type FieldVariantProps, fieldVariants } from "../input/input.variants";
import {
  selectContentVariants,
  selectItemIndicatorVariants,
  selectItemVariants,
  selectLabelVariants,
  selectScrollButtonVariants,
  selectSeparatorVariants,
  selectTriggerIconVariants,
  selectTriggerVariants,
  selectViewportVariants,
} from "./select.variants";

export type SelectProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

/** Root select primitive with consistent controlled/uncontrolled state. */
export function Select(props: SelectProps) {
  const { value, defaultValue, onValueChange, ...rest } = props;
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onValueChange,
    isControlled: "value" in props,
  });

  return <SelectPrimitive.Root value={selectedValue} onValueChange={setSelectedValue} {...rest} />;
}

export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export type SelectTriggerProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
  FieldVariantProps & {
    invalid?: boolean;
    /** Shows a loading spinner and sets `aria-busy`. @default false */
    loading?: boolean;
  };

/**
 * Select trigger — supports field `size` and `variant` plus invalid and loading state.
 */
export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    {
      className,
      size,
      variant,
      invalid,
      loading = false,
      children,
      disabled,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      aria-invalid={invalid ?? ariaInvalid}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(fieldVariants({ size, variant }), selectTriggerVariants(), className)}
      {...props}
    >
      {loading ? <LoaderIcon className="size-4 shrink-0 animate-spin" aria-hidden /> : null}
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className={selectTriggerIconVariants()} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = "SelectTrigger";

export type SelectScrollButtonProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.ScrollUpButton
>;

export const SelectScrollUpButton = forwardRef<HTMLDivElement, SelectScrollButtonProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={cn(selectScrollButtonVariants(), className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  ),
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export const SelectScrollDownButton = forwardRef<HTMLDivElement, SelectScrollButtonProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={cn(selectScrollButtonVariants(), className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  ),
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(selectContentVariants({ position }), className)}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={selectViewportVariants({ position })}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = "SelectContent";

export type SelectLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label ref={ref} className={cn(selectLabelVariants(), className)} {...props} />
  ),
);
SelectLabel.displayName = "SelectLabel";

export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item ref={ref} className={cn(selectItemVariants(), className)} {...props}>
      <span className={selectItemIndicatorVariants()}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
);
SelectItem.displayName = "SelectItem";

export type SelectSeparatorProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn(selectSeparatorVariants(), className)}
      {...props}
    />
  ),
);
SelectSeparator.displayName = "SelectSeparator";

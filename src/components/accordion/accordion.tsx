import { Accordion as AccordionPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { ChevronDownIcon } from "../../lib/icons";
import { useControllableState } from "../../lib/use-controllable-state";
import {
  accordionContentInnerVariants,
  accordionContentVariants,
  accordionHeaderVariants,
  accordionItemVariants,
  accordionTriggerIconVariants,
  accordionTriggerVariants,
} from "./accordion.variants";

type AccordionSingleProps = Omit<
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  type?: "single";
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type AccordionMultipleProps = Omit<
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/** Root accordion with consistent controlled/uncontrolled state. */
export function Accordion(props: AccordionProps) {
  const isMultiple = props.type === "multiple";
  const [value, setValue] = useControllableState<string | string[] | undefined>({
    value: props.value,
    defaultValue: props.defaultValue,
    onValueChange: props.onValueChange as (next: string | string[] | undefined) => void,
    isControlled: "value" in props,
  });

  const {
    type: _type,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...rest
  } = props;

  if (isMultiple) {
    return (
      <AccordionPrimitive.Root
        type="multiple"
        value={value as string[] | undefined}
        onValueChange={setValue as (next: string[]) => void}
        {...rest}
      />
    );
  }

  return (
    <AccordionPrimitive.Root
      type="single"
      value={value as string | undefined}
      onValueChange={setValue as (next: string) => void}
      {...rest}
    />
  );
}

export type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(accordionItemVariants(), className)}
      {...props}
    />
  ),
);
AccordionItem.displayName = "AccordionItem";

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  /** When false, the chevron indicator is hidden. @default true */
  showIcon?: boolean;
};

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, showIcon = true, ...props }, ref) => (
    <AccordionPrimitive.Header className={accordionHeaderVariants()}>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerVariants(), className)}
        {...props}
      >
        {children}
        {showIcon ? <ChevronDownIcon className={accordionTriggerIconVariants()} /> : null}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content ref={ref} className={accordionContentVariants()} {...props}>
      <div className={cn(accordionContentInnerVariants(), className)}>{children}</div>
    </AccordionPrimitive.Content>
  ),
);
AccordionContent.displayName = "AccordionContent";

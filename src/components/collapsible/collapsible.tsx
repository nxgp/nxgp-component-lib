import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../../lib/cn";
import { useControllableState } from "../../lib/use-controllable-state";
import { collapsibleContentVariants } from "./collapsible.variants";

export type CollapsibleProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;

/** Collapsible root with consistent controlled/uncontrolled state. */
export function Collapsible(props: CollapsibleProps) {
  const { open, defaultOpen, onOpenChange, ...rest } = props;
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onValueChange: onOpenChange,
    isControlled: "open" in props,
  });

  return <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen} {...rest} />;
}

export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

export type CollapsibleContentProps = ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>;

/**
 * Expandable content region — pair CollapsibleTrigger with CollapsibleContent.
 *
 * @example
 * ```tsx
 * <Collapsible open={open} onOpenChange={setOpen}>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>Hidden content</CollapsibleContent>
 * </Collapsible>
 * ```
 */
export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, ...props }, ref) => (
    <CollapsiblePrimitive.Content
      ref={ref}
      className={cn(collapsibleContentVariants(), className)}
      {...props}
    />
  ),
);
CollapsibleContent.displayName = "CollapsibleContent";

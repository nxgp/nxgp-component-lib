import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, createContext, forwardRef, useContext } from "react";
import { cn } from "../../lib/cn";
import {
  type RadioGroupItemVariantProps,
  type RadioGroupVariantProps,
  radioGroupItemVariants,
  radioGroupVariants,
} from "./radio-group.variants";

type RadioGroupContextValue = Pick<RadioGroupItemVariantProps, "size">;

const RadioGroupContext = createContext<RadioGroupContextValue>({});

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> &
  RadioGroupVariantProps &
  RadioGroupContextValue;

/**
 * Radio group for single selection with orientation and size options.
 *
 * @example
 * ```tsx
 * <RadioGroup orientation="horizontal" size="lg" value={v} onValueChange={setV}>
 *   <RadioGroupItem value="a" aria-label="Option A" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, orientation, size, children, ...props }, ref) => (
    <RadioGroupContext.Provider value={{ size }}>
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn(radioGroupVariants({ orientation, className }))}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </RadioGroupContext.Provider>
  ),
);
RadioGroup.displayName = "RadioGroup";

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
  RadioGroupItemVariantProps;

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, size: sizeProp, ...props }, ref) => {
    const { size: sizeFromGroup } = useContext(RadioGroupContext);
    const size = sizeProp ?? sizeFromGroup;

    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(radioGroupItemVariants({ size, className }))}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span data-slot="indicator" className="rounded-full bg-primary" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

import type { Popover as PopoverPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { cn } from "../../lib/cn";
import { CheckIcon, ChevronDownIcon } from "../../lib/icons";
import { useControllableState } from "../../lib/use-controllable-state";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  type CommandItemProps,
  CommandList,
  type CommandProps,
} from "../command";
import { type FieldVariantProps, fieldVariants } from "../input/input.variants";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import type { PopoverContentVariantProps } from "../popover/popover.variants";
import { Spinner } from "../spinner/spinner";
import {
  comboboxContentVariants,
  comboboxLoadingVariants,
  comboboxTriggerChevronVariants,
  comboboxTriggerLabelVariants,
  comboboxTriggerVariants,
} from "./select-search.variants";
import {
  ComboboxMultiSelectLabel,
  type ComboboxOverflowPosition,
} from "./select-search-multi-select-label";

type ComboboxContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  multiple: boolean;
  selectedValues: string[];
  isSelected: (value: string) => boolean;
  toggleValue: (value: string) => void;
  selectValue: (value: string) => void;
  loading: boolean;
  onSearchChange?: (search: string) => void;
};

const ComboboxContext = createContext<ComboboxContextValue | null>(null);

function useComboboxContext(component: string): ComboboxContextValue {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(`${component} must be used within Combobox`);
  }
  return context;
}

function toSelectedValues(value: string | string[] | undefined, multiple: boolean): string[] {
  if (multiple) {
    return Array.isArray(value) ? value : [];
  }
  return typeof value === "string" && value.length > 0 ? [value] : [];
}

type ComboboxBaseProps = ComponentPropsWithoutRef<typeof Popover> & {
  /** Async fetch in progress — shows {@link ComboboxLoading} when true. */
  loading?: boolean;
  /** Called when the search input changes (use with `shouldFilter={false}` for async). */
  onSearchChange?: (search: string) => void;
};

export type ComboboxSingleProps = ComboboxBaseProps & {
  /** @default false */
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
};

export type ComboboxMultiProps = ComboboxBaseProps & {
  multiple: true;
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultiProps;

/**
 * Combobox root — combines {@link Popover} and {@link Command} for searchable selection.
 * Supports single and multi-select plus async search via `onSearchChange` and `loading`.
 *
 * @example
 * ```tsx
 * <Combobox value={value} onValueChange={setValue}>
 *   <ComboboxTrigger placeholder="Select fruit" />
 *   <ComboboxContent>
 *     <ComboboxInput placeholder="Search..." />
 *     <ComboboxList>
 *       <ComboboxEmpty>No results.</ComboboxEmpty>
 *       <ComboboxItem value="apple">Apple</ComboboxItem>
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
export function Combobox(props: ComboboxProps) {
  const {
    value,
    onValueChange,
    multiple = false,
    loading = false,
    onSearchChange,
    open: openProp,
    defaultOpen,
    onOpenChange,
    children,
    ...popoverProps
  } = props;

  const [openState, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onValueChange: onOpenChange,
    isControlled: "open" in props,
  });
  const open = openState ?? false;

  const selectedValues = toSelectedValues(value, multiple);

  const selectValue = useCallback(
    (nextValue: string) => {
      if (multiple) {
        (onValueChange as ComboboxMultiProps["onValueChange"] | undefined)?.([nextValue]);
      } else {
        (onValueChange as ComboboxSingleProps["onValueChange"] | undefined)?.(nextValue);
      }
    },
    [multiple, onValueChange],
  );

  const toggleValue = useCallback(
    (nextValue: string) => {
      if (!multiple) {
        selectValue(nextValue);
        return;
      }

      const next = selectedValues.includes(nextValue)
        ? selectedValues.filter((item) => item !== nextValue)
        : [...selectedValues, nextValue];
      (onValueChange as ComboboxMultiProps["onValueChange"] | undefined)?.(next);
    },
    [multiple, selectValue, selectedValues, onValueChange],
  );

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      multiple,
      selectedValues,
      isSelected: (itemValue: string) => selectedValues.includes(itemValue),
      toggleValue,
      selectValue,
      loading,
      onSearchChange,
    }),
    [open, setOpen, multiple, selectedValues, toggleValue, selectValue, loading, onSearchChange],
  );

  return (
    <ComboboxContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={setOpen} {...popoverProps}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  );
}

export type ComboboxTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> &
  FieldVariantProps & {
    placeholder?: string;
    invalid?: boolean;
    /** Maps selected values to trigger label text in multi mode. */
    getDisplayLabel?: (values: string[]) => ReactNode;
    /**
     * Number of selected values shown as badges before collapsing the rest into +N.
     * @default 2
     */
    maxBadges?: number;
    /** Where the +N overflow indicator appears relative to visible badges. @default "end" */
    overflowPosition?: ComboboxOverflowPosition;
    /**
     * Tooltip on the +N indicator. `true` lists hidden selections;
     * pass a node or `(hiddenValues) => node` for custom content; `false` disables the tooltip.
     * @default true
     */
    overflowTooltip?: boolean | ReactNode | ((hiddenValues: string[]) => ReactNode);
    /** Maps a selected value to badge and overflow tooltip label text in multi mode. */
    getBadgeLabel?: (value: string) => ReactNode;
  };

/** Button trigger displaying the current value or placeholder. */
export const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  (
    {
      className,
      size,
      variant,
      invalid,
      placeholder = "Select option",
      getDisplayLabel,
      maxBadges = 2,
      overflowPosition = "end",
      overflowTooltip = true,
      getBadgeLabel,
      children,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const { selectedValues, multiple } = useComboboxContext("ComboboxTrigger");
    const hasValue = selectedValues.length > 0;

    let label: ReactNode = children;
    if (label === undefined) {
      if (!hasValue) {
        label = placeholder;
      } else if (multiple) {
        label = getDisplayLabel?.(selectedValues) ?? (
          <ComboboxMultiSelectLabel
            selectedValues={selectedValues}
            maxBadges={maxBadges}
            overflowPosition={overflowPosition}
            overflowTooltip={overflowTooltip}
            getBadgeLabel={getBadgeLabel}
          />
        );
      } else {
        label = selectedValues[0];
      }
    }

    return (
      <PopoverTrigger
        ref={ref}
        role="combobox"
        aria-invalid={invalid ?? ariaInvalid}
        data-slot="combobox-trigger"
        className={cn(
          fieldVariants({ size, variant }),
          comboboxTriggerVariants({ placeholder: !hasValue && !children }),
          className,
        )}
        {...props}
      >
        <span className={comboboxTriggerLabelVariants()}>{label}</span>
        <ChevronDownIcon className={comboboxTriggerChevronVariants()} />
      </PopoverTrigger>
    );
  },
);
ComboboxTrigger.displayName = "ComboboxTrigger";

export type ComboboxContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  PopoverContentVariantProps & {
    commandProps?: CommandProps;
    /** Disable client-side filtering for async search. @default true */
    shouldFilter?: boolean;
  };

/** Popover panel hosting the command list. */
export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, commandProps, shouldFilter = true, children, ...props }, ref) => (
    <PopoverContent
      ref={ref}
      data-slot="combobox-content"
      className={cn(comboboxContentVariants(), className)}
      {...props}
    >
      <Command label="Combobox options" shouldFilter={shouldFilter} {...commandProps}>
        {children}
      </Command>
    </PopoverContent>
  ),
);
ComboboxContent.displayName = "ComboboxContent";

export type ComboboxInputProps = ComponentPropsWithoutRef<typeof CommandInput>;

/** Search input inside the combobox panel. */
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, onValueChange, ...props }, ref) => {
    const { onSearchChange } = useComboboxContext("ComboboxInput");

    return (
      <CommandInput
        ref={ref}
        data-slot="combobox-input"
        className={className}
        onValueChange={(search) => {
          onValueChange?.(search);
          onSearchChange?.(search);
        }}
        {...props}
      />
    );
  },
);
ComboboxInput.displayName = "ComboboxInput";

export type ComboboxListProps = HTMLAttributes<HTMLDivElement>;

/** Scrollable list wrapper — renders {@link CommandList}. */
export const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ className, children, ...props }, ref) => (
    <CommandList ref={ref} data-slot="combobox-list" className={className} {...props}>
      {children}
    </CommandList>
  ),
);
ComboboxList.displayName = "ComboboxList";

export type ComboboxEmptyProps = ComponentPropsWithoutRef<typeof CommandEmpty> & {
  children?: ReactNode;
};

/** Empty state when filtering yields no matches. */
export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>((props, ref) => (
  <CommandEmpty ref={ref} data-slot="combobox-empty" {...props} />
));
ComboboxEmpty.displayName = "ComboboxEmpty";

export type ComboboxLoadingProps = HTMLAttributes<HTMLDivElement>;

/** Loading indicator for async combobox fetches. */
export const ComboboxLoading = forwardRef<HTMLDivElement, ComboboxLoadingProps>(
  ({ className, children, ...props }, ref) => {
    const { loading } = useComboboxContext("ComboboxLoading");
    if (!loading) {
      return null;
    }

    return (
      <div
        ref={ref}
        data-slot="combobox-loading"
        className={cn(comboboxLoadingVariants(), className)}
        {...props}
      >
        {children ?? (
          <>
            <Spinner aria-hidden />
            Loading…
          </>
        )}
      </div>
    );
  },
);
ComboboxLoading.displayName = "ComboboxLoading";

export type ComboboxItemProps = CommandItemProps;

/** Selectable combobox option. */
export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, children, onSelect, value = "", ...props }, ref) => {
    const { isSelected, toggleValue, setOpen, multiple } = useComboboxContext("ComboboxItem");

    const selected = isSelected(value);

    return (
      <CommandItem
        ref={ref}
        data-slot="combobox-item"
        value={value}
        className={cn(className)}
        onSelect={(currentValue) => {
          onSelect?.(currentValue);
          toggleValue(currentValue);
          if (!multiple) {
            setOpen(false);
          }
        }}
        {...props}
      >
        {children}
        {selected ? <CheckIcon className="ml-auto" /> : null}
      </CommandItem>
    );
  },
);
ComboboxItem.displayName = "ComboboxItem";

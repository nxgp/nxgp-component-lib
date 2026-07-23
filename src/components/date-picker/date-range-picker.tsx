import { format } from "date-fns";
import type { Popover as PopoverPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, useCallback, useState } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "../../lib/icons";
import { useControllableState } from "../../lib/use-controllable-state";
import type { FieldVariantProps } from "../input/input.variants";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar, type CalendarProps } from "./calendar";
import {
  datePickerTriggerClassName,
  HiddenDateRangeInputs,
  normalizePartialRangeSelection,
  shouldCloseRangePicker,
} from "./date-picker.shared";
import { datePickerContentVariants } from "./date-picker.variants";
import {
  DateRangePickerPresets,
  type DateRangePreset,
  DEFAULT_DATE_RANGE_PRESETS,
} from "./date-picker-presets";

export type DateRangePickerProps = Omit<
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
  "value" | "defaultValue"
> &
  FieldVariantProps & {
    /** Controlled selected range. */
    value?: DateRange;
    /** Initial range for uncontrolled usage. */
    defaultValue?: DateRange;
    /** Called when the user updates the range. */
    onValueChange?: (range: DateRange | undefined) => void;
    /** Placeholder when no range is selected. @default "Pick a date range" */
    placeholder?: string;
    /** date-fns format string for trigger labels. @default "LLL dd, y" */
    dateFormat?: string;
    calendarProps?: Omit<CalendarProps, "mode" | "selected" | "onSelect" | "numberOfMonths">;
    invalid?: boolean;
    /**
     * Bracket-notation prefix for native forms — submits as `name[from]` and `name[to]`
     * (`yyyy-MM-dd`), compatible with PHP, Rails, and `qs` parsers.
     * Use `fromName` / `toName` for flat field names instead.
     * Hidden inputs are omitted when `disabled` is true.
     */
    name?: string;
    /** Flat hidden input name for range start (overrides `name[from]`). */
    fromName?: string;
    /** Flat hidden input name for range end (overrides `name[to]`). */
    toName?: string;
    /** Number of months shown in the calendar. @default 2 */
    numberOfMonths?: number;
    /** Quick-select preset buttons — defaults to common reporting ranges. Pass `[]` to hide. */
    presets?: DateRangePreset[];
  };

function formatRangeLabel(range: DateRange | undefined, dateFormat: string, placeholder: string) {
  if (!range?.from) {
    return placeholder;
  }
  if (range.to) {
    return `${format(range.from, dateFormat)} - ${format(range.to, dateFormat)}`;
  }
  return format(range.from, dateFormat);
}

/**
 * Date range picker with a two-month {@link Calendar} in range mode.
 *
 * When a range is selected the trigger shows formatted dates only —
 * provide `aria-label` (or wrap in {@link Field}) so screen readers retain field context.
 *
 * @example
 * ```tsx
 * <DateRangePicker aria-label="Trip dates" value={range} onValueChange={setRange} />
 * ```
 */
export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = "Pick a date range",
    disabled,
    className,
    size,
    variant,
    invalid,
    "aria-invalid": ariaInvalid,
    dateFormat = "LLL dd, y",
    calendarProps,
    name,
    fromName,
    toName,
    numberOfMonths = 2,
    presets = DEFAULT_DATE_RANGE_PRESETS,
    ...triggerProps
  } = props;

  const [selectedRange, setSelectedRange] = useControllableState<DateRange | undefined>({
    value: valueProp,
    defaultValue,
    onValueChange,
    isControlled: "value" in props,
  });
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      const previous = selectedRange;
      const next = normalizePartialRangeSelection(range, previous);
      setSelectedRange(next);

      if (shouldCloseRangePicker(next, previous)) {
        setOpen(false);
      }
    },
    [selectedRange, setSelectedRange],
  );

  const handlePresetSelect = useCallback(
    (range: DateRange) => {
      setSelectedRange(range);
      if (range.from && range.to) {
        setOpen(false);
      }
    },
    [setSelectedRange],
  );

  const label = formatRangeLabel(selectedRange, dateFormat, placeholder);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <HiddenDateRangeInputs
        name={name}
        fromName={fromName}
        toName={toName}
        range={selectedRange}
        disabled={disabled}
      />
      <PopoverTrigger
        ref={ref}
        type="button"
        disabled={disabled}
        aria-invalid={invalid ?? ariaInvalid}
        data-slot="date-range-picker-trigger"
        className={datePickerTriggerClassName({
          size,
          variant,
          hasValue: Boolean(selectedRange?.from),
          className,
        })}
        {...triggerProps}
      >
        <CalendarIcon className="opacity-50" />
        <span>{label}</span>
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-range-picker-content"
        align="start"
        className={datePickerContentVariants()}
      >
        <div className="flex">
          {presets.length > 0 ? (
            <DateRangePickerPresets presets={presets} onSelect={handlePresetSelect} />
          ) : null}
          <Calendar
            mode="range"
            resetOnSelect
            numberOfMonths={numberOfMonths}
            selected={selectedRange}
            onSelect={handleSelect}
            {...calendarProps}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});
DateRangePicker.displayName = "DateRangePicker";

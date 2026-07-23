import { format } from "date-fns";
import type { Popover as PopoverPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, useCallback, useState } from "react";
import { CalendarIcon } from "../../lib/icons";
import { useControllableState } from "../../lib/use-controllable-state";
import type { FieldVariantProps } from "../input/input.variants";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Calendar, type CalendarProps } from "./calendar";
import { datePickerTriggerClassName, formatIsoDate, HiddenDateInput } from "./date-picker.shared";
import { datePickerContentVariants } from "./date-picker.variants";
import { DatePickerPresets, type DatePreset } from "./date-picker-presets";

export type DatePickerProps = Omit<
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
  "value" | "defaultValue"
> &
  FieldVariantProps & {
    /** Controlled selected date. */
    value?: Date;
    /** Initial date for uncontrolled usage. */
    defaultValue?: Date;
    /** Called when the user selects a date. */
    onValueChange?: (date: Date | undefined) => void;
    /** Placeholder when no date is selected. @default "Pick a date" */
    placeholder?: string;
    /** date-fns format string for the trigger label. @default "PPP" */
    dateFormat?: string;
    /** Additional props forwarded to the embedded {@link Calendar}. */
    calendarProps?: Omit<CalendarProps, "mode" | "selected" | "onSelect">;
    /** Marks the field invalid for assistive tech and styles. */
    invalid?: boolean;
    /**
     * Hidden input `name` for native form submission (`yyyy-MM-dd`).
     * Omitted from the form payload when `disabled` is true.
     */
    name?: string;
    /** Quick-select preset buttons shown beside the calendar. */
    presets?: DatePreset[];
  };

/**
 * Single-date picker combining {@link Popover} and {@link Calendar}.
 *
 * When a date is selected the trigger label becomes the formatted date only —
 * provide `aria-label` (or wrap in {@link Field}) so screen readers retain field context.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   aria-label="Start date"
 *   value={date}
 *   onValueChange={setDate}
 *   placeholder="Select date"
 * />
 * ```
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    placeholder = "Pick a date",
    disabled,
    className,
    size,
    variant,
    invalid,
    "aria-invalid": ariaInvalid,
    dateFormat = "PPP",
    calendarProps,
    name,
    presets,
    ...triggerProps
  } = props;

  const [selectedDate, setSelectedDate] = useControllableState<Date | undefined>({
    value: valueProp,
    defaultValue,
    onValueChange,
    isControlled: "value" in props,
  });
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date);
      setOpen(false);
    },
    [setSelectedDate],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {name ? (
        <HiddenDateInput name={name} value={formatIsoDate(selectedDate)} disabled={disabled} />
      ) : null}
      <PopoverTrigger
        ref={ref}
        type="button"
        disabled={disabled}
        aria-invalid={invalid ?? ariaInvalid}
        data-slot="date-picker-trigger"
        className={datePickerTriggerClassName({
          size,
          variant,
          hasValue: Boolean(selectedDate),
          className,
        })}
        {...triggerProps}
      >
        <CalendarIcon className="opacity-50" />
        {selectedDate ? format(selectedDate, dateFormat) : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-picker-content"
        align="start"
        className={datePickerContentVariants()}
      >
        <div className="flex">
          {presets && presets.length > 0 ? (
            <DatePickerPresets
              presets={presets}
              onSelect={(date) => {
                handleSelect(date);
              }}
            />
          ) : null}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            {...calendarProps}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});
DatePicker.displayName = "DatePicker";

import { format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "../../lib/cn";
import { type FieldVariantProps, fieldVariants } from "../input/input.variants";

/** ISO date string format for hidden native form inputs. */
export const ISO_DATE_FORMAT = "yyyy-MM-dd";

/** Formats a date for hidden `<input type="hidden">` values. */
export function formatIsoDate(date: Date | undefined): string {
  return date ? format(date, ISO_DATE_FORMAT) : "";
}

/** Shared trigger styles for date picker buttons. */
export function datePickerTriggerClassName(
  options: FieldVariantProps & { hasValue: boolean; className?: string },
): string {
  return cn(
    fieldVariants({ size: options.size, variant: options.variant }),
    "inline-flex items-center justify-start gap-2 font-normal",
    !options.hasValue && "text-muted-foreground",
    options.className,
  );
}

type HiddenDateInputProps = {
  name: string;
  value: string;
  disabled?: boolean;
};

/** Hidden single-date field — omitted when `disabled` so it is not submitted. */
export function HiddenDateInput({ name, value, disabled }: HiddenDateInputProps) {
  if (disabled) {
    return null;
  }

  return <input type="hidden" name={name} value={value} readOnly />;
}

type HiddenDateRangeInputsProps = {
  /**
   * Bracket-notation prefix for native forms (`name[from]`, `name[to]`).
   * Works with PHP, Rails, and `qs`-style parsers.
   */
  name?: string;
  /** Flat field name for range start (overrides `name[from]`). */
  fromName?: string;
  /** Flat field name for range end (overrides `name[to]`). */
  toName?: string;
  range?: DateRange;
  disabled?: boolean;
};

/**
 * Hidden range fields for native form submission.
 * Uses `fromName`/`toName` when provided; otherwise `${name}[from]` and `${name}[to]`.
 */
export function HiddenDateRangeInputs({
  name,
  fromName,
  toName,
  range,
  disabled,
}: HiddenDateRangeInputsProps) {
  if (disabled) {
    return null;
  }

  const resolvedFromName = fromName ?? (name ? `${name}[from]` : undefined);
  const resolvedToName = toName ?? (name ? `${name}[to]` : undefined);

  if (!resolvedFromName && !resolvedToName) {
    return null;
  }

  return (
    <>
      {resolvedFromName ? (
        <input type="hidden" name={resolvedFromName} value={formatIsoDate(range?.from)} readOnly />
      ) : null}
      {resolvedToName ? (
        <input type="hidden" name={resolvedToName} value={formatIsoDate(range?.to)} readOnly />
      ) : null}
    </>
  );
}

/**
 * Collapses react-day-picker's same-day first click (`from` + `to` equal) into a partial range
 * so range pickers stay open until the user picks an end date.
 */
export function normalizePartialRangeSelection(
  range: DateRange | undefined,
  previous: DateRange | undefined,
): DateRange | undefined {
  if (!range?.from || !range.to) {
    return range;
  }

  if (!previous?.from && isSameDay(range.from, range.to)) {
    return { from: range.from, to: undefined };
  }

  return range;
}

/** Whether a range picker popover should close after the latest calendar selection. */
export function shouldCloseRangePicker(
  range: DateRange | undefined,
  previous: DateRange | undefined,
): boolean {
  if (!range?.from || !range.to) {
    return false;
  }

  if (previous?.from && !previous.to) {
    return true;
  }

  if (!previous?.from) {
    return !isSameDay(range.from, range.to);
  }

  if (previous.from && previous.to) {
    return false;
  }

  return false;
}

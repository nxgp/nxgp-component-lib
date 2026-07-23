import { endOfDay, endOfMonth, startOfDay, startOfMonth, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "../../lib/cn";
import { Button } from "../button/button";

/** Preset option for {@link DatePicker}. */
export type DatePreset = {
  label: string;
  getValue: () => Date;
};

/** Preset option for {@link DateRangePicker}. */
export type DateRangePreset = {
  label: string;
  getValue: () => DateRange;
};

/** Default single-date presets. */
export const DEFAULT_DATE_PRESETS: DatePreset[] = [
  { label: "Today", getValue: () => new Date() },
  {
    label: "Tomorrow",
    getValue: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
];

/** Default range presets for reporting filters. */
export const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      return { from: startOfDay(today), to: endOfDay(today) };
    },
  },
  {
    label: "Last 7 days",
    getValue: () => {
      const today = new Date();
      return { from: startOfDay(subDays(today, 6)), to: endOfDay(today) };
    },
  },
  {
    label: "Last 30 days",
    getValue: () => {
      const today = new Date();
      return { from: startOfDay(subDays(today, 29)), to: endOfDay(today) };
    },
  },
  {
    label: "This month",
    getValue: () => {
      const today = new Date();
      return { from: startOfMonth(today), to: endOfMonth(today) };
    },
  },
];

export type DatePickerPresetsProps = {
  presets: DatePreset[];
  onSelect: (date: Date) => void;
  className?: string;
};

/** Sidebar preset buttons for single-date pickers. */
export function DatePickerPresets({ presets, onSelect, className }: DatePickerPresetsProps) {
  if (presets.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="date-picker-presets"
      className={cn("flex flex-col gap-1 border-r border-border p-3", className)}
    >
      {presets.map((preset) => (
        <Button
          key={preset.label}
          type="button"
          variant="ghost"
          size="sm"
          className="justify-start font-normal"
          onClick={() => onSelect(preset.getValue())}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}

export type DateRangePickerPresetsProps = {
  presets: DateRangePreset[];
  onSelect: (range: DateRange) => void;
  className?: string;
};

/** Sidebar preset buttons for range pickers. */
export function DateRangePickerPresets({
  presets,
  onSelect,
  className,
}: DateRangePickerPresetsProps) {
  if (presets.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="date-range-picker-presets"
      className={cn("flex flex-col gap-1 border-r border-border p-3", className)}
    >
      {presets.map((preset) => (
        <Button
          key={preset.label}
          type="button"
          variant="ghost"
          size="sm"
          className="justify-start font-normal"
          onClick={() => onSelect(preset.getValue())}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}

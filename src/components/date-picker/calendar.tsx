import {
  type ComponentProps,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type DateRange,
  type DayButton,
  DayPicker,
  type DayPickerProps,
  type Modifiers,
} from "react-day-picker";
import { cn } from "../../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "../../lib/icons";
import { buttonVariants } from "../button/button.variants";
import { calendarDayButtonVariants, getCalendarClassNames } from "./calendar.variants";
import {
  CalendarRangeInteractionProvider,
  useCalendarRangeInteractionContext,
} from "./calendar-range-interaction";

export type CalendarProps = DayPickerProps & {
  /**
   * Enable click-drag range selection when `mode="range"`.
   * @default true
   */
  rangeDrag?: boolean;
};

type RangeCalendarProps = Extract<CalendarProps, { mode: "range" }>;

type CalendarChevronProps = {
  className?: string;
  disabled?: boolean;
  orientation?: "left" | "right" | "up" | "down";
  size?: number;
};

type CalendarPickerProps = DayPickerProps & {
  pickerRef?: React.Ref<HTMLDivElement>;
};

/**
 * Day cell button with modifier-aware selection and hover styles.
 */
export function CalendarDayButton({
  className,
  day,
  modifiers,
  onPointerDown,
  onPointerEnter,
  onMouseEnter,
  onClickCapture,
  ...props
}: ComponentProps<typeof DayButton>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rangeInteraction = useCalendarRangeInteractionContext();

  useEffect(() => {
    if (modifiers.focused) {
      buttonRef.current?.focus();
    }
  }, [modifiers.focused]);

  const selectedSingle =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;

  return (
    <button
      ref={buttonRef}
      type="button"
      data-selected-single={selectedSingle || undefined}
      data-range-start={modifiers.range_start || undefined}
      data-range-end={modifiers.range_end || undefined}
      data-range-middle={modifiers.range_middle || undefined}
      className={cn(buttonVariants({ variant: "ghost" }), calendarDayButtonVariants(), className)}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        rangeInteraction?.handleDayPointerDown(day.date, modifiers);
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        rangeInteraction?.handleDayPointerEnter(day.date, modifiers);
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
      }}
      onClickCapture={(event) => {
        rangeInteraction?.handleDayClickCapture(event);
        onClickCapture?.(event);
      }}
      {...props}
    />
  );
}

const calendarComponents: DayPickerProps["components"] = {
  Chevron: ({ orientation, className: chevronClassName, ...chevronProps }: CalendarChevronProps) =>
    orientation === "left" ? (
      <ChevronLeftIcon className={cn("size-4", chevronClassName)} {...chevronProps} />
    ) : (
      <ChevronRightIcon className={cn("size-4", chevronClassName)} {...chevronProps} />
    ),
  DayButton: CalendarDayButton,
};

function CalendarPicker({
  pickerRef,
  className,
  classNames,
  showOutsideDays = true,
  components,
  modifiers,
  modifiersClassNames,
  onDayMouseEnter,
  onDayMouseLeave,
  ...props
}: CalendarPickerProps) {
  const rangeInteraction = useCalendarRangeInteractionContext();

  const mergedModifiers = useMemo(() => {
    if (!rangeInteraction?.previewModifier) {
      return modifiers;
    }

    return {
      ...modifiers,
      range_preview: rangeInteraction.previewModifier,
    };
  }, [modifiers, rangeInteraction?.previewModifier]);

  const mergedModifiersClassNames = useMemo(
    () => ({
      range_preview: "bg-accent/60 text-accent-foreground rounded-none",
      ...modifiersClassNames,
    }),
    [modifiersClassNames],
  );

  return (
    <div
      ref={pickerRef}
      data-slot="calendar"
      data-dragging={rangeInteraction?.isDragging || undefined}
      className={cn(
        "w-fit rounded-md border border-border bg-background p-3",
        rangeInteraction?.isDragging && "select-none touch-none",
        className,
      )}
    >
      <DayPicker
        showOutsideDays={showOutsideDays}
        classNames={{
          ...getCalendarClassNames(),
          ...classNames,
        }}
        modifiers={mergedModifiers}
        modifiersClassNames={mergedModifiersClassNames}
        onDayMouseEnter={(date, dayModifiers, event) => {
          onDayMouseEnter?.(date, dayModifiers, event);
          rangeInteraction?.handleDayPointerEnter(date, dayModifiers);
        }}
        onDayMouseLeave={(date, dayModifiers, event) => {
          onDayMouseLeave?.(date, dayModifiers, event);
          rangeInteraction?.handleDayMouseLeave();
        }}
        components={{
          ...calendarComponents,
          ...components,
        }}
        {...props}
      />
    </div>
  );
}

type RangeSelectHandler = (
  range: DateRange | undefined,
  triggerDate: Date,
  dayModifiers: Modifiers,
  event: MouseEvent<Element> | KeyboardEvent<Element>,
) => void;

const CalendarRangeDrag = forwardRef<HTMLDivElement, RangeCalendarProps>(
  ({ rangeDrag = true, selected: selectedProp, onSelect, ...rest }, ref) => {
    const isControlled = selectedProp !== undefined;
    const [uncontrolledRange, setUncontrolledRange] = useState<DateRange | undefined>();
    const selected = isControlled ? selectedProp : uncontrolledRange;

    const onRangeChange = useCallback(
      (range: DateRange | undefined) => {
        if (!isControlled) {
          setUncontrolledRange(range);
        }

        if (onSelect && range?.from && range.to) {
          const nextRange: DateRange = { from: range.from, to: range.to };
          (onSelect as RangeSelectHandler)(
            nextRange,
            range.to,
            {} as Modifiers,
            {} as MouseEvent<Element>,
          );
        }
      },
      [isControlled, onSelect],
    );

    const handleSelect = useCallback<RangeSelectHandler>(
      (range, triggerDate, dayModifiers, event) => {
        if (!isControlled) {
          setUncontrolledRange(range);
        }

        (onSelect as RangeSelectHandler | undefined)?.(range, triggerDate, dayModifiers, event);
      },
      [isControlled, onSelect],
    );

    const pickerProps: Extract<DayPickerProps, { mode: "range" }> = {
      ...rest,
      mode: "range",
      resetOnSelect: rest.resetOnSelect ?? true,
      selected,
      onSelect: handleSelect,
    };

    return (
      <CalendarRangeInteractionProvider
        enabled={rangeDrag}
        selected={selected}
        onRangeChange={onRangeChange}
      >
        <CalendarPicker {...pickerProps} pickerRef={ref} />
      </CalendarRangeInteractionProvider>
    );
  },
);

CalendarRangeDrag.displayName = "CalendarRangeDrag";

/**
 * Date grid calendar built on react-day-picker v9 with semantic tokens.
 *
 * Supports `mode="single"`, `mode="range"`, and `mode="multiple"`.
 * Range mode supports click-drag selection (`rangeDrag`, default `true`).
 * For popover pickers, use {@link DatePicker} or {@link DateRangePicker}.
 *
 * @example
 * ```tsx
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * <Calendar mode="range" selected={range} onSelect={setRange} />
 * ```
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  if (props.mode === "range" && props.rangeDrag !== false) {
    return <CalendarRangeDrag {...props} ref={ref} />;
  }

  const { rangeDrag: _rangeDrag, ...pickerProps } = props;

  return <CalendarPicker {...pickerProps} pickerRef={ref} />;
});

Calendar.displayName = "Calendar";

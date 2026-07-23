import {
  createContext,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { DateRange, Modifiers } from "react-day-picker";

export type CalendarRangeInteractionContextValue = {
  enabled: boolean;
  isDragging: boolean;
  handleDayPointerDown: (date: Date, modifiers: Modifiers) => void;
  handleDayPointerEnter: (date: Date, modifiers: Modifiers) => void;
  handleDayMouseLeave: () => void;
  handleDayClickCapture: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  previewModifier: (date: Date) => boolean;
};

const CalendarRangeInteractionContext = createContext<CalendarRangeInteractionContextValue | null>(
  null,
);

export function useCalendarRangeInteractionContext() {
  return useContext(CalendarRangeInteractionContext);
}

function normalizeRange(from: Date, to: Date): DateRange {
  if (from.getTime() <= to.getTime()) {
    return { from, to };
  }

  return { from: to, to: from };
}

function isDateWithinRange(date: Date, range: DateRange) {
  if (!range.from || !range.to) {
    return false;
  }

  const time = date.getTime();
  const start = range.from.getTime();
  const end = range.to.getTime();

  return time >= Math.min(start, end) && time <= Math.max(start, end);
}

type CalendarRangeInteractionProviderProps = {
  enabled: boolean;
  selected?: DateRange;
  onRangeChange: (range: DateRange | undefined) => void;
  children: ReactNode;
};

export function CalendarRangeInteractionProvider({
  enabled,
  selected,
  onRangeChange,
  children,
}: CalendarRangeInteractionProviderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverDay, setHoverDay] = useState<Date | undefined>();
  const dragAnchorRef = useRef<Date | null>(null);
  const dragMovedRef = useRef(false);
  const skipClickRef = useRef(false);

  const handleDayPointerDown = useCallback(
    (date: Date, modifiers: Modifiers) => {
      if (!enabled || modifiers.disabled || modifiers.hidden) {
        return;
      }

      dragAnchorRef.current = date;
      dragMovedRef.current = false;
      setIsDragging(true);

      if (selected?.from && selected?.to) {
        onRangeChange({ from: date, to: undefined });
      }
    },
    [enabled, onRangeChange, selected?.from, selected?.to],
  );

  const handleDayPointerEnter = useCallback(
    (date: Date, modifiers: Modifiers) => {
      if (!enabled || modifiers.disabled || modifiers.hidden) {
        return;
      }

      if (isDragging && dragAnchorRef.current) {
        if (date.getTime() !== dragAnchorRef.current.getTime()) {
          dragMovedRef.current = true;
          skipClickRef.current = true;
        }

        onRangeChange(normalizeRange(dragAnchorRef.current, date));
        return;
      }

      if (selected?.from && !selected.to) {
        setHoverDay(date);
      }
    },
    [enabled, isDragging, onRangeChange, selected?.from, selected?.to],
  );

  const handleDayMouseLeave = useCallback(() => {
    setHoverDay(undefined);
  }, []);

  const handleDayClickCapture = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
    if (!skipClickRef.current) {
      return;
    }

    skipClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const endDrag = () => {
      setIsDragging(false);
      dragAnchorRef.current = null;
    };

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [isDragging]);

  const previewRange = useMemo((): DateRange | undefined => {
    if (isDragging || !selected?.from || selected.to || !hoverDay) {
      return undefined;
    }

    return normalizeRange(selected.from, hoverDay);
  }, [hoverDay, isDragging, selected?.from, selected?.to]);

  const previewModifier = useCallback(
    (date: Date) => (previewRange ? isDateWithinRange(date, previewRange) : false),
    [previewRange],
  );

  const contextValue = useMemo<CalendarRangeInteractionContextValue>(
    () => ({
      enabled,
      isDragging,
      handleDayPointerDown,
      handleDayPointerEnter,
      handleDayMouseLeave,
      handleDayClickCapture,
      previewModifier,
    }),
    [
      enabled,
      handleDayClickCapture,
      handleDayPointerDown,
      handleDayPointerEnter,
      handleDayMouseLeave,
      isDragging,
      previewModifier,
    ],
  );

  return (
    <CalendarRangeInteractionContext.Provider value={contextValue}>
      {children}
    </CalendarRangeInteractionContext.Provider>
  );
}

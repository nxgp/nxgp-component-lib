import { useCallback, useState } from "react";

export type UseControllableStateOptions<T> = {
  /** Current controlled value (ignored when `isControlled` is false). */
  value: T | undefined;
  /** Initial value for uncontrolled usage. */
  defaultValue?: T;
  /** Called when the value changes in either mode. */
  onValueChange?: (value: T) => void;
  /**
   * Whether the caller passed the controlling prop explicitly.
   * Use `"propName" in props` at the call site for correct detection when `undefined` is valid.
   */
  isControlled: boolean;
};

/**
 * Controlled/uncontrolled state helper used by form components.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useControllableState({
 *   value: props.open,
 *   defaultValue: false,
 *   onValueChange: props.onOpenChange,
 *   isControlled: "open" in props,
 * });
 * ```
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onValueChange,
  isControlled,
}: UseControllableStateOptions<T>): [T | undefined, (next: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const current = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  return [current, setValue];
}

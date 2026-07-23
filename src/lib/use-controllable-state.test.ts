import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "./use-controllable-state";

describe("useControllableState", () => {
  it("uses defaultValue in uncontrolled mode", () => {
    const { result } = renderHook(() =>
      useControllableState({
        value: undefined,
        defaultValue: "a",
        isControlled: false,
      }),
    );
    expect(result.current[0]).toBe("a");
  });

  it("updates internal state when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState({
        value: undefined,
        defaultValue: "a",
        isControlled: false,
      }),
    );
    act(() => {
      result.current[1]("b");
    });
    expect(result.current[0]).toBe("b");
  });

  it("uses controlled value without mutating internal state", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) =>
        useControllableState({
          value,
          defaultValue: "a",
          isControlled: true,
        }),
      { initialProps: { value: "controlled" } },
    );
    act(() => {
      result.current[1]("ignored");
    });
    expect(result.current[0]).toBe("controlled");
    rerender({ value: "next" });
    expect(result.current[0]).toBe("next");
  });

  it("calls onValueChange in both modes", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({
        value: "x",
        onValueChange,
        isControlled: true,
      }),
    );
    act(() => {
      result.current[1]("y");
    });
    expect(onValueChange).toHaveBeenCalledWith("y");
  });
});

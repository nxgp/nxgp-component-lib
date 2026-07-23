import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { DatePicker } from "./date-picker";
import { normalizePartialRangeSelection, shouldCloseRangePicker } from "./date-picker.shared";
import { DEFAULT_DATE_PRESETS } from "./date-picker-presets";
import { DateRangePicker } from "./date-range-picker";

describe("DatePicker", () => {
  describe("rendering", () => {
    it("renders placeholder when no value is set", () => {
      const { getByRole } = renderWithProviders(<DatePicker placeholder="Select date" />);
      expect(getByRole("button", { name: /select date/i })).toBeInTheDocument();
    });

    it("renders formatted value", () => {
      const { getByRole } = renderWithProviders(
        <DatePicker value={new Date(2026, 5, 15)} dateFormat="yyyy-MM-dd" />,
      );
      expect(getByRole("button", { name: /2026-06-15/i })).toBeInTheDocument();
    });

    it("merges custom className on trigger", () => {
      const { getByRole } = renderWithProviders(
        <DatePicker className="custom-date-picker" placeholder="Pick" />,
      );
      expect(getByRole("button", { name: /pick/i })).toHaveClass("custom-date-picker");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to trigger button", () => {
      const ref = createRef<HTMLButtonElement>();
      renderWithProviders(<DatePicker ref={ref} placeholder="Pick" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("disables the trigger when disabled", () => {
      const { getByRole } = renderWithProviders(<DatePicker disabled placeholder="Pick" />);
      expect(getByRole("button", { name: /pick/i })).toBeDisabled();
    });

    it("sets aria-invalid when invalid", () => {
      const { getByRole } = renderWithProviders(<DatePicker invalid placeholder="Pick" />);
      expect(getByRole("button", { name: /pick/i })).toHaveAttribute("aria-invalid", "true");
    });

    it("renders hidden input for native form submission", () => {
      const { container } = renderWithProviders(
        <DatePicker name="birthday" value={new Date(2026, 5, 15)} />,
      );
      const input = container.querySelector('input[type="hidden"][name="birthday"]');
      expect(input).toHaveValue("2026-06-15");
    });

    it("renders empty hidden input when name is set without a value", () => {
      const { container } = renderWithProviders(<DatePicker name="birthday" placeholder="Pick" />);
      expect(container.querySelector('input[type="hidden"][name="birthday"]')).toHaveValue("");
    });

    it("uses defaultValue in uncontrolled mode", () => {
      const { getByRole } = renderWithProviders(
        <DatePicker defaultValue={new Date(2026, 5, 1)} dateFormat="yyyy-MM-dd" />,
      );
      expect(getByRole("button", { name: /2026-06-01/i })).toBeInTheDocument();
    });

    it("omits hidden input when disabled", () => {
      const { container } = renderWithProviders(
        <DatePicker name="birthday" disabled value={new Date(2026, 5, 15)} />,
      );
      expect(
        container.querySelector('input[type="hidden"][name="birthday"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("opens calendar and selects a date", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DatePicker
          placeholder="Pick"
          onValueChange={onValueChange}
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await user.click(getByRole("button", { name: /pick/i }));
      await user.click(getByRole("button", { name: /june 15/i }));
      expect(onValueChange).toHaveBeenCalled();
    });

    it("updates uncontrolled value on selection", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <DatePicker
          placeholder="Pick"
          dateFormat="yyyy-MM-dd"
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await user.click(getByRole("button", { name: /pick/i }));
      await user.click(getByRole("button", { name: /june 15/i }));
      expect(getByRole("button", { name: /2026-06-15/i })).toBeInTheDocument();
    });

    it("selects a date from presets", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DatePicker
          presets={DEFAULT_DATE_PRESETS}
          placeholder="Pick"
          onValueChange={onValueChange}
        />,
      );
      await user.click(getByRole("button", { name: /pick/i }));
      await user.click(getByRole("button", { name: "Today" }));
      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <DatePicker placeholder="Pick" calendarProps={{ defaultMonth: new Date(2026, 5, 1) }} />,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders controlled value without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <DatePicker value={new Date(2026, 5, 1)} dateFormat="yyyy-MM-dd" />,
      );
      rerender(<DatePicker value={new Date(2026, 5, 2)} dateFormat="yyyy-MM-dd" />);
      expect(getByRole("button", { name: /2026-06-02/i })).toBeInTheDocument();
    });
  });
});

describe("DateRangePicker", () => {
  describe("rendering", () => {
    it("renders placeholder when range is empty", () => {
      const { getByRole } = renderWithProviders(<DateRangePicker placeholder="Select range" />);
      expect(getByRole("button", { name: /select range/i })).toBeInTheDocument();
    });

    it("renders formatted range label", () => {
      const { getByRole } = renderWithProviders(
        <DateRangePicker
          value={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 20) }}
          dateFormat="yyyy-MM-dd"
        />,
      );
      expect(getByRole("button", { name: /2026-06-10.*2026-06-20/i })).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("updates range via calendar selection", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DateRangePicker
          placeholder="Range"
          onValueChange={onValueChange}
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await user.click(getByRole("button", { name: /range/i }));
      await user.click(getByRole("button", { name: /june 10/i }));
      expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2026, 5, 10), to: undefined });
    });

    it("keeps the popover open after the first range click", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <DateRangePicker
          placeholder="Range"
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await user.click(getByRole("button", { name: /range/i }));
      await user.click(getByRole("button", { name: /june 10/i }));
      expect(getByRole("dialog")).toBeInTheDocument();
    });

    it("closes the popover after completing a two-click range", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByRole } = renderWithProviders(
        <DateRangePicker
          placeholder="Range"
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await user.click(getByRole("button", { name: /range/i }));
      await user.click(getByRole("button", { name: /june 10/i }));
      await user.click(getByRole("button", { name: /june 20/i }));
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("starts a new range when clicking a date with a complete range selected", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DateRangePicker
          placeholder="Range"
          value={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 20) }}
          onValueChange={onValueChange}
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await user.click(getByRole("button", { name: /jun 10, 2026.*jun 20, 2026/i }));
      await user.click(getByRole("button", { name: /july 5/i }));
      expect(onValueChange).toHaveBeenCalledWith({ from: new Date(2026, 6, 5), to: undefined });
    });

    it("selects a range from presets", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DateRangePicker placeholder="Range" onValueChange={onValueChange} />,
      );
      await user.click(getByRole("button", { name: /range/i }));
      await user.click(getByRole("button", { name: "Last 7 days" }));
      expect(onValueChange).toHaveBeenCalled();
    });

    it("renders hidden range inputs for native form submission", () => {
      const { container } = renderWithProviders(
        <DateRangePicker
          name="trip"
          value={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 20) }}
        />,
      );
      expect(container.querySelector('input[name="trip[from]"]')).toHaveValue("2026-06-10");
      expect(container.querySelector('input[name="trip[to]"]')).toHaveValue("2026-06-20");
    });

    it("renders empty hidden range inputs when name is set without a value", () => {
      const { container } = renderWithProviders(
        <DateRangePicker name="trip" placeholder="Range" />,
      );
      expect(container.querySelector('input[name="trip[from]"]')).toHaveValue("");
      expect(container.querySelector('input[name="trip[to]"]')).toHaveValue("");
    });

    it("uses defaultValue in uncontrolled mode", () => {
      const { getByRole } = renderWithProviders(
        <DateRangePicker
          defaultValue={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 20) }}
          dateFormat="yyyy-MM-dd"
        />,
      );
      expect(getByRole("button", { name: /2026-06-10.*2026-06-20/i })).toBeInTheDocument();
    });

    it("supports flat fromName and toName hidden fields", () => {
      const { container } = renderWithProviders(
        <DateRangePicker
          fromName="start_date"
          toName="end_date"
          value={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 20) }}
        />,
      );
      expect(container.querySelector('input[name="start_date"]')).toHaveValue("2026-06-10");
      expect(container.querySelector('input[name="end_date"]')).toHaveValue("2026-06-20");
      expect(container.querySelector('input[name="trip[from]"]')).not.toBeInTheDocument();
    });

    it("omits hidden range inputs when disabled", () => {
      const { container } = renderWithProviders(
        <DateRangePicker
          name="trip"
          disabled
          value={{ from: new Date(2026, 5, 10), to: new Date(2026, 5, 20) }}
        />,
      );
      expect(container.querySelector('input[name="trip[from]"]')).not.toBeInTheDocument();
      expect(container.querySelector('input[name="trip[to]"]')).not.toBeInTheDocument();
    });

    it("renders with custom numberOfMonths", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = renderWithProviders(
        <DateRangePicker placeholder="Range" numberOfMonths={1} presets={[]} />,
      );
      await user.click(getByRole("button", { name: /range/i }));
      expect(getAllByRole("grid").length).toBe(1);
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <DateRangePicker
          placeholder="Range"
          calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
        />,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <DateRangePicker value={{ from: new Date(2026, 5, 1) }} dateFormat="yyyy-MM-dd" />,
      );
      rerender(
        <DateRangePicker
          value={{ from: new Date(2026, 5, 1), to: new Date(2026, 5, 5) }}
          dateFormat="yyyy-MM-dd"
        />,
      );
      expect(getByRole("button")).toBeInTheDocument();
    });
  });
});

describe("range selection helpers", () => {
  it("normalizes same-day first click into a partial range", () => {
    const date = new Date(2026, 5, 10);
    expect(normalizePartialRangeSelection({ from: date, to: date }, undefined)).toEqual({
      from: date,
      to: undefined,
    });
  });

  it("closes after completing a partial range", () => {
    const from = new Date(2026, 5, 10);
    const to = new Date(2026, 5, 20);
    expect(shouldCloseRangePicker({ from, to }, { from, to: undefined })).toBe(true);
  });

  it("does not close when resetting a complete range", () => {
    const previousFrom = new Date(2026, 5, 10);
    const previousTo = new Date(2026, 5, 20);
    const nextFrom = new Date(2026, 6, 5);
    expect(
      shouldCloseRangePicker(
        { from: nextFrom, to: undefined },
        { from: previousFrom, to: previousTo },
      ),
    ).toBe(false);
  });
});

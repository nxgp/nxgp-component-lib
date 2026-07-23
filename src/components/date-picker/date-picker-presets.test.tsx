import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  DatePickerPresets,
  DateRangePickerPresets,
  DEFAULT_DATE_PRESETS,
  DEFAULT_DATE_RANGE_PRESETS,
} from "./date-picker-presets";

describe("DatePickerPresets", () => {
  describe("rendering", () => {
    it("renders preset buttons", () => {
      const { getByRole } = renderWithProviders(
        <DatePickerPresets presets={DEFAULT_DATE_PRESETS} onSelect={vi.fn()} />,
      );
      expect(getByRole("button", { name: "Today" })).toBeInTheDocument();
    });

    it("returns null when presets are empty", () => {
      const { container } = renderWithProviders(
        <DatePickerPresets presets={[]} onSelect={vi.fn()} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("interactions", () => {
    it("calls onSelect when a preset is clicked", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { getByRole } = renderWithProviders(
        <DatePickerPresets presets={DEFAULT_DATE_PRESETS} onSelect={onSelect} />,
      );
      await user.click(getByRole("button", { name: "Today" }));
      expect(onSelect).toHaveBeenCalledWith(expect.any(Date));
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <DatePickerPresets presets={DEFAULT_DATE_PRESETS} onSelect={vi.fn()} />,
      );
      await expectNoA11yViolations(container);
    });
  });
});

describe("DateRangePickerPresets", () => {
  describe("rendering", () => {
    it("renders range preset buttons", () => {
      const { getByRole } = renderWithProviders(
        <DateRangePickerPresets presets={DEFAULT_DATE_RANGE_PRESETS} onSelect={vi.fn()} />,
      );
      expect(getByRole("button", { name: "Last 7 days" })).toBeInTheDocument();
    });

    it("returns null when presets are empty", () => {
      const { container } = renderWithProviders(
        <DateRangePickerPresets presets={[]} onSelect={vi.fn()} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("interactions", () => {
    it("calls onSelect with a range", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { getByRole } = renderWithProviders(
        <DateRangePickerPresets presets={DEFAULT_DATE_RANGE_PRESETS} onSelect={onSelect} />,
      );
      await user.click(getByRole("button", { name: "This month" }));
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ from: expect.any(Date), to: expect.any(Date) }),
      );
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <DateRangePickerPresets presets={DEFAULT_DATE_RANGE_PRESETS} onSelect={vi.fn()} />,
      );
      await expectNoA11yViolations(container);
    });
  });
});

describe("Default preset helpers", () => {
  it("returns valid default preset values", () => {
    for (const preset of DEFAULT_DATE_PRESETS) {
      expect(preset.getValue()).toBeInstanceOf(Date);
    }
    for (const preset of DEFAULT_DATE_RANGE_PRESETS) {
      const range = preset.getValue();
      expect(range.from).toBeInstanceOf(Date);
      expect(range.to).toBeInstanceOf(Date);
    }
  });
});

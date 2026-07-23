import { render } from "@testing-library/react";
import type { DateRange } from "react-day-picker";
import { describe, expect, it } from "vitest";
import {
  datePickerTriggerClassName,
  formatIsoDate,
  HiddenDateInput,
  HiddenDateRangeInputs,
} from "./date-picker.shared";

describe("date-picker.shared", () => {
  describe("formatIsoDate", () => {
    it("returns empty string for undefined", () => {
      expect(formatIsoDate(undefined)).toBe("");
    });

    it("formats dates as yyyy-MM-dd", () => {
      expect(formatIsoDate(new Date(2026, 5, 15))).toBe("2026-06-15");
    });
  });

  describe("datePickerTriggerClassName", () => {
    it("applies muted text when no value is selected", () => {
      const classes = datePickerTriggerClassName({ hasValue: false }).split(" ");
      expect(classes).toContain("text-muted-foreground");
    });

    it("omits muted text when a value is selected", () => {
      const classes = datePickerTriggerClassName({ hasValue: true }).split(" ");
      expect(classes).not.toContain("text-muted-foreground");
    });
  });

  describe("HiddenDateInput", () => {
    it("renders hidden input when enabled", () => {
      const { container } = render(<HiddenDateInput name="date" value="2026-06-15" />);
      expect(container.querySelector('input[name="date"]')).toHaveValue("2026-06-15");
    });

    it("renders nothing when disabled", () => {
      const { container } = render(<HiddenDateInput name="date" value="2026-06-15" disabled />);
      expect(container.querySelector("input")).toBeNull();
    });
  });

  describe("HiddenDateRangeInputs", () => {
    it("renders only fromName when toName is omitted", () => {
      const { container } = render(
        <HiddenDateRangeInputs fromName="start_date" range={{ from: new Date(2026, 5, 10) }} />,
      );
      expect(container.querySelector('input[name="start_date"]')).toHaveValue("2026-06-10");
      expect(container.querySelectorAll("input")).toHaveLength(1);
    });

    it("renders only toName when fromName is omitted", () => {
      const { container } = render(
        <HiddenDateRangeInputs
          toName="end_date"
          range={{ to: new Date(2026, 5, 20) } as DateRange}
        />,
      );
      expect(container.querySelector('input[name="end_date"]')).toHaveValue("2026-06-20");
      expect(container.querySelectorAll("input")).toHaveLength(1);
    });

    it("renders nothing when no names are provided", () => {
      const { container } = render(<HiddenDateRangeInputs range={{ from: new Date() }} />);
      expect(container.querySelector("input")).toBeNull();
    });

    it("renders nothing when disabled", () => {
      const { container } = render(
        <HiddenDateRangeInputs
          name="trip"
          disabled
          range={{ from: new Date(2026, 5, 1), to: new Date(2026, 5, 2) }}
        />,
      );
      expect(container.querySelector("input")).toBeNull();
    });
  });
});

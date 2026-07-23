import { fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  describe("rendering", () => {
    it("renders month grid and navigation", () => {
      const { getByRole } = renderWithProviders(
        <Calendar mode="single" defaultMonth={new Date(2026, 5, 1)} />,
      );
      expect(getByRole("grid")).toBeInTheDocument();
      expect(getByRole("button", { name: /previous month/i })).toBeInTheDocument();
      expect(getByRole("button", { name: /next month/i })).toBeInTheDocument();
    });

    it("merges custom className on root wrapper", () => {
      const { container } = renderWithProviders(
        <Calendar className="custom-calendar" defaultMonth={new Date(2026, 5, 1)} />,
      );
      expect(container.querySelector("[data-slot=calendar]")).toHaveClass(
        "custom-calendar",
        "rounded-md",
      );
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to root wrapper", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(<Calendar ref={ref} defaultMonth={new Date(2026, 5, 1)} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("calls onSelect in single mode", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { getByRole } = renderWithProviders(
        <Calendar mode="single" defaultMonth={new Date(2026, 5, 1)} onSelect={onSelect} />,
      );
      await user.click(getByRole("button", { name: /june 15/i }));
      expect(onSelect).toHaveBeenCalled();
    });

    it("hides outside days when showOutsideDays is false", () => {
      const { queryByRole } = renderWithProviders(
        <Calendar showOutsideDays={false} mode="single" defaultMonth={new Date(2026, 5, 1)} />,
      );
      expect(queryByRole("button", { name: /may 31/i })).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("navigates to the next month", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <Calendar mode="single" defaultMonth={new Date(2026, 5, 1)} />,
      );
      await user.click(getByRole("button", { name: /next month/i }));
      expect(getByText(/july 2026/i)).toBeInTheDocument();
    });

    it("selects a range by dragging across days", () => {
      const onSelect = vi.fn();
      const { getByRole } = renderWithProviders(
        <Calendar mode="range" defaultMonth={new Date(2026, 6, 1)} onSelect={onSelect} />,
      );

      const startDay = getByRole("button", { name: /july 9/i });
      const endDay = getByRole("button", { name: /july 15/i });

      fireEvent.pointerDown(startDay);
      fireEvent.mouseEnter(endDay);
      fireEvent.pointerUp(window);

      expect(onSelect).toHaveBeenCalled();
      const lastCall = onSelect.mock.calls.at(-1)?.[0] as { from?: Date; to?: Date };
      expect(lastCall?.from).toBeDefined();
      expect(lastCall?.to).toBeDefined();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Calendar mode="single" defaultMonth={new Date(2026, 5, 1)} />,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Calendar mode="single" defaultMonth={new Date(2026, 5, 1)} />,
      );
      rerender(<Calendar mode="single" defaultMonth={new Date(2026, 6, 1)} />);
      expect(getByRole("grid")).toBeInTheDocument();
    });
  });
});

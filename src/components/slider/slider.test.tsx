import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, userEvent } from "../../../tests/utils";
import { Slider } from "./slider";

describe("Slider", () => {
  describe("rendering", () => {
    it("renders slider", () => {
      const { getByRole } = renderWithProviders(
        <Slider defaultValue={[50]} max={100} aria-label="Volume" />,
      );
      expect(getByRole("slider")).toBeInTheDocument();
    });

    it.each(["sm", "lg"] as const)("renders %s size", (size) => {
      const { getByRole } = renderWithProviders(
        <Slider size={size} defaultValue={[50]} max={100} aria-label="Volume" />,
      );
      expect(getByRole("slider")).toBeInTheDocument();
    });

    it("merges custom className on root", () => {
      const { container } = renderWithProviders(
        <Slider className="custom-slider" defaultValue={[50]} max={100} aria-label="Volume" />,
      );
      expect(container.querySelector(".custom-slider")).toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to root element", () => {
      const ref = createRef<HTMLSpanElement>();
      renderWithProviders(<Slider ref={ref} defaultValue={[25]} max={100} aria-label="Volume" />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("reflects disabled state via data-disabled", () => {
      const { getByRole } = renderWithProviders(
        <Slider defaultValue={[10]} max={100} aria-label="Volume" disabled />,
      );
      expect(getByRole("slider")).toHaveAttribute("data-disabled");
    });
  });

  describe("interactions", () => {
    it("responds to keyboard arrow keys", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Slider defaultValue={[50]} max={100} aria-label="Volume" onValueChange={onValueChange} />,
      );
      getByRole("slider").focus();
      await user.keyboard("{ArrowRight}");
      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    // jsdom cannot paint color-contrast; verify role + accessible name wiring instead.
    it("exposes slider role", () => {
      const { getByRole } = renderWithProviders(
        <Slider defaultValue={[25]} max={100} aria-label="Volume" />,
      );
      expect(getByRole("slider")).toBeInTheDocument();
    });
  });

  describe("reliability", () => {
    it("re-renders disabled state", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Slider defaultValue={[10]} aria-label="v" />,
      );
      rerender(<Slider defaultValue={[10]} aria-label="v" disabled />);
      expect(getByRole("slider")).toHaveAttribute("data-disabled");
    });
  });
});

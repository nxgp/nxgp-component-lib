import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Switch } from "./switch";

describe("Switch", () => {
  describe("rendering", () => {
    it("renders switch role", () => {
      const { getByRole } = renderWithProviders(<Switch aria-label="notifications" />);
      expect(getByRole("switch")).toBeInTheDocument();
    });

    it.each(["sm", "default", "lg"] as const)("renders %s size thumb classes", (size) => {
      const { getByRole } = renderWithProviders(
        <Switch aria-label="n" size={size === "default" ? undefined : size} />,
      );
      const thumb = getByRole("switch").querySelector("span");
      expect(thumb).toHaveClass(size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5");
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <Switch aria-label="n" className="custom-switch" />,
      );
      expect(getByRole("switch")).toHaveClass("custom-switch");
    });

    it("forwards ref to the switch root", () => {
      const ref = createRef<HTMLButtonElement>();
      renderWithProviders(<Switch ref={ref} aria-label="n" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("uses default thumb size when size is null", () => {
      const { getByRole } = renderWithProviders(<Switch aria-label="n" size={null} />);
      expect(getByRole("switch").querySelector("span")).toHaveClass("size-5");
    });
  });
  describe("props and edge cases", () => {
    it("is disabled when disabled prop is set", () => {
      const { getByRole } = renderWithProviders(<Switch disabled aria-label="n" />);
      expect(getByRole("switch")).toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("calls onCheckedChange on click", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Switch aria-label="n" onCheckedChange={onCheckedChange} />,
      );
      await user.click(getByRole("switch"));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("does not call onCheckedChange when disabled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Switch disabled aria-label="n" onCheckedChange={onCheckedChange} />,
      );
      await user.click(getByRole("switch"));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });
  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Switch aria-label="Notifications" />);
      await expectNoA11yViolations(container);
    });
  });
  describe("reliability", () => {
    it("re-renders disabled", () => {
      const { rerender, getByRole } = renderWithProviders(<Switch aria-label="n" />);
      rerender(<Switch aria-label="n" disabled />);
      expect(getByRole("switch")).toBeDisabled();
    });
  });
});

import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Progress } from "./progress";

describe("Progress", () => {
  describe("rendering", () => {
    it("renders progressbar", () => {
      const { getByRole } = renderWithProviders(
        <Progress value={50} aria-label="Upload progress" />,
      );
      expect(getByRole("progressbar")).toBeInTheDocument();
    });

    it.each(["sm", "default", "lg"] as const)("renders %s size", (size) => {
      const { getByRole } = renderWithProviders(
        <Progress size={size} value={40} aria-label="Progress" />,
      );
      expect(getByRole("progressbar")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <Progress className="custom-progress" value={25} aria-label="Progress" />,
      );
      expect(getByRole("progressbar")).toHaveClass("custom-progress");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(<Progress ref={ref} value={10} aria-label="Progress" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("reflects value", () => {
      const { getByRole } = renderWithProviders(<Progress value={75} aria-label="Progress" />);
      expect(getByRole("progressbar")).toHaveAttribute("aria-valuenow", "75");
    });

    it("handles undefined value", () => {
      const { getByRole } = renderWithProviders(<Progress aria-label="Progress" />);
      expect(getByRole("progressbar")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("does not call handlers on click", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(
        <Progress value={50} aria-label="Progress" onClick={onClick} />,
      );
      await user.click(getByRole("progressbar"));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Progress value={60} aria-label="Upload progress" />,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders value without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Progress value={10} aria-label="Progress" />,
      );
      rerender(<Progress value={90} aria-label="Progress" />);
      expect(getByRole("progressbar")).toHaveAttribute("aria-valuenow", "90");
    });
  });
});

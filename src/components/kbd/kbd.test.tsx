import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Kbd } from "./kbd";

describe("Kbd", () => {
  describe("rendering", () => {
    it("renders a kbd element", () => {
      const { container } = renderWithProviders(<Kbd>Ctrl</Kbd>);
      expect(container.querySelector("kbd")).toHaveTextContent("Ctrl");
    });

    it("merges custom className", () => {
      const { container } = renderWithProviders(<Kbd className="custom-kbd">K</Kbd>);
      expect(container.querySelector("kbd")).toHaveClass("custom-kbd");
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref", () => {
      const ref = createRef<HTMLElement>();
      renderWithProviders(<Kbd ref={ref}>K</Kbd>);
      expect(ref.current?.tagName.toLowerCase()).toBe("kbd");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Kbd aria-label="Command key">⌘</Kbd>);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders with new children", () => {
      const { container, rerender } = renderWithProviders(<Kbd>A</Kbd>);
      rerender(<Kbd>B</Kbd>);
      expect(container.querySelector("kbd")).toHaveTextContent("B");
    });
  });
});

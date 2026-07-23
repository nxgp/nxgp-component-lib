import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Separator, SeparatorWithLabel } from "./separator";

describe("Separator", () => {
  describe("rendering", () => {
    it.each(["horizontal", "vertical"] as const)("renders %s orientation", (orientation) => {
      const { container } = renderWithProviders(<Separator orientation={orientation} />);
      expect(container.firstChild).toHaveAttribute("data-orientation", orientation);
    });

    it("merges custom className", () => {
      const { container } = renderWithProviders(<Separator className="custom-sep" />);
      expect(container.firstChild).toHaveClass("custom-sep", "bg-border");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(<Separator ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("defaults to decorative horizontal separator", () => {
      const { container } = renderWithProviders(<Separator />);
      const el = container.firstChild as HTMLElement;
      expect(el).toHaveAttribute("data-orientation", "horizontal");
      expect(el).not.toHaveAttribute("role", "separator");
    });

    it("renders as separator role when not decorative", () => {
      const { getByRole } = renderWithProviders(
        <Separator decorative={false} aria-orientation="horizontal" />,
      );
      expect(getByRole("separator")).toBeInTheDocument();
    });

    it("renders SeparatorWithLabel", () => {
      const { getByText } = renderWithProviders(<SeparatorWithLabel label="or continue" />);
      expect(getByText("or continue")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Separator />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders orientation without throwing", () => {
      const { rerender, container } = renderWithProviders(<Separator orientation="horizontal" />);
      rerender(<Separator orientation="vertical" />);
      expect(container.firstChild).toHaveAttribute("data-orientation", "vertical");
    });
  });
});

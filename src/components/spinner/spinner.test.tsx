import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  describe("rendering", () => {
    it("renders with status role", () => {
      const { getByRole } = renderWithProviders(<Spinner />);
      expect(getByRole("status")).toBeInTheDocument();
    });

    it.each(["sm", "default", "lg"] as const)("renders %s size", (size) => {
      const { getByRole } = renderWithProviders(<Spinner size={size} label={`Loading ${size}`} />);
      expect(getByRole("status")).toBeInTheDocument();
    });

    it("applies custom className to spinner icon", () => {
      const { getByLabelText } = renderWithProviders(
        <Spinner className="custom-spinner" label="Load" />,
      );
      expect(getByLabelText("Load")).toHaveClass("custom-spinner");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to wrapper span", () => {
      const ref = createRef<HTMLSpanElement>();
      renderWithProviders(<Spinner ref={ref} label="Loading" />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("uses default label on icon", () => {
      const { getByLabelText } = renderWithProviders(<Spinner />);
      expect(getByLabelText("Loading")).toBeInTheDocument();
    });

    it("accepts custom label", () => {
      const { getByLabelText } = renderWithProviders(<Spinner label="Saving" />);
      expect(getByLabelText("Saving")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("is not focusable by default", () => {
      const { getByRole } = renderWithProviders(<Spinner label="Loading" />);
      expect(getByRole("status")).not.toHaveAttribute("tabindex");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Spinner label="Loading content" />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders size without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(<Spinner size="sm" label="x" />);
      rerender(<Spinner size="lg" label="x" />);
      expect(getByRole("status")).toBeInTheDocument();
    });
  });
});

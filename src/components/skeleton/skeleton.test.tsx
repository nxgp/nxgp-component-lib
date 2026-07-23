import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../tests/utils";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  describe("rendering", () => {
    it("renders placeholder", () => {
      const { container } = renderWithProviders(<Skeleton className="h-4 w-32" />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });

    it.each(["default", "circle"] as const)("renders %s variant", (variant) => {
      const { container } = renderWithProviders(<Skeleton variant={variant} className="size-8" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { container } = renderWithProviders(<Skeleton className="custom-skeleton h-4 w-24" />);
      expect(container.firstChild).toHaveClass("custom-skeleton");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(<Skeleton ref={ref} className="h-4 w-24" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("is aria-hidden", () => {
      const { container } = renderWithProviders(<Skeleton className="h-4 w-24" />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("interactions", () => {
    it("does not receive pointer events as interactive element", () => {
      const { container } = renderWithProviders(<Skeleton className="h-4 w-24" />);
      expect(container.firstChild).not.toHaveAttribute("role");
    });
  });

  describe("accessibility", () => {
    // Decorative placeholder — excluded from accessibility tree via aria-hidden.
    it("is hidden from assistive technologies", () => {
      const { container } = renderWithProviders(<Skeleton className="h-4 w-24" />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("reliability", () => {
    it("re-renders variant without throwing", () => {
      const { rerender, container } = renderWithProviders(
        <Skeleton variant="default" className="h-4 w-24" />,
      );
      rerender(<Skeleton variant="circle" className="size-8" />);
      expect(container.firstChild).toHaveClass("rounded-full");
    });
  });
});

import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Icon, Search, Settings } from "./index";

describe("Icon", () => {
  describe("rendering", () => {
    it("renders the provided lucide icon", () => {
      const { container } = renderWithProviders(<Icon icon={Search} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("applies size variant classes", () => {
      const { container } = renderWithProviders(<Icon icon={Search} size="lg" />);
      expect(container.querySelector("svg")).toHaveClass("size-5");
    });

    it("applies color variant classes", () => {
      const { container } = renderWithProviders(<Icon icon={Search} color="muted" />);
      expect(container.querySelector("svg")).toHaveClass("text-muted-foreground");
    });

    it("merges custom className", () => {
      const { container } = renderWithProviders(<Icon icon={Search} className="custom-icon" />);
      expect(container.querySelector("svg")).toHaveClass("custom-icon", "size-4");
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref to the svg element", () => {
      const ref = createRef<SVGSVGElement>();
      render(<Icon ref={ref} icon={Settings} />);
      expect(ref.current?.tagName.toLowerCase()).toBe("svg");
    });

    it("uses aria-label prop when label is omitted", () => {
      const { container } = renderWithProviders(<Icon icon={Search} aria-label="Find" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label", "Find");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).not.toHaveAttribute("aria-hidden");
    });
  });

  describe("accessibility", () => {
    it("marks decorative icons as aria-hidden", () => {
      const { container } = renderWithProviders(<Icon icon={Search} />);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("exposes labeled icons to assistive tech", () => {
      const { container } = renderWithProviders(<Icon icon={Search} label="Search" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-label", "Search");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).not.toHaveAttribute("aria-hidden");
    });

    it("prefers label over aria-label when both are provided", () => {
      const { container } = renderWithProviders(
        <Icon icon={Search} label="Search" aria-label="Find" />,
      );
      expect(container.querySelector("svg")).toHaveAttribute("aria-label", "Search");
    });

    it("has no axe violations for decorative icon", async () => {
      const { container } = renderWithProviders(<Icon icon={Search} />);
      await expectNoA11yViolations(container);
    });

    it("has no axe violations for labeled icon", async () => {
      const { container } = renderWithProviders(<Icon icon={Search} label="Search" />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("remounts without losing svg presence", () => {
      const { container, rerender } = renderWithProviders(<Icon icon={Search} size="sm" />);
      rerender(<Icon icon={Settings} size="lg" />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.querySelector("svg")).toHaveClass("size-5");
    });
  });
});

describe("@nxgp/component-lib/icons curated exports", () => {
  it("re-exports lucide icon components", async () => {
    const mod = await import("./index");
    expect(mod.Search).toBeDefined();
    expect(mod.Calendar).toBeDefined();
    expect(mod.Loader2).toBeDefined();
  });
});

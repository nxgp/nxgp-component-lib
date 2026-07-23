import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { CheckIcon, CircleIcon } from "../../lib/icons";
import { Badge } from "./badge";

describe("Badge", () => {
  describe("rendering", () => {
    it("renders children", () => {
      const { getByText } = renderWithProviders(<Badge>New</Badge>);
      expect(getByText("New")).toBeInTheDocument();
    });

    it.each([
      "default",
      "secondary",
      "destructive",
      "outline",
    ] as const)("renders %s variant", (variant) => {
      const { getByText } = renderWithProviders(<Badge variant={variant}>{variant}</Badge>);
      expect(getByText(variant)).toBeInTheDocument();
    });

    it.each(["sm", "default", "lg"] as const)("renders %s size", (size) => {
      const { getByText } = renderWithProviders(<Badge size={size}>{size}</Badge>);
      expect(getByText(size)).toBeInTheDocument();
    });

    it("renders dot indicator", () => {
      const { getByText, container } = renderWithProviders(<Badge dot>Live</Badge>);
      expect(getByText("Live")).toBeInTheDocument();
      expect(container.querySelector("[data-slot=badge-dot]")).toBeInTheDocument();
    });

    it("renders iconBefore", () => {
      const { getByText, container } = renderWithProviders(
        <Badge iconBefore={<CheckIcon data-testid="badge-icon-before" />}>Verified</Badge>,
      );
      expect(getByText("Verified")).toBeInTheDocument();
      expect(container.querySelector("[data-icon=inline-start]")).toBeInTheDocument();
      expect(container.querySelector("[data-testid=badge-icon-before]")).toBeInTheDocument();
    });

    it("renders iconAfter", () => {
      const { getByText, container } = renderWithProviders(
        <Badge iconAfter={<CircleIcon data-testid="badge-icon-after" />}>Beta</Badge>,
      );
      expect(getByText("Beta")).toBeInTheDocument();
      expect(container.querySelector("[data-icon=inline-end]")).toBeInTheDocument();
      expect(container.querySelector("[data-testid=badge-icon-after]")).toBeInTheDocument();
    });

    it("renders dot, iconBefore, and iconAfter together", () => {
      const { getByText, container } = renderWithProviders(
        <Badge dot iconBefore={<CheckIcon />} iconAfter={<CircleIcon />}>
          Live
        </Badge>,
      );
      expect(getByText("Live")).toBeInTheDocument();
      expect(container.querySelector("[data-slot=badge-dot]")).toBeInTheDocument();
      expect(container.querySelector("[data-icon=inline-start]")).toBeInTheDocument();
      expect(container.querySelector("[data-icon=inline-end]")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByText } = renderWithProviders(<Badge className="custom-badge">Tag</Badge>);
      expect(getByText("Tag")).toHaveClass("custom-badge", "inline-flex");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(<Badge ref={ref}>Ref</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders as child element when asChild", () => {
      const { getByRole } = renderWithProviders(
        <Badge asChild>
          <a href="/docs">Docs</a>
        </Badge>,
      );
      expect(getByRole("link", { name: "Docs" })).toHaveClass("inline-flex");
    });

    it("does not render icons when asChild", () => {
      const { container } = renderWithProviders(
        <Badge asChild iconBefore={<CheckIcon />} iconAfter={<CircleIcon />}>
          <a href="/docs">Docs</a>
        </Badge>,
      );
      expect(container.querySelector("[data-icon=inline-start]")).not.toBeInTheDocument();
      expect(container.querySelector("[data-icon=inline-end]")).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("focuses when tabbed to asChild link", async () => {
      const { getByRole } = renderWithProviders(
        <Badge asChild>
          <a href="/docs">Docs</a>
        </Badge>,
      );
      const user = userEvent.setup();
      await user.tab();
      expect(getByRole("link")).toHaveFocus();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Badge>Status</Badge>);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders variant without throwing", () => {
      const { rerender, getByText } = renderWithProviders(<Badge variant="default">Tag</Badge>);
      rerender(<Badge variant="destructive">Tag</Badge>);
      expect(getByText("Tag")).toBeInTheDocument();
    });
  });
});

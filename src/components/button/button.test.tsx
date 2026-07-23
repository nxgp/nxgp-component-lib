import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "./button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children", () => {
      const { getByRole } = renderWithProviders(<Button>Save</Button>);
      expect(getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    it.each([
      "default",
      "destructive",
      "outline",
      "ghost",
      "link",
    ] as const)("renders %s variant", (variant) => {
      const { getByRole } = renderWithProviders(<Button variant={variant}>{variant}</Button>);
      expect(getByRole("button", { name: variant })).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(<Button className="custom-class">X</Button>);
      expect(getByRole("button")).toHaveClass("custom-class", "inline-flex");
    });

    it("renders as child anchor when asChild", () => {
      const { getByRole } = renderWithProviders(
        <Button asChild>
          <a href="/test">Documentation link</a>
        </Button>,
      );
      expect(getByRole("link", { name: "Documentation link" })).toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();
      renderWithProviders(<Button ref={ref}>Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("is disabled when disabled prop is set", () => {
      const { getByRole } = renderWithProviders(<Button disabled>Off</Button>);
      expect(getByRole("button")).toBeDisabled();
    });

    it("defaults type to button", () => {
      const { getByRole } = renderWithProviders(<Button>Click</Button>);
      expect(getByRole("button")).toHaveAttribute("type", "button");
    });

    it("shows loading state and disables interaction", () => {
      const { getByRole } = renderWithProviders(<Button loading>Save</Button>);
      const button = getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("uses loadingLabel for screen readers", () => {
      const { getByText } = renderWithProviders(
        <Button loading loadingLabel="Saving profile">
          Save
        </Button>,
      );
      expect(getByText("Saving profile")).toHaveClass("sr-only");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(<Button onClick={onClick}>Click</Button>);
      await user.click(getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(
        <Button disabled onClick={onClick}>
          Click
        </Button>,
      );
      await user.click(getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("activates on Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(<Button onClick={onClick}>Go</Button>);
      getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Button>Accessible</Button>);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders with new variant without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(<Button variant="default">X</Button>);
      rerender(<Button variant="outline">X</Button>);
      expect(getByRole("button")).toHaveClass("border");
    });
  });
});

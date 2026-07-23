import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { SettingsIcon } from "../../lib/icons";
import { IconButton } from "./icon-button";

const icon = <span aria-hidden="true">X</span>;

describe("IconButton", () => {
  describe("rendering", () => {
    it("renders with aria-label", () => {
      const { getByRole } = renderWithProviders(<IconButton aria-label="Close">{icon}</IconButton>);
      expect(getByRole("button", { name: "Close" })).toHaveClass("size-control-md");
    });

    it.each([
      ["icon-xs", "size-control-xs", "[&_svg:not([data-icon])]:size-icon-xs"],
      ["icon-sm", "size-control-sm", "[&_svg:not([data-icon])]:size-icon-sm"],
      ["icon", "size-control-md", "[&_svg:not([data-icon])]:size-icon-md"],
      ["icon-lg", "size-control-lg", "[&_svg:not([data-icon])]:size-icon-lg"],
    ] as const)("applies %s preset classes", (size, controlClass, iconClass) => {
      const { getByRole } = renderWithProviders(
        <IconButton aria-label="Settings" size={size}>
          <SettingsIcon />
        </IconButton>,
      );
      const button = getByRole("button", { name: "Settings" });
      expect(button).toHaveClass(controlClass, iconClass);
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <IconButton aria-label="Close" className="custom-class">
          {icon}
        </IconButton>,
      );
      expect(getByRole("button")).toHaveClass("custom-class", "inline-flex");
    });

    it("renders as child anchor when asChild", () => {
      const { getByRole } = renderWithProviders(
        <IconButton asChild aria-label="Docs">
          <a href="/docs">{icon}</a>
        </IconButton>,
      );
      expect(getByRole("link", { name: "Docs" })).toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();
      renderWithProviders(
        <IconButton ref={ref} aria-label="Close">
          {icon}
        </IconButton>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("is disabled when disabled prop is set", () => {
      const { getByRole } = renderWithProviders(
        <IconButton disabled aria-label="Close">
          {icon}
        </IconButton>,
      );
      expect(getByRole("button")).toBeDisabled();
    });

    it("shows loading state and disables interaction", () => {
      const { getByRole } = renderWithProviders(
        <IconButton loading loadingLabel="Saving" aria-label="Save">
          {icon}
        </IconButton>,
      );
      expect(getByRole("button")).toHaveAttribute("aria-busy", "true");
      expect(getByRole("button")).toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(
        <IconButton aria-label="Close" onClick={onClick}>
          {icon}
        </IconButton>,
      );
      await user.click(getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(
        <IconButton disabled aria-label="Close" onClick={onClick}>
          {icon}
        </IconButton>,
      );
      await user.click(getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("activates on Enter key", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { getByRole } = renderWithProviders(
        <IconButton aria-label="Close" onClick={onClick}>
          {icon}
        </IconButton>,
      );
      getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<IconButton aria-label="Close">{icon}</IconButton>);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders variant", () => {
      const { rerender, getByRole } = renderWithProviders(
        <IconButton aria-label="x">{icon}</IconButton>,
      );
      rerender(
        <IconButton aria-label="x" variant="destructive">
          {icon}
        </IconButton>,
      );
      expect(getByRole("button")).toHaveClass("bg-destructive");
    });
  });
});

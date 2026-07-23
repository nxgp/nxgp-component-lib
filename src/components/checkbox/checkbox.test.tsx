import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  describe("rendering", () => {
    it("renders unchecked by default", () => {
      const { getByRole } = renderWithProviders(<Checkbox aria-label="terms" />);
      expect(getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");
    });
  });
  describe("props and edge cases", () => {
    it("supports controlled checked", () => {
      const { getByRole } = renderWithProviders(
        <Checkbox checked aria-label="terms" onCheckedChange={() => {}} />,
      );
      expect(getByRole("checkbox")).toHaveAttribute("data-state", "checked");
    });
    it("is disabled when disabled", () => {
      const { getByRole } = renderWithProviders(<Checkbox disabled aria-label="terms" />);
      expect(getByRole("checkbox")).toBeDisabled();
    });
  });
  describe("interactions", () => {
    it("toggles on click", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Checkbox aria-label="terms" onCheckedChange={onCheckedChange} />,
      );
      await user.click(getByRole("checkbox"));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
    it("toggles with Space key", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Checkbox aria-label="terms" onCheckedChange={onCheckedChange} />,
      );
      getByRole("checkbox").focus();
      await user.keyboard(" ");
      expect(onCheckedChange).toHaveBeenCalled();
    });
  });
  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Checkbox aria-label="Accept" />);
      await expectNoA11yViolations(container);
    });
  });
  describe("reliability", () => {
    it("controlled toggle", async () => {
      const user = userEvent.setup();
      function Demo() {
        const [on, setOn] = useState(false);
        return <Checkbox checked={on} aria-label="x" onCheckedChange={(v) => setOn(v === true)} />;
      }
      const { getByRole } = renderWithProviders(<Demo />);
      await user.click(getByRole("checkbox"));
      expect(getByRole("checkbox")).toHaveAttribute("data-state", "checked");
    });
  });
});

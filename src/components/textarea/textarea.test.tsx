import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  describe("rendering", () => {
    it("renders textarea", () => {
      const { getByRole } = renderWithProviders(<Textarea aria-label="notes" />);
      expect(getByRole("textbox")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <Textarea aria-label="notes" className="custom-class" />,
      );
      expect(getByRole("textbox")).toHaveClass("custom-class", "border-border");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref to textarea element", () => {
      const ref = createRef<HTMLTextAreaElement>();
      renderWithProviders(<Textarea ref={ref} aria-label="notes" />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });

    it("applies size, variant, and invalid props", () => {
      const { getByRole } = renderWithProviders(
        <Textarea aria-label="notes" size="sm" variant="ghost" invalid />,
      );
      const textarea = getByRole("textbox");
      expect(textarea).toHaveClass("h-control-sm", "border-transparent");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });

    it("respects disabled", () => {
      const { getByRole } = renderWithProviders(<Textarea aria-label="notes" disabled />);
      expect(getByRole("textbox")).toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("accepts typing", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(<Textarea aria-label="notes" />);
      await user.type(getByRole("textbox"), "hello");
      expect(getByRole("textbox")).toHaveValue("hello");
    });

    it("calls onChange", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Textarea aria-label="notes" onChange={onChange} />,
      );
      await user.type(getByRole("textbox"), "a");
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Textarea aria-label="notes" />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders disabled", () => {
      const { rerender, getByRole } = renderWithProviders(<Textarea aria-label="n" />);
      rerender(<Textarea aria-label="n" disabled />);
      expect(getByRole("textbox")).toBeDisabled();
    });
  });
});

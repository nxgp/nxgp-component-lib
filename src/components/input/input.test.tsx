import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Input, InputGroup, InputGroupAddon, InputGroupInput } from "./input";

describe("Input", () => {
  describe("rendering", () => {
    it("renders with placeholder", () => {
      const { getByPlaceholderText } = renderWithProviders(<Input placeholder="Email" />);
      expect(getByPlaceholderText("Email")).toBeInTheDocument();
    });
    it("merges className", () => {
      const { getByRole } = renderWithProviders(<Input aria-label="name" className="extra" />);
      expect(getByRole("textbox")).toHaveClass("extra", "border-border");
    });
  });
  describe("props and edge cases", () => {
    it("respects disabled", () => {
      const { getByRole } = renderWithProviders(<Input aria-label="x" disabled />);
      expect(getByRole("textbox")).toBeDisabled();
    });
    it("defaults type to text", () => {
      const { getByRole } = renderWithProviders(<Input aria-label="x" />);
      expect(getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("applies size and variant props", () => {
      const { getByRole } = renderWithProviders(
        <Input aria-label="x" size="sm" variant="ghost" invalid />,
      );
      const input = getByRole("textbox");
      expect(input).toHaveClass("h-control-sm", "border-transparent");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });
  describe("interactions", () => {
    it("accepts typing", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(<Input aria-label="x" />);
      await user.type(getByRole("textbox"), "hello");
      expect(getByRole("textbox")).toHaveValue("hello");
    });
    it("calls onChange", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { getByRole } = renderWithProviders(<Input aria-label="x" onChange={onChange} />);
      await user.type(getByRole("textbox"), "a");
      expect(onChange).toHaveBeenCalled();
    });
  });
  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<Input aria-label="Email" />);
      await expectNoA11yViolations(container);
    });
  });
  describe("reliability", () => {
    it("re-renders without throw", () => {
      const { rerender, getByRole } = renderWithProviders(<Input aria-label="x" />);
      rerender(<Input aria-label="x" disabled />);
      expect(getByRole("textbox")).toBeDisabled();
    });
  });

  describe("InputGroup", () => {
    it("renders addon and nested input", () => {
      const { getByRole, getByText } = renderWithProviders(
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput aria-label="amount" />
          <InputGroupAddon align="inline-end">USD</InputGroupAddon>
        </InputGroup>,
      );
      expect(getByText("$")).toBeInTheDocument();
      expect(getByText("USD")).toBeInTheDocument();
      expect(getByRole("textbox", { name: "amount" })).toBeInTheDocument();
    });
  });
});

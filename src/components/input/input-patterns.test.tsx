import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { ClearableInput, PasswordInput } from "./input-patterns";

describe("PasswordInput", () => {
  describe("rendering", () => {
    it("renders a password field", () => {
      const { getByLabelText } = renderWithProviders(
        <PasswordInput aria-label="Password" placeholder="Secret" />,
      );
      expect(getByLabelText("Password")).toHaveAttribute("type", "password");
    });
  });

  describe("interactions", () => {
    it("toggles password visibility", async () => {
      const user = userEvent.setup();
      const { getByLabelText } = renderWithProviders(
        <PasswordInput aria-label="Password" defaultValue="secret" />,
      );
      const input = getByLabelText("Password");
      await user.click(getByLabelText("Show password"));
      expect(input).toHaveAttribute("type", "text");
      await user.click(getByLabelText("Hide password"));
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<PasswordInput aria-label="Password" />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("disables the visibility toggle when input is disabled", () => {
      const { getByLabelText } = renderWithProviders(
        <PasswordInput aria-label="Password" disabled defaultValue="secret" />,
      );
      expect(getByLabelText("Show password")).toBeDisabled();
    });
  });
});

describe("ClearableInput", () => {
  describe("rendering", () => {
    it("shows clear button when value is present", () => {
      const { getByLabelText } = renderWithProviders(
        <ClearableInput aria-label="Search" defaultValue="query" />,
      );
      expect(getByLabelText("Clear input")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("clears uncontrolled value", async () => {
      const user = userEvent.setup();
      const { getByLabelText } = renderWithProviders(
        <ClearableInput aria-label="Search" defaultValue="query" />,
      );
      await user.click(getByLabelText("Clear input"));
      expect(getByLabelText("Search")).toHaveValue("");
    });

    it("updates uncontrolled value while typing", async () => {
      const user = userEvent.setup();
      const { getByLabelText } = renderWithProviders(<ClearableInput aria-label="Search" />);
      await user.type(getByLabelText("Search"), "hello");
      expect(getByLabelText("Search")).toHaveValue("hello");
    });

    it("calls onClear when provided", async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      const { getByLabelText } = renderWithProviders(
        <ClearableInput aria-label="Search" value="query" onClear={onClear} readOnly />,
      );
      await user.click(getByLabelText("Clear input"));
      expect(onClear).toHaveBeenCalled();
    });

    it("clears controlled value via onChange when onClear is omitted", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { getByLabelText } = renderWithProviders(
        <ClearableInput aria-label="Search" value="query" onChange={onChange} readOnly />,
      );
      await user.click(getByLabelText("Clear input"));
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <ClearableInput aria-label="Search" defaultValue="query" />,
      );
      await expectNoA11yViolations(container);
    });
  });
});

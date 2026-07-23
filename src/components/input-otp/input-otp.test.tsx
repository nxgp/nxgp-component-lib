import { type ComponentProps, createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp";

function SixSlotOtp(props: ComponentProps<typeof InputOTP>) {
  return (
    <InputOTP {...props}>
      <InputOTPGroup>
        <InputOTPSlot index={0} aria-label="Digit 1" />
        <InputOTPSlot index={1} aria-label="Digit 2" />
        <InputOTPSlot index={2} aria-label="Digit 3" />
        <InputOTPSlot index={3} aria-label="Digit 4" />
        <InputOTPSlot index={4} aria-label="Digit 5" />
        <InputOTPSlot index={5} aria-label="Digit 6" />
      </InputOTPGroup>
    </InputOTP>
  );
}

describe("InputOTP", () => {
  describe("rendering", () => {
    it("renders six slots", () => {
      const { getAllByRole } = renderWithProviders(<SixSlotOtp />);
      expect(getAllByRole("textbox")).toHaveLength(6);
    });

    it("renders separator between groups", () => {
      const { getByText } = renderWithProviders(
        <InputOTP>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-label="Digit 1" />
            <InputOTPSlot index={1} aria-label="Digit 2" />
          </InputOTPGroup>
          <InputOTPSeparator>-</InputOTPSeparator>
          <InputOTPGroup>
            <InputOTPSlot index={2} aria-label="Digit 3" />
          </InputOTPGroup>
        </InputOTP>,
      );
      expect(getByText("-")).toBeInTheDocument();
    });

    it("renders default separator glyph when children are omitted", () => {
      const { getByText } = renderWithProviders(
        <InputOTP>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-label="Digit 1" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={1} aria-label="Digit 2" />
          </InputOTPGroup>
        </InputOTP>,
      );
      expect(getByText("–")).toBeInTheDocument();
    });

    it("merges custom className on root", () => {
      const { container } = renderWithProviders(<SixSlotOtp className="custom-otp" />);
      expect(container.querySelector("[data-slot=input-otp]")).toHaveClass("custom-otp");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on InputOTP root", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(<SixSlotOtp ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies size variants to slots", () => {
      const { getAllByRole } = renderWithProviders(<SixSlotOtp size="lg" />);
      expect(getAllByRole("textbox")[0]).toHaveClass("size-control-lg");
    });

    it("disables all slots when disabled", () => {
      const { getAllByRole } = renderWithProviders(<SixSlotOtp disabled />);
      for (const slot of getAllByRole("textbox")) {
        expect(slot).toBeDisabled();
      }
    });
  });

  describe("interactions", () => {
    it("accepts typed digits and calls onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getAllByRole } = renderWithProviders(<SixSlotOtp onValueChange={onValueChange} />);
      const slots = getAllByRole("textbox");
      const first = slots[0];
      const second = slots[1];
      if (!first || !second) {
        throw new Error("Expected OTP slots to be rendered");
      }
      await user.type(first, "1");
      expect(onValueChange).toHaveBeenCalled();
    });

    it("moves focus across slots while typing", async () => {
      const user = userEvent.setup();
      const { getAllByRole } = renderWithProviders(<SixSlotOtp />);
      const slots = getAllByRole("textbox");
      const first = slots[0];
      const second = slots[1];
      if (!first || !second) {
        throw new Error("Expected OTP slots to be rendered");
      }
      await user.type(first, "1");
      expect(second).toHaveFocus();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<SixSlotOtp />);
      await expectNoA11yViolations(container);
    });

    it("renders hidden input for form submission", () => {
      const { container } = renderWithProviders(<SixSlotOtp name="code" />);
      expect(
        container.querySelector('input[type="hidden"], input[autocomplete="one-time-code"]'),
      ).toBeTruthy();
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getAllByRole } = renderWithProviders(<SixSlotOtp defaultValue="1" />);
      rerender(<SixSlotOtp defaultValue="12" />);
      expect(getAllByRole("textbox")).toHaveLength(6);
    });
  });
});

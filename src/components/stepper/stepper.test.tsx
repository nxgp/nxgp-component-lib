import { useState } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Stepper, StepperContent, StepperItem, StepperSeparator } from "./stepper";

describe("Stepper", () => {
  describe("rendering", () => {
    it("renders steps with active state", () => {
      const { getByRole } = renderWithProviders(
        <Stepper value="profile" steps={["account", "profile", "done"]}>
          <StepperItem value="account" title="Account" />
          <StepperSeparator />
          <StepperItem value="profile" title="Profile" />
          <StepperSeparator />
          <StepperItem value="done" title="Done" />
        </Stepper>,
      );
      expect(getByRole("button", { name: /Profile/i })).toHaveAttribute("aria-current", "step");
    });

    it("marks earlier steps complete", () => {
      const { getByRole } = renderWithProviders(
        <Stepper value="profile" steps={["account", "profile", "done"]}>
          <StepperItem value="account" title="Account" />
          <StepperItem value="profile" title="Profile" />
        </Stepper>,
      );
      expect(getByRole("button", { name: /Account/i }).querySelector("svg")).toBeInTheDocument();
    });

    it("renders step content for active step", () => {
      const { getByText, queryByText } = renderWithProviders(
        <Stepper value="two" steps={["one", "two"]}>
          <StepperItem value="one" title="One" />
          <StepperItem value="two" title="Two" />
          <StepperContent value="one">Step one body</StepperContent>
          <StepperContent value="two">Step two body</StepperContent>
        </Stepper>,
      );
      expect(getByText("Step two body")).toBeInTheDocument();
      expect(queryByText("Step one body")).not.toBeInTheDocument();
    });

    it("renders description and custom step index", () => {
      const { getByText } = renderWithProviders(
        <Stepper value="one" steps={["one", "two"]}>
          <StepperItem value="one" title="One" description="First step" step={9} />
        </Stepper>,
      );
      expect(getByText("First step")).toBeInTheDocument();
      expect(getByText("9")).toBeInTheDocument();
    });

    it("renders inactive steps when value is unset", () => {
      const { getByRole } = renderWithProviders(
        <Stepper steps={["one", "two"]}>
          <StepperItem value="one" title="One" />
        </Stepper>,
      );
      expect(getByRole("button", { name: /One/i })).not.toHaveAttribute("aria-current");
    });

    it("renders vertical orientation separator", () => {
      const { container, getByRole } = renderWithProviders(
        <Stepper value="one" steps={["one", "two"]} orientation="vertical">
          <StepperItem value="one" title="One" />
          <StepperSeparator />
          <StepperItem value="two" title="Two" />
        </Stepper>,
      );
      expect(getByRole("button", { name: /One/i })).toBeInTheDocument();
      expect(container.querySelector('[data-slot="stepper"]')).toHaveAttribute(
        "data-orientation",
        "vertical",
      );
      expect(container.querySelector('[data-slot="stepper-separator"]')).toHaveClass("w-px");
    });
  });

  describe("interactions", () => {
    it("changes step on click", async () => {
      const user = userEvent.setup();
      function Demo() {
        const [step, setStep] = useState("account");
        return (
          <Stepper value={step} onValueChange={setStep} steps={["account", "profile"]}>
            <StepperItem value="account" title="Account" />
            <StepperItem value="profile" title="Profile" />
          </Stepper>
        );
      }
      const { getByRole } = renderWithProviders(<Demo />);
      await user.click(getByRole("button", { name: /Profile/i }));
      expect(getByRole("button", { name: /Profile/i })).toHaveAttribute("aria-current", "step");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Stepper value="one" steps={["one", "two"]}>
          <StepperItem value="one" title="One" />
          <StepperItem value="two" title="Two" />
        </Stepper>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("throws when StepperItem is used outside Stepper", () => {
      expect(() => renderWithProviders(<StepperItem value="x" title="X" />)).toThrow(
        "StepperItem must be used within Stepper",
      );
    });
  });
});

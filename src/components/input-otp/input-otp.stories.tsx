import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  choiceArg,
  defineComponentStories,
  hiddenArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { expect, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "../field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp";

const meta = {
  title: "Components/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  ...defineComponentStories(
    "One-time password field with grouped character slots built on Radix OTP primitives.",
    {
      size: choiceArg(["sm", "default", "comfortable", "lg"] as const, {
        description: "Slot height and typography preset.",
        defaultValue: "default",
      }),
      disabled: sharedArgTypes.disabled,
      defaultValue: textArg({ description: "Initial value for uncontrolled usage." }),
      value: textArg({ description: "Controlled OTP value." }),
      onValueChange: hiddenArg("Called when the OTP value changes."),
    },
  ),
  subcomponents: { InputOTPGroup, InputOTPSlot, InputOTPSeparator },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

function SixSlots() {
  return (
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  );
}

export const Default: Story = playgroundStory({
  args: { size: "default", disabled: false },
  render: function PlaygroundStory(args) {
    const [value, setValue] = useState("");

    return (
      <Field className="max-w-sm">
        <FieldLabel>Verification code</FieldLabel>
        <FieldControl asChild>
          <InputOTP {...args} value={value} onValueChange={setValue}>
            <SixSlots />
          </InputOTP>
        </FieldControl>
        <FieldDescription>Enter the 6-digit code sent to your email.</FieldDescription>
      </Field>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slots = canvas.getAllByRole("textbox");
    const first = slots[0];
    if (!first) {
      throw new Error("Expected OTP slots to be rendered");
    }
    await userEvent.type(first, "123456");
    await expect(slots[5]).toHaveValue("6");
  },
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <InputOTP key={size} size={size}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      ))}
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <InputOTP defaultValue="123456">
        <SixSlots />
      </InputOTP>
      <InputOTP disabled defaultValue="654321">
        <SixSlots />
      </InputOTP>
      <InputOTP>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Field invalid>
        <FieldLabel required>Code</FieldLabel>
        <FieldControl asChild>
          <InputOTP disabled>
            <SixSlots />
          </InputOTP>
        </FieldControl>
        <FieldError>Invalid code</FieldError>
      </Field>
    </div>
  ),
};

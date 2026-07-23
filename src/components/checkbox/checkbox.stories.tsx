import type { Meta, StoryObj } from "@storybook/react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { expect, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { labeledField } from "../../../.storybook/utils/playground-renders";
import { Label } from "../label";
import { Checkbox } from "./checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Checkbox input with size presets, indeterminate state, and keyboard support via Radix.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Control dimensions preset.",
        defaultValue: "default",
      }),
      checked: choiceArg(["true", "false", "indeterminate"] as const, {
        description: "Controlled checked state — use `indeterminate` for partial selection.",
      }),
      defaultChecked: booleanArg({
        description: "Initial checked state for uncontrolled usage.",
        defaultValue: false,
      }),
      disabled: sharedArgTypes.disabled,
      required: booleanArg({
        description: "Marks the checkbox as required for form validation.",
        defaultValue: false,
      }),
    },
    ["onCheckedChange"],
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function mapCheckedArg(checked: unknown) {
  if (checked === "indeterminate") return "indeterminate" as const;
  if (checked === "true" || checked === true) return true;
  if (checked === "false" || checked === false) return false;
  return undefined;
}

export const Default: Story = playgroundStory({
  args: {
    size: "default",
    defaultChecked: false,
    disabled: false,
    required: false,
  },
  actions: ["onCheckedChange"],
  render: (args: Story["args"]) => {
    const { checked, ...rest } = args ?? {};
    const checkedProp = mapCheckedArg(checked);
    return labeledField(
      "playground-checkbox",
      "Accept terms and conditions",
      <Checkbox
        id="playground-checkbox"
        {...rest}
        aria-label="Accept terms"
        {...(checkedProp !== undefined && { checked: checkedProp })}
      />,
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: /accept terms/i });
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
});

export const InContext: Story = {
  ...storyDoc("Terms acceptance inside a signup form field group."),
  render: () => (
    <fieldset className="w-full max-w-md space-y-3 rounded-lg border border-border bg-card p-4">
      <legend className="px-1 text-sm font-medium">Create account</legend>
      <div className="flex items-start gap-2">
        <Checkbox id="signup-terms" aria-label="Accept terms" />
        <Label htmlFor="signup-terms" className="leading-snug">
          I agree to the terms of service and privacy policy.
        </Label>
      </div>
    </fieldset>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="terms-sm" size="sm" aria-label="Small checkbox" />
        <Label htmlFor="terms-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms-default" aria-label="Default checkbox" />
        <Label htmlFor="terms-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="terms-lg" size="lg" aria-label="Large checkbox" />
        <Label htmlFor="terms-lg">Large</Label>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" aria-label="Unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checked" defaultChecked aria-label="Checked" />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="indeterminate" checked="indeterminate" aria-label="Indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled aria-label="Disabled" />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
    </div>
  ),
};

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
import { Switch } from "./switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Toggle switch for boolean settings with size presets.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Control dimensions preset.",
        defaultValue: "default",
      }),
      checked: booleanArg({ description: "Controlled on/off state." }),
      defaultChecked: booleanArg({
        description: "Initial on state for uncontrolled usage.",
        defaultValue: false,
      }),
      disabled: sharedArgTypes.disabled,
      required: booleanArg({
        description: "Marks the switch as required for form validation.",
        defaultValue: false,
      }),
    },
    ["onCheckedChange"],
  ),
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: {
    size: "default",
    defaultChecked: false,
    disabled: false,
    required: false,
  },
  actions: ["onCheckedChange"],
  render: (args) =>
    labeledField(
      "playground-switch",
      "Enable notifications",
      <Switch id="playground-switch" {...args} aria-label="Notifications" />,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch", { name: /notifications/i });
    await userEvent.click(control);
    await expect(control).toBeChecked();
  },
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="switch-sm" size="sm" aria-label="Small switch" />
        <Label htmlFor="switch-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-default" aria-label="Default switch" />
        <Label htmlFor="switch-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-lg" size="lg" aria-label="Large switch" />
        <Label htmlFor="switch-lg">Large</Label>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch id="switch-off" aria-label="Off" />
        <Label htmlFor="switch-off">Off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-on" defaultChecked aria-label="On" />
        <Label htmlFor="switch-on">On</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled" disabled aria-label="Disabled" />
        <Label htmlFor="switch-disabled">Disabled</Label>
      </div>
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { expect, storyAction, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  subcomponents: { RadioGroupItem },
  ...defineComponentStories(
    "Radio group for single selection with orientation and size options that propagate to items.",
    {
      orientation: choiceArg(["vertical", "horizontal"] as const, {
        description: "Layout direction for radio items.",
        defaultValue: "vertical",
      }),
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Control dimensions preset propagated to items.",
        defaultValue: "default",
      }),
      defaultValue: choiceArg(["default", "comfortable", "compact"] as const, {
        description: "Initial selected value for uncontrolled usage.",
        defaultValue: "comfortable",
      }),
      disabled: sharedArgTypes.disabled,
      required: booleanArg({
        description: "Marks the group as required for form validation.",
        defaultValue: false,
      }),
    },
    ["onValueChange"],
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const radioItems = (
  <>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="default" id="r1" aria-label="Default" />
      <Label htmlFor="r1">Default</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="comfortable" id="r2" aria-label="Comfortable" />
      <Label htmlFor="r2">Comfortable</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="compact" id="r3" aria-label="Compact" />
      <Label htmlFor="r3">Compact</Label>
    </div>
  </>
);

export const Default: Story = playgroundStory({
  actions: ["onValueChange"],
  args: { defaultValue: "comfortable", orientation: "vertical", size: "default" },
  render: (args) => (
    <RadioGroup {...args} className="grid gap-2">
      {radioItems}
    </RadioGroup>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const compact = canvas.getByRole("radio", { name: /compact/i });
    await userEvent.click(compact);
    await expect(compact).toBeChecked();
    await expect(storyAction(args, "onValueChange")).toHaveBeenCalledWith("compact");
  },
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup size="sm" defaultValue="a" className="grid gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="rs1" aria-label="Small A" />
          <Label htmlFor="rs1">Small</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="rs2" aria-label="Small B" />
          <Label htmlFor="rs2">Option B</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="a" className="grid gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="rd1" aria-label="Default A" />
          <Label htmlFor="rd1">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="rd2" aria-label="Default B" />
          <Label htmlFor="rd2">Option B</Label>
        </div>
      </RadioGroup>
      <RadioGroup size="lg" defaultValue="a" className="grid gap-2">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="rl1" aria-label="Large A" />
          <Label htmlFor="rl1">Large</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="rl2" aria-label="Large B" />
          <Label htmlFor="rl2">Option B</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const Orientation: Story = {
  ...storyDoc("Orientation example."),
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup defaultValue="comfortable" className="grid gap-2">
        {radioItems}
      </RadioGroup>
      <RadioGroup defaultValue="comfortable" orientation="horizontal" className="flex gap-4">
        {radioItems}
      </RadioGroup>
    </div>
  ),
};

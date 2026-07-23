import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  choiceArg,
  defineComponentStories,
  numberArg,
  rangeArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Progress } from "./progress";

const meta = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Determinate progress bar with size presets and animated fill indicator.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Control dimensions preset.",
        defaultValue: "default",
      }),
      value: rangeArg("Current progress value (0–100).", { min: 0, max: 100, defaultValue: 60 }),
      max: numberArg("Maximum progress value.", { min: 1, max: 100 }),
    },
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

const widthDecorator = [
  (Story: () => ReactElement) => (
    <div className="w-64">
      <Story />
    </div>
  ),
];

export const Default: Story = playgroundStory({
  args: { value: 60 },
  decorators: widthDecorator,
  render: (args) => <Progress {...args} aria-label="Upload progress" />,
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Progress size="sm" value={40} aria-label="Small progress" />
      <Progress size="default" value={60} aria-label="Default progress" />
      <Progress size="lg" value={80} aria-label="Large progress" />
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Progress value={0} aria-label="Empty progress" />
      <Progress value={50} aria-label="Half progress" />
      <Progress value={100} aria-label="Complete progress" />
    </div>
  ),
};

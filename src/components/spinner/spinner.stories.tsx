import type { Meta, StoryObj } from "@storybook/react";
import { choiceArg, defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Spinner } from "./spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  ...defineComponentStories("Loading spinner with size presets and an accessible status label.", {
    size: choiceArg(["sm", "default", "lg"] as const, {
      description: "Control dimensions preset.",
      defaultValue: "default",
    }),
    label: textArg({
      description: "Accessible label announced for the loading indicator.",
      defaultValue: "Loading",
    }),
  }),
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { label: "Loading" },
  render: (args) => <Spinner {...args} />,
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Spinner size="sm" label="Loading small" />
      <Spinner size="default" label="Loading" />
      <Spinner size="lg" label="Loading large" />
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <Spinner label="Saving changes" />
      <Spinner label="Processing" className="text-primary" />
    </div>
  ),
};

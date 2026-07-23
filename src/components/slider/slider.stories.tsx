import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  choiceArg,
  defineComponentStories,
  numberArg,
  rangeArg,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Slider } from "./slider";

const meta = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Range slider with size presets for track and thumb, supporting single and multi-thumb values.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Control dimensions preset.",
        defaultValue: "default",
      }),
      defaultValue: rangeArg("Initial thumb position for uncontrolled single-thumb usage.", {
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
      }),
      min: numberArg("Minimum selectable value.", { min: 0 }),
      max: numberArg("Maximum selectable value.", { min: 0, max: 100 }),
      step: numberArg("Increment between selectable values.", { min: 1 }),
      disabled: sharedArgTypes.disabled,
      orientation: choiceArg(["horizontal", "vertical"] as const, {
        description: "Layout axis for the slider.",
        defaultValue: "horizontal",
      }),
    },
  ),
} satisfies Meta<typeof Slider>;

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
  args: { defaultValue: 50, max: 100, step: 1 },
  decorators: widthDecorator,
  render: (args: Story["args"]) => {
    const { defaultValue, ...rest } = args ?? {};
    const value =
      typeof defaultValue === "number"
        ? [defaultValue]
        : Array.isArray(defaultValue)
          ? defaultValue
          : [50];
    return <Slider {...rest} defaultValue={value} aria-label="Volume" />;
  },
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex w-64 flex-col gap-6">
      <Slider size="sm" defaultValue={[40]} max={100} step={1} aria-label="Small volume" />
      <Slider defaultValue={[50]} max={100} step={1} aria-label="Default volume" />
      <Slider size="lg" defaultValue={[60]} max={100} step={1} aria-label="Large volume" />
    </div>
  ),
};

export const Range: Story = {
  ...storyDoc("Date range selection with start and end values."),
  args: { defaultValue: [25, 75], max: 100, step: 1, "aria-label": "Price range" },
  decorators: widthDecorator,
};

export const Disabled: Story = {
  ...storyDoc("Non-interactive muted presentation."),
  args: { defaultValue: [25], max: 100, disabled: true, "aria-label": "Disabled volume" },
  decorators: widthDecorator,
};

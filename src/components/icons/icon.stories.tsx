import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  choiceArg,
  defineComponentStories,
  hiddenArg,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Icon, Search, Settings } from "./index";

type IconStoryArgs = Omit<ComponentProps<typeof Icon>, "icon">;

const meta = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Thin wrapper over lucide-react icons with consistent sizing, semantic colors, and accessibility.",
    {
      icon: hiddenArg("Lucide icon component — fixed to Search in the playground."),
      size: choiceArg(["2xs", "xs", "sm", "default", "lg", "xl"] as const, {
        description: "Square dimension preset for the icon.",
        defaultValue: "default",
      }),
      color: choiceArg(["current", "muted", "primary", "destructive", "foreground"] as const, {
        description: "Semantic color preset for the icon stroke.",
        defaultValue: "current",
      }),
      label: textArg({
        description: "Accessible name when the icon conveys meaning. Omit for decorative icons.",
      }),
    },
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = playgroundStory({
  render: (args: IconStoryArgs) => <Icon icon={Search} {...args} />,
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex items-end gap-4">
      {(["2xs", "xs", "sm", "default", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon icon={Settings} size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  ...storyDoc("All Colors example."),
  render: () => (
    <div className="flex items-center gap-4">
      {(["current", "muted", "primary", "destructive", "foreground"] as const).map((color) => (
        <Icon key={color} icon={Search} color={color} />
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  ...storyDoc("Separator with centered label text."),
  render: () => <Icon icon={Search} label="Search" size="lg" />,
};

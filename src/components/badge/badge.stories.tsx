import type { Meta, StoryObj } from "@storybook/react";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { ArrowRightIcon, CheckIcon, ChevronRightIcon } from "../../lib/icons";
import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Small status label with variant and size presets, optional status dot, leading/trailing icons, and `asChild` composition.",
    {
      variant: choiceArg(["default", "secondary", "destructive", "outline"] as const, {
        description: "Color emphasis for the badge label.",
        defaultValue: "default",
      }),
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Typography and padding preset.",
        defaultValue: "default",
      }),
      dot: sharedArgTypes.dot,
    },
  ),
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { children: "Badge" },
  render: (args) => <Badge {...args} />,
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge dot variant="secondary">
        Live
      </Badge>
      <Badge dot variant="destructive">
        Error
      </Badge>
      <Badge>Active</Badge>
      <Badge asChild>
        <a href="/docs">Link badge</a>
      </Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  ...storyDoc("Tab labels with leading icons."),
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge iconBefore={<CheckIcon />}>Verified</Badge>
      <Badge variant="secondary" iconAfter={<ChevronRightIcon />}>
        Beta
      </Badge>
      <Badge variant="outline" iconBefore={<CheckIcon />} iconAfter={<ArrowRightIcon />}>
        Synced
      </Badge>
      <Badge size="sm" dot variant="secondary">
        Live
      </Badge>
    </div>
  ),
};

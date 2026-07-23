import type { Meta, StoryObj } from "@storybook/react";
import { choiceArg, defineComponentStories } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Avatar, AvatarFallback, AvatarImage, AvatarStatus } from "./avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  subcomponents: { AvatarImage, AvatarFallback, AvatarStatus },
  ...defineComponentStories(
    "User avatar with image, fallback initials, and optional presence status indicator.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Diameter preset for the avatar circle.",
        defaultValue: "default",
      }),
    },
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { size: "default" },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Loaded" />
        <AvatarFallback>LD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/missing.png" alt="Missing" />
        <AvatarFallback>FB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Online user" />
        <AvatarFallback>ON</AvatarFallback>
        <AvatarStatus status="online" label="Online" />
      </Avatar>
      <Avatar>
        <AvatarFallback>AW</AvatarFallback>
        <AvatarStatus status="away" label="Away" />
      </Avatar>
      <Avatar>
        <AvatarFallback>BS</AvatarFallback>
        <AvatarStatus status="busy" label="Busy" />
      </Avatar>
      <Avatar>
        <AvatarFallback>OF</AvatarFallback>
        <AvatarStatus status="offline" label="Offline" />
      </Avatar>
    </div>
  ),
};

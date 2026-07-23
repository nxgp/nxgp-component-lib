import type { Meta, StoryObj } from "@storybook/react";
import { choiceArg, defineComponentStories } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Placeholder shimmer for loading content with default and circular shape presets.",
    {
      variant: choiceArg(["default", "circle"] as const, {
        description: "Shape preset for the placeholder.",
        defaultValue: "default",
      }),
    },
  ),
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  render: (args) => <Skeleton className="h-4 w-48" {...args} />,
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-4 w-64" />
      <Skeleton variant="circle" className="size-12" />
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" className="size-10" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  ),
};

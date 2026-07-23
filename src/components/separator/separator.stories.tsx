import type { Meta, StoryObj } from "@storybook/react";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Separator, SeparatorWithLabel } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  subcomponents: { SeparatorWithLabel },
  ...defineComponentStories(
    "Visual divider between sections with horizontal or vertical orientation and optional centered label.",
    {
      orientation: choiceArg(["horizontal", "vertical"] as const, {
        description: "Layout axis for the divider.",
        defaultValue: "horizontal",
      }),
      decorative: sharedArgTypes.decorative,
    },
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

type SeparatorPlaygroundArgs = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

export const Default: Story = playgroundStory({
  args: { orientation: "horizontal", decorative: true },
  render: (args: SeparatorPlaygroundArgs) =>
    args.orientation === "vertical" ? (
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Left</span>
        <Separator {...args} />
        <span>Right</span>
      </div>
    ) : (
      <div className="w-full max-w-sm space-y-2">
        <p className="text-sm">Content above</p>
        <Separator {...args} />
        <p className="text-sm">Content below</p>
      </div>
    ),
});

export const Horizontal: Story = {
  ...storyDoc("Horizontal layout orientation."),
  render: () => (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-sm">Content above</p>
      <Separator />
      <p className="text-sm">Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  ...storyDoc("Vertical layout orientation."),
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};

export const WithLabel: Story = {
  ...storyDoc("Separator with centered label text."),
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-full max-w-sm">
        <SeparatorWithLabel label="or continue with" />
      </div>
      <div className="flex h-32 items-center gap-4">
        <span className="text-sm">Above</span>
        <SeparatorWithLabel label="or" orientation="vertical" />
        <span className="text-sm">Below</span>
      </div>
    </div>
  ),
};

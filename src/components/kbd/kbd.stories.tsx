import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Kbd } from "./kbd";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  ...defineComponentStories("Keyboard hint styling for shortcuts and key labels.", {
    children: textArg({
      description: "Key label text displayed inside the hint.",
      defaultValue: "⌘",
    }),
  }),
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { children: "⌘" },
  render: (args) => {
    const { children, ...rest } = args as ComponentProps<typeof Kbd>;
    return (
      <p className="inline-flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <span>Press</span>
        <Kbd {...rest}>{children ?? "⌘"}</Kbd>
        <Kbd>K</Kbd>
        <span>to open the command menu.</span>
      </p>
    );
  },
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  args: { children: "Esc" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
    </div>
  ),
};

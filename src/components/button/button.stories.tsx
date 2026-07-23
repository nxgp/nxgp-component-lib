import type { Meta, StoryObj } from "@storybook/react";
import { defineComponentStories, sharedArgTypes } from "../../../.storybook/utils/arg-types";
import { expect, storyAction, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { XIcon } from "../../lib/icons";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Primary action control with variant and size presets, loading state, and optional `asChild` composition.",
    {
      variant: sharedArgTypes.buttonVariant(),
      size: sharedArgTypes.buttonSize(),
      fullWidth: sharedArgTypes.fullWidth,
      loading: sharedArgTypes.loading,
      loadingLabel: sharedArgTypes.loadingLabel,
      disabled: sharedArgTypes.disabled,
    },
    ["onClick"],
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { children: "Button" },
  actions: ["onClick"],
  render: (args) => <Button {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /button/i });
    await userEvent.click(button);
    await expect(storyAction(args, "onClick")).toHaveBeenCalled();
  },
});

export const InContext: Story = {
  ...storyDoc("Primary and secondary actions in a form footer row."),
  render: () => (
    <div className="flex w-full max-w-md justify-end gap-2 rounded-lg border border-border bg-card p-4">
      <Button type="button" variant="outline">
        Cancel
      </Button>
      <Button type="submit">Save</Button>
    </div>
  ),
};

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default (compact)</Button>
        <Button size="comfortable">Comfortable</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-xs" aria-label="Close extra small">
          <XIcon />
        </Button>
        <Button size="icon-sm" aria-label="Close small">
          <XIcon />
        </Button>
        <Button size="icon" aria-label="Close">
          <XIcon />
        </Button>
        <Button size="icon-lg" aria-label="Close large">
          <XIcon />
        </Button>
      </div>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button loading loadingLabel="Saving">
        Loading
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  ...storyDoc("Fills the parent container width — use in forms and narrow layouts."),
  args: { children: "Full width", fullWidth: true },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const AsChild: Story = {
  ...storyDoc("Merges props onto a child element via Radix Slot composition."),
  render: () => (
    <Button asChild variant="link">
      <a href="/docs">Link as button</a>
    </Button>
  ),
};

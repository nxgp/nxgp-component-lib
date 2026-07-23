import type { Meta, StoryObj } from "@storybook/react";
import { booleanArg, defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Input } from "../input";
import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Accessible form label associated with a control via `htmlFor`, with optional required marker and hint.",
    {
      htmlFor: textArg({
        description: "ID of the associated form control.",
        defaultValue: "email",
      }),
      required: booleanArg({
        description: "Shows a required asterisk after the label text.",
        defaultValue: false,
      }),
      hint: textArg({ description: "Optional hint shown in muted text beside the label." }),
    },
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = playgroundStory({
  args: {
    htmlFor: "email",
    required: false,
  },
  render: (args: Story["args"]) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label {...args}>Email</Label>
      <Input id={args?.htmlFor} type="email" placeholder="you@example.com" aria-label="Email" />
    </div>
  ),
});

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <Label htmlFor="name-default">Full name</Label>
      <Label htmlFor="name-required" required>
        Full name (required)
      </Label>
      <Label htmlFor="username-hint" hint="public display name">
        Username (with hint)
      </Label>
      <Label htmlFor="password-both" required hint="min 8 characters">
        Password (required + hint)
      </Label>
    </div>
  ),
};

export const WithControl: Story = {
  ...storyDoc("Example with control."),
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="email-control" required hint="work email only">
        Email
      </Label>
      <Input id="email-control" type="email" placeholder="you@example.com" aria-label="Email" />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  ...defineComponentStories("Multi-line text input with size, variant, and invalid states.", {
    variant: choiceArg(["default", "ghost", "flushed"] as const, {
      description: "Border and background treatment for the field.",
      defaultValue: "default",
    }),
    size: choiceArg(["default", "sm", "lg"] as const, {
      description: "Control height and horizontal padding preset.",
      defaultValue: "default",
    }),
    invalid: sharedArgTypes.invalid,
    disabled: sharedArgTypes.disabled,
    placeholder: textArg({ description: "Placeholder text shown when the field is empty." }),
  }),
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { placeholder: "Write your message…" },
  render: (args) => <Textarea {...args} aria-label="Message" />,
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Textarea placeholder="Default" aria-label="Default message" />
      <Textarea variant="ghost" placeholder="Ghost" aria-label="Ghost message" />
      <Textarea variant="flushed" placeholder="Flushed" aria-label="Flushed message" />
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Textarea size="sm" placeholder="Small" aria-label="Small message" />
      <Textarea placeholder="Default" aria-label="Default size message" />
      <Textarea size="lg" placeholder="Large" aria-label="Large message" />
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Textarea placeholder="Default" aria-label="Default state message" />
      <Textarea
        placeholder="Invalid"
        invalid
        defaultValue="Too short"
        aria-label="Invalid message"
      />
      <Textarea placeholder="Disabled" disabled aria-label="Disabled message" />
    </div>
  ),
};

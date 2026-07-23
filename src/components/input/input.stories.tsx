import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Input, InputGroup, InputGroupAddon, InputGroupInput } from "./input";
import { ClearableInput, PasswordInput } from "./input-patterns";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  subcomponents: { InputGroup, InputGroupAddon, InputGroupInput },
  ...defineComponentStories(
    "Text input field with size, variant, and invalid states plus optional grouped addon patterns.",
    {
      variant: choiceArg(["default", "ghost", "flushed"] as const, {
        description: "Border and background treatment for the field.",
        defaultValue: "default",
      }),
      size: choiceArg(["default", "sm", "lg"] as const, {
        description: "Control height and horizontal padding preset.",
        defaultValue: "default",
      }),
      type: choiceArg(["text", "email", "password", "search", "tel", "url", "number"] as const, {
        description: "Native input type.",
        defaultValue: "text",
      }),
      invalid: sharedArgTypes.invalid,
      disabled: sharedArgTypes.disabled,
      placeholder: textArg({ description: "Placeholder text shown when the field is empty." }),
    },
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { placeholder: "Email" },
  render: (args) => <Input {...args} aria-label="Email" />,
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Default" aria-label="Default input" />
      <Input variant="ghost" placeholder="Ghost" aria-label="Ghost input" />
      <Input variant="flushed" placeholder="Flushed" aria-label="Flushed input" />
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Input size="sm" placeholder="Small" aria-label="Small input" />
      <Input placeholder="Default" aria-label="Default size input" />
      <Input size="lg" placeholder="Large" aria-label="Large input" />
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Input placeholder="Default" aria-label="Default state input" />
      <Input placeholder="Invalid" invalid defaultValue="bad@" aria-label="Invalid input" />
      <Input placeholder="Disabled" disabled aria-label="Disabled input" />
    </div>
  ),
};

export const WithAddon: Story = {
  ...storyDoc("Example with addon."),
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>https://</InputGroupAddon>
      <InputGroupInput placeholder="example.com" aria-label="Website URL" />
      <InputGroupAddon align="inline-end">.com</InputGroupAddon>
    </InputGroup>
  ),
};

export const PasswordAndClear: Story = {
  ...storyDoc("Password And Clear example."),
  render: function PasswordAndClearStory() {
    const [query, setQuery] = useState("Search term");

    return (
      <div className="flex max-w-sm flex-col gap-3">
        <PasswordInput aria-label="Password" placeholder="Enter password" />
        <ClearableInput
          aria-label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
    );
  },
};

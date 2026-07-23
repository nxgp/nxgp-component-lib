import type { Meta, StoryObj } from "@storybook/react";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { Switch } from "../switch/switch";
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./index";

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  subcomponents: {
    FieldLabel,
    FieldControl,
    FieldDescription,
    FieldError,
    FieldContent,
    FieldTitle,
    FieldGroup,
    FieldSet,
    FieldLegend,
    FieldSeparator,
  },
  ...defineComponentStories(
    "Form field layout root wiring label, control, description, and error via context.",
    {
      orientation: choiceArg(["vertical", "horizontal", "responsive"] as const, {
        description: "Label and control layout direction.",
        defaultValue: "vertical",
      }),
      invalid: sharedArgTypes.invalid,
    },
  ),
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

type FieldPlaygroundArgs = {
  orientation?: "vertical" | "horizontal" | "responsive";
  invalid?: boolean;
};

export const Default: Story = playgroundStory({
  args: { orientation: "vertical", invalid: false },
  render: (args: FieldPlaygroundArgs) => (
    <Field {...args} className="max-w-sm">
      <FieldLabel required>Email</FieldLabel>
      <FieldControl asChild>
        <Input type="email" placeholder="you@example.com" invalid={args.invalid} />
      </FieldControl>
      <FieldDescription>We will never share your email.</FieldDescription>
    </Field>
  ),
});

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <Field>
        <FieldLabel>Username</FieldLabel>
        <FieldControl asChild>
          <Input placeholder="jane" aria-label="Username" />
        </FieldControl>
        <FieldDescription>Your public display name.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel required>Password</FieldLabel>
        <FieldControl asChild>
          <Input type="password" invalid placeholder="••••••••" aria-label="Password" />
        </FieldControl>
        <FieldError>Password must be at least 8 characters.</FieldError>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel hint="optional">Newsletter</FieldLabel>
        <FieldControl asChild>
          <Input placeholder="you@example.com" aria-label="Newsletter email" />
        </FieldControl>
      </Field>
    </div>
  ),
};

export const WithControl: Story = {
  ...storyDoc("Example with control."),
  render: () => (
    <Field className="max-w-sm" invalid>
      <FieldLabel required hint="work email">
        Email
      </FieldLabel>
      <FieldControl asChild>
        <Input type="email" invalid placeholder="you@example.com" />
      </FieldControl>
      <FieldDescription>Used for account notifications.</FieldDescription>
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  ),
};

export const FieldGroupLayout: Story = {
  ...storyDoc("Field Group Layout example."),
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Payment method</FieldLegend>
          <Field>
            <FieldDescription>All transactions are secure.</FieldDescription>
          </Field>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="card-name">Name on card</FieldLabel>
              <FieldControl asChild>
                <Input id="card-name" placeholder="Jane Doe" />
              </FieldControl>
            </Field>
            <Field>
              <FieldLabel htmlFor="card-number">Card number</FieldLabel>
              <FieldControl asChild>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </FieldControl>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator>Or</FieldSeparator>
        <FieldSet>
          <FieldLegend variant="label">Preferences</FieldLegend>
          <Field orientation="horizontal">
            <Checkbox id="kitchen-same-address" />
            <FieldContent>
              <FieldLabel htmlFor="kitchen-same-address" className="font-normal">
                Same as shipping address
              </FieldLabel>
              <FieldDescription>Use your saved shipping details.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  ),
};

export const FieldContentPattern: Story = {
  ...storyDoc("Field Content Pattern example."),
  render: () => (
    <Field className="max-w-md" orientation="horizontal" invalid>
      <Switch id="field-content-switch" />
      <FieldContent>
        <FieldTitle>Two-factor authentication</FieldTitle>
        <FieldDescription>Add an extra layer of security to your account.</FieldDescription>
        <FieldError errors={[{ message: "Enable 2FA before continuing." }]} />
      </FieldContent>
    </Field>
  ),
};

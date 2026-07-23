import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { defineComponentStories, sharedArgTypes } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { CircleIcon } from "../../lib/icons";
import { Button } from "../button";
import { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle } from "./alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  subcomponents: { AlertTitle, AlertDescription, AlertAction, AlertClose },
  ...defineComponentStories(
    "Inline alert message with semantic tone variants and optional title, description, action, and dismiss controls.",
    {
      variant: sharedArgTypes.alertVariant(),
    },
  ),
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultBody = (
  <>
    <AlertTitle>Heads up</AlertTitle>
    <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
  </>
);

export const Default: Story = playgroundStory({
  args: { variant: "default" },
  render: (args) => (
    <Alert className="w-[400px]" {...args}>
      {defaultBody}
    </Alert>
  ),
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex w-[400px] flex-col gap-4">
      <Alert>
        <CircleIcon />
        {defaultBody}
      </Alert>
      <Alert variant="destructive">
        <CircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please sign in again.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleIcon />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your profile was saved.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <CircleIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Storage is almost full.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <CircleIcon />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>New features are available.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex w-[400px] flex-col gap-4">
      <Alert>
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>A new version of the app is ready to install.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Check your card details and try again.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  ...storyDoc("Dismiss control to close the alert."),
  render: function DismissibleStory() {
    const [open, setOpen] = useState(true);
    if (!open) {
      return (
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Show alert
        </Button>
      );
    }
    return (
      <Alert className="w-[400px]">
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>A new version is ready to install.</AlertDescription>
        <AlertAction>
          <Button type="button" size="sm" variant="outline">
            Install
          </Button>
        </AlertAction>
        <AlertClose onClick={() => setOpen(false)} />
      </Alert>
    );
  },
};

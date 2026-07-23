import type { Meta, StoryObj } from "@storybook/react";
import { withToastHost } from "../../../.storybook/decorators/with-toast-host";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, waitFor, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Button } from "../button";
import { Toaster, toast } from "./index";

const componentStories = defineComponentStories(
  "Theme-aware toast host — mount once near the app root and call `toast()` anywhere.",
  {
    closeButton: sharedArgTypes.closeButton,
    richColors: sharedArgTypes.richColors,
    position: choiceArg(
      [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "top-center",
        "bottom-center",
      ] as const,
      {
        description: "Viewport corner or edge where toasts appear.",
        defaultValue: "bottom-right",
      },
    ),
  },
);

const meta = {
  title: "Components/Toast",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [withToastHost],
  ...componentStories,
  parameters: {
    ...componentStories.parameters,
    docs: {
      ...componentStories.parameters.docs,
      story: {
        inline: false,
        iframeHeight: 180,
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = playgroundStory({
  args: {
    closeButton: true,
    richColors: true,
    position: "bottom-right",
  },
  render: () => (
    <Button variant="outline" onClick={() => toast("Your meeting starts in 10 minutes.")}>
      Show toast
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /show toast/i }));
    await waitFor(() => {
      expect(portal().getByText(/your meeting starts in 10 minutes/i)).toBeInTheDocument();
    });
  },
});

export const InContext: Story = {
  ...storyDoc("Success feedback after a form save action."),
  render: () => (
    <div className="flex w-full max-w-md justify-end rounded-lg border border-border bg-card p-4">
      <Button type="button" onClick={() => toast.success("Settings saved successfully.")}>
        Save settings
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /save settings/i }));
    await waitFor(() => {
      expect(portal().getByText(/settings saved successfully/i)).toBeInTheDocument();
    });
  },
};

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  args: {
    closeButton: true,
    richColors: true,
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast("Saved")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Profile updated")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("New message")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  args: {
    closeButton: true,
    richColors: true,
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event created", {
            description: "Monday, January 3rd at 6:00pm",
            action: { label: "Undo", onClick: () => toast("Undone") },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Dismiss me", {
            description: "Swipe or use the close button",
            dismissible: true,
          })
        }
      >
        Dismissible
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise<{ name: string }>(
            () =>
              new Promise((resolve) => {
                setTimeout(() => resolve({ name: "Event" }), 1500);
              }),
            {
              loading: "Creating event...",
              success: (data) => `${data.name} has been created`,
              error: "Could not create event",
            },
          )
        }
      >
        Promise
      </Button>
    </div>
  ),
};

export const AllPositions: Story = {
  ...storyDoc("All Positions example."),
  args: {
    closeButton: true,
    richColors: true,
    position: "top-left",
  },
  render: (args) => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Use the `position` control — supported: all corners and center variants.
      </p>
      <Toaster {...args} />
      <Button variant="outline" onClick={() => toast("Positioned toast")}>
        Show toast
      </Button>
    </div>
  ),
};

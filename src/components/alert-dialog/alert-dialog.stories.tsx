import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { Button } from "../button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

type AlertDialogStoryArgs = ComponentProps<typeof AlertDialog> & {
  size?: ComponentProps<typeof AlertDialogContent>["size"];
};

const meta = {
  title: "Components/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  subcomponents: {
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogOverlay,
    AlertDialogPortal,
  },
  ...defineComponentStories(
    "Modal confirmation dialog that interrupts the user — requires an explicit action to dismiss.",
    {
      open: booleanArg({ description: "Controlled open state." }),
      defaultOpen: booleanArg({
        description: "Initial open state when uncontrolled.",
        defaultValue: false,
      }),
      size: sharedArgTypes.dialogSize(),
    },
    ["onOpenChange"],
  ),
} satisfies Meta<AlertDialogStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const alertBody = (
  <>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </>
);

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    defaultOpen: false,
    size: "default",
  },
  render: (args: AlertDialogStoryArgs) => {
    const { size, ...rootArgs } = args;
    return (
      <AlertDialog {...rootArgs}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size={size}>{alertBody}</AlertDialogContent>
      </AlertDialog>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /delete account/i }));
    await expect(portal().getByRole("alertdialog")).toBeInTheDocument();
    await expect(portal().getByText(/are you absolutely sure/i)).toBeVisible();
  },
});

export const Sizes: Story = {
  ...storyDoc("Every content size preset, each with its own trigger."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size={size === "default" ? "default" : "sm"}>
              {size}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size={size}>{alertBody}</AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

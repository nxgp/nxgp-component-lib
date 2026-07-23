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
import { Input } from "../input";
import { Label } from "../label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

type DialogStoryArgs = ComponentProps<typeof Dialog> & {
  size?: ComponentProps<typeof DialogContent>["size"];
  showCloseButton?: boolean;
};

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  subcomponents: {
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
  },
  ...defineComponentStories(
    "Modal dialog with size presets, optional close control, and compound header/footer layout.",
    {
      open: booleanArg({ description: "Controlled open state." }),
      defaultOpen: booleanArg({
        description: "Initial open state when uncontrolled.",
        defaultValue: false,
      }),
      modal: booleanArg({
        description: "When true, interaction outside is blocked and focus is trapped.",
        defaultValue: true,
      }),
      size: sharedArgTypes.dialogSize(),
      showCloseButton: sharedArgTypes.showCloseButton,
    },
    ["onOpenChange"],
  ),
} satisfies Meta<DialogStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const dialogBody = (
  <>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Save changes</Button>
    </DialogFooter>
  </>
);

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    defaultOpen: false,
    size: "default",
    showCloseButton: true,
    modal: true,
  },
  render: (args: DialogStoryArgs) => {
    const { size, showCloseButton, ...rootArgs } = args;
    return (
      <Dialog {...rootArgs}>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent size={size} showCloseButton={showCloseButton}>
          {dialogBody}
        </DialogContent>
      </Dialog>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open dialog/i }));
    await expect(portal().getByRole("dialog")).toBeInTheDocument();
    await expect(portal().getByText("Edit profile")).toBeInTheDocument();
  },
});

export const InContext: Story = {
  ...storyDoc("Confirm-before-save pattern in a settings form footer."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <form
      className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-2">
        <Label htmlFor="dialog-name">Display name</Label>
        <Input id="dialog-name" defaultValue="Ada Lovelace" />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" className="w-full">
            Save changes
          </Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Save changes?</DialogTitle>
            <DialogDescription>Your profile will be updated immediately.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /save changes/i }));
    await expect(portal().getByRole("dialog")).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  ...storyDoc("Every content size preset, each with its own trigger."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DialogTrigger>
          <DialogContent size={size}>{dialogBody}</DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const WithoutCloseButton: Story = {
  ...storyDoc("Dismiss only via explicit footer actions — use for destructive confirms."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">No close button</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>Use the footer action to dismiss this dialog.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

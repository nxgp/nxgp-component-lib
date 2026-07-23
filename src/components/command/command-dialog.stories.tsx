import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { booleanArg, defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { Button } from "../button";
import {
  CommandDialog,
  CommandDialogProvider,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  useCommandDialog,
} from "./command-dialog";

type CommandDialogStoryArgs = Omit<ComponentProps<typeof CommandDialogProvider>, "children"> &
  Pick<ComponentProps<typeof CommandDialog>, "title" | "description">;

const meta = {
  title: "Components/CommandDialog",
  component: CommandDialog,
  tags: ["autodocs"],
  subcomponents: {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
  },
  ...defineComponentStories(
    "Modal command palette for global search and keyboard shortcuts (e.g. ⌘K).",
    {
      open: booleanArg({
        description: "Controlled open state for the command dialog.",
        defaultValue: false,
      }),
      keyboardShortcut: booleanArg({
        description: "Register ⌘/Ctrl+K to toggle the palette.",
        defaultValue: true,
      }),
      shortcut: textArg({
        description: "Keyboard shortcut key without modifiers.",
        defaultValue: "k",
      }),
      shortcutLabel: textArg({
        description: "Accessible label for the keyboard shortcut.",
      }),
      title: textArg({
        description: "Screen-reader title rendered in a visually hidden dialog header.",
        defaultValue: "Command palette",
      }),
      description: textArg({
        description: "Optional screen-reader description in the dialog header.",
      }),
    },
    ["onOpenChange"],
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj;

function OpenPaletteButton() {
  const { setOpen } = useCommandDialog();
  return (
    <Button type="button" variant="outline" onClick={() => setOpen(true)}>
      Open palette (⌘K)
    </Button>
  );
}

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    keyboardShortcut: true,
    shortcut: "k",
    title: "Command palette",
  },
  render: (args: CommandDialogStoryArgs) => {
    const { title, description, ...providerArgs } = args;
    return (
      <CommandDialogProvider {...providerArgs}>
        <OpenPaletteButton />
        <CommandDialog title={title} description={description}>
          <CommandInput placeholder="Search commands..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="profile">Profile</CommandItem>
              <CommandItem value="settings">Settings</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem value="logout">Log out</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </CommandDialogProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open palette/i }));
    await expect(portal().getByRole("dialog")).toBeInTheDocument();
    await expect(portal().getByPlaceholderText(/search commands/i)).toBeInTheDocument();
  },
});

export const Controlled: Story = {
  ...storyDoc("Controlled open/value state for programmatic control."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <CommandDialog open title="Search">
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="copy">Copy</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ),
};

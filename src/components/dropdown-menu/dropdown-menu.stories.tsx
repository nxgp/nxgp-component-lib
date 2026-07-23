import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { booleanArg, choiceArg, defineComponentStories } from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type DropdownMenuStoryArgs = ComponentProps<typeof DropdownMenu>;

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  subcomponents: {
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
  },
  ...defineComponentStories(
    "Dropdown action menu with item variants, submenus, and checkbox/radio groups.",
    {
      open: booleanArg({ description: "Controlled open state." }),
      defaultOpen: booleanArg({
        description: "Initial open state when uncontrolled.",
        defaultValue: false,
      }),
      modal: booleanArg({
        description: "When true, interaction outside is blocked while open.",
        defaultValue: true,
      }),
      dir: choiceArg(["ltr", "rtl"] as const, {
        description: "Reading direction for menu layout.",
        defaultValue: "ltr",
      }),
    },
    ["onOpenChange"],
  ),
} satisfies Meta<DropdownMenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    defaultOpen: false,
    modal: true,
  },
  render: (args: DropdownMenuStoryArgs) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open menu/i }));
    await expect(portal().getByRole("menuitem", { name: /profile/i })).toBeInTheDocument();
  },
});

export const InContext: Story = {
  ...storyDoc("Row actions menu on a list item — common data-table pattern."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex w-full max-w-md items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <div>
        <p className="text-sm font-medium">Invoice #1024</p>
        <p className="text-xs text-muted-foreground">Due Mar 12 · $240.00</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Invoice actions">
            ⋯
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem>Download PDF</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /invoice actions/i }));
    await expect(portal().getByRole("menuitem", { name: /view details/i })).toBeInTheDocument();
  },
};

export const ItemVariants: Story = {
  ...storyDoc("Size and destructive variants for menu items."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Item variants</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem size="sm">Small item</DropdownMenuItem>
        <DropdownMenuItem>Default item</DropdownMenuItem>
        <DropdownMenuItem size="lg">Large item</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubmenu: Story = {
  ...storyDoc("Nested submenu for grouped actions."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New tab</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Save page as…</DropdownMenuItem>
            <DropdownMenuItem>Create shortcut</DropdownMenuItem>
            <DropdownMenuItem>Developer tools</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

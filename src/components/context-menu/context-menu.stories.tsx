import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { booleanArg, choiceArg, defineComponentStories } from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

type ContextMenuStoryArgs = ComponentProps<typeof ContextMenu>;

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  subcomponents: {
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuGroup,
    ContextMenuCheckboxItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
  },
  ...defineComponentStories(
    "Right-click context menu with item variants, submenus, and checkbox/radio groups.",
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
} satisfies Meta<ContextMenuStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerClass =
  "flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground";

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    defaultOpen: false,
    modal: true,
  },
  render: (args: ContextMenuStoryArgs) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className={triggerClass}>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem disabled>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Save page as…</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByText(/right click here/i);
    await userEvent.pointer({ keys: "[MouseRight>]", target: trigger });
    await expect(portal().getByRole("menuitem", { name: /back/i })).toBeInTheDocument();
  },
});

export const ItemVariants: Story = {
  ...storyDoc("Item Variants example."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerClass}>
        Right click for item variants
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem size="sm">Small item</ContextMenuItem>
        <ContextMenuItem>Default item</ContextMenuItem>
        <ContextMenuItem size="lg">Large item</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithSubmenu: Story = {
  ...storyDoc("Nested submenu for grouped actions."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerClass}>Right click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Save page as…</ContextMenuItem>
            <ContextMenuItem>Create shortcut</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { Button } from "../button/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

type DrawerStoryArgs = ComponentProps<typeof Drawer> & {
  size?: ComponentProps<typeof DrawerContent>["size"];
  resizable?: boolean;
  showCloseButton?: boolean;
};

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  subcomponents: {
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
    DrawerOverlay,
    DrawerPortal,
  },
  ...defineComponentStories(
    "Mobile-friendly drawer panel with directional slide-in — powered by Vaul.",
    {
      open: booleanArg({ description: "Controlled open state." }),
      defaultOpen: booleanArg({
        description: "Initial open state when uncontrolled.",
        defaultValue: false,
      }),
      shouldScaleBackground: booleanArg({
        description: "Scales the page background when the drawer opens.",
        defaultValue: true,
      }),
      direction: choiceArg(["top", "bottom", "left", "right"] as const, {
        description: "Edge from which the drawer slides in.",
        defaultValue: "bottom",
      }),
      size: sharedArgTypes.drawerSize(),
      resizable: sharedArgTypes.resizable,
      showCloseButton: sharedArgTypes.showCloseButton,
      dismissible: booleanArg({
        description: "When false, the drawer cannot be dismissed by dragging or clicking outside.",
        defaultValue: true,
      }),
    },
    ["onOpenChange"],
  ),
} satisfies Meta<DrawerStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const drawerBody = (
  <>
    <DrawerHeader className="pr-10">
      <DrawerTitle>Move goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <div className="p-4 text-sm text-muted-foreground">Drawer body content.</div>
    <DrawerFooter>
      <Button type="button">Submit</Button>
      <DrawerClose asChild>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </DrawerClose>
    </DrawerFooter>
  </>
);

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    defaultOpen: false,
    direction: "bottom",
    size: "default",
    resizable: false,
    showCloseButton: false,
    shouldScaleBackground: true,
    dismissible: true,
  },
  render: (args: DrawerStoryArgs) => {
    const {
      direction,
      size,
      resizable,
      showCloseButton,
      shouldScaleBackground,
      dismissible,
      ...rootArgs
    } = args;
    return (
      <Drawer
        direction={direction}
        shouldScaleBackground={shouldScaleBackground}
        dismissible={dismissible}
        {...rootArgs}
      >
        <DrawerTrigger asChild>
          <Button variant="outline">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent size={size} resizable={resizable} showCloseButton={showCloseButton}>
          {drawerBody}
        </DrawerContent>
      </Drawer>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open drawer/i }));
    await expect(portal().getByText("Move goal")).toBeInTheDocument();
  },
});

export const InContext: Story = {
  ...storyDoc("Mobile filter panel — bottom drawer for secondary settings on small screens."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium">Products</p>
      <p className="text-xs text-muted-foreground">12 results · tap filters to refine</p>
      <Drawer direction="bottom">
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Narrow results by category and price.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 text-sm text-muted-foreground">Filter controls go here.</div>
          <DrawerFooter>
            <Button type="button">Apply filters</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /filters/i }));
    await expect(portal().getByText("Apply filters")).toBeInTheDocument();
  },
};

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["bottom", "top", "left", "right"] as const).map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="capitalize">
              {direction}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="capitalize">{direction} drawer</DrawerTitle>
              <DrawerDescription>Drawer opened from the {direction}.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <Drawer key={size}>
          <DrawerTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DrawerTrigger>
          <DrawerContent size={size}>{drawerBody}</DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const Resizable: Story = {
  ...storyDoc("Drag handle for resizing along the open axis."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["bottom", "right"] as const).map((direction) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">Resizable {direction}</Button>
          </DrawerTrigger>
          <DrawerContent resizable showCloseButton onClose={() => undefined}>
            <DrawerHeader className="pr-10">
              <DrawerTitle className="capitalize">Resizable {direction}</DrawerTitle>
              <DrawerDescription>Drag the dome handle on the border to resize.</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4 text-sm text-muted-foreground">
              Resize this drawer using the handle on the open edge.
            </div>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const SidePanel: Story = {
  ...storyDoc("Side Panel example."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["right", "left"] as const).map((direction) => (
        <Drawer key={direction} direction={direction} shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="capitalize">
              {direction} panel
            </Button>
          </DrawerTrigger>
          <DrawerContent showCloseButton className="gap-4 p-6 shadow-lg">
            <DrawerHeader className="gap-1.5 p-0 text-center sm:text-left">
              <DrawerTitle className="capitalize">{direction} panel</DrawerTitle>
              <DrawerDescription>Slide-over panel from the {direction} edge.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};

export const WithCloseButton: Story = {
  ...storyDoc("Example with close button."),
  render: () => (
    <Drawer defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent showCloseButton onClose={() => undefined}>
        <DrawerHeader className="pr-10">
          <DrawerTitle>Close button</DrawerTitle>
          <DrawerDescription>Built-in close control in the top-right corner.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

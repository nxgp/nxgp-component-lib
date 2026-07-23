import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  numberArg,
} from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { Button } from "../button";
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

type PopoverStoryArgs = ComponentProps<typeof Popover> & {
  contentSize?: ComponentProps<typeof PopoverContent>["size"];
  showArrow?: boolean;
};

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  subcomponents: {
    PopoverTrigger,
    PopoverContent,
    PopoverAnchor,
    PopoverClose,
    PopoverArrow,
  },
  ...defineComponentStories(
    "Floating panel anchored to a trigger — click (default) or hover with shared content presets.",
    {
      trigger: choiceArg(["click", "hover"] as const, {
        description: "How the popover opens.",
        defaultValue: "click",
      }),
      open: booleanArg({ description: "Controlled open state." }),
      defaultOpen: booleanArg({
        description: "Initial open state when uncontrolled.",
        defaultValue: false,
      }),
      modal: booleanArg({
        description: "Click mode only — blocks interaction outside while open.",
        defaultValue: false,
      }),
      openDelay: numberArg("Hover mode only — delay in ms before opening."),
      closeDelay: numberArg("Hover mode only — delay in ms before closing."),
      contentSize: choiceArg(["sm", "default", "lg"] as const, {
        description: "Width preset for popover content.",
        defaultValue: "default",
      }),
      showArrow: booleanArg({
        description: "Click mode only — renders a pointer arrow on the content.",
        defaultValue: false,
      }),
    },
    ["onOpenChange"],
  ),
} satisfies Meta<PopoverStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const clickBody = (
  <div className="space-y-2 p-4">
    <h4 className="font-medium leading-none">Dimensions</h4>
    <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
  </div>
);

const hoverBody = (
  <div className="space-y-2 p-4">
    <h4 className="text-sm font-semibold">@nextjs</h4>
    <p className="text-sm text-muted-foreground">
      The React Framework – created and maintained by Vercel.
    </p>
  </div>
);

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    trigger: "click",
    defaultOpen: false,
    contentSize: "default",
    showArrow: false,
    modal: false,
    openDelay: 200,
    closeDelay: 100,
  },
  render: (args: PopoverStoryArgs) => {
    const { contentSize, showArrow, trigger, ...rootArgs } = args;
    const body = trigger === "hover" ? hoverBody : clickBody;
    return (
      <Popover trigger={trigger} {...rootArgs}>
        <PopoverTrigger asChild>
          <Button variant={trigger === "hover" ? "link" : "outline"}>
            {trigger === "hover" ? "@nextjs" : "Open popover"}
          </Button>
        </PopoverTrigger>
        <PopoverContent size={contentSize}>
          {body}
          {showArrow && trigger === "click" ? <PopoverArrow /> : null}
        </PopoverContent>
      </Popover>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open popover/i }));
    await expect(portal().getByText("Dimensions")).toBeInTheDocument();
  },
});

export const InContext: Story = {
  ...storyDoc("Inline help popover beside a form label."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="w-full max-w-sm space-y-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <label htmlFor="api-key" className="text-sm font-medium">
          API key
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon-xs" aria-label="API key help">
              ?
            </Button>
          </PopoverTrigger>
          <PopoverContent size="sm" align="start">
            <p className="text-sm text-muted-foreground">
              Generate a key in Settings → API. Keys expire after 90 days.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <input
        id="api-key"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        placeholder="sk_live_…"
        readOnly
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /api key help/i }));
    await expect(portal().getByText(/generate a key/i)).toBeInTheDocument();
  },
};

export const Sizes: Story = {
  ...storyDoc("Every content size preset, each with its own trigger."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Popover key={size}>
          <PopoverTrigger asChild>
            <Button variant="outline">{size}</Button>
          </PopoverTrigger>
          <PopoverContent size={size}>{clickBody}</PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const Hover: Story = {
  ...storyDoc('Opens on pointer hover — use Popover trigger="hover" or HoverCard alias.'),
  decorators: [overlayCanvasDecorator],
  args: { defaultOpen: true, openDelay: 200, closeDelay: 100 },
  render: (args) => (
    <Popover trigger="hover" {...args}>
      <PopoverTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </PopoverTrigger>
      <PopoverContent>{hoverBody}</PopoverContent>
    </Popover>
  ),
};

export const HoverSizes: Story = {
  ...storyDoc("Hover Sizes example."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Popover key={size} trigger="hover">
          <PopoverTrigger asChild>
            <Button variant="link">{size}</Button>
          </PopoverTrigger>
          <PopoverContent size={size}>{hoverBody}</PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

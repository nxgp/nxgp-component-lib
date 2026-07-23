import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  numberArg,
} from "../../../.storybook/utils/arg-types";
import { expect, portal, userEvent, waitFor, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { cn } from "../../lib/cn";
import { Button } from "../button";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

type TooltipStoryArgs = ComponentProps<typeof Tooltip> & {
  position?: ComponentProps<typeof TooltipContent>["position"];
  variant?: ComponentProps<typeof TooltipContent>["variant"];
};

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  subcomponents: {
    TooltipTrigger,
    TooltipContent,
    TooltipArrow,
    TooltipProvider,
  },
  ...defineComponentStories(
    "Brief contextual label shown on hover or focus — wrap stories in TooltipProvider.",
    {
      open: booleanArg({ description: "Controlled open state." }),
      defaultOpen: booleanArg({
        description: "Initial open state when uncontrolled.",
        defaultValue: false,
      }),
      delayDuration: numberArg("Delay in ms before the tooltip opens."),
      disableHoverableContent: booleanArg({
        description: "When true, hovering the tooltip content does not keep it open.",
        defaultValue: false,
      }),
      position: choiceArg(["top", "right", "bottom", "left"] as const, {
        description: "Preferred edge of the trigger to render against.",
        defaultValue: "top",
      }),
      variant: choiceArg(["default", "inverted"] as const, {
        description: "Color treatment for the tooltip surface.",
        defaultValue: "inverted",
      }),
    },
    ["onOpenChange"],
  ),
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onOpenChange"],
  args: {
    defaultOpen: false,
    position: "top",
    variant: "inverted",
  },
  render: (args: TooltipStoryArgs) => {
    const { position, variant, ...rootArgs } = args;
    return (
      <Tooltip {...rootArgs}>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover</Button>
        </TooltipTrigger>
        <TooltipContent position={position} variant={variant}>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole("button", { name: /hover/i }));
    await waitFor(() => {
      expect(portal().getByRole("tooltip")).toHaveTextContent("Add to library");
    });
  },
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Inverted</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Default inverted tooltip</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline">Contrast</Button>
        </TooltipTrigger>
        <TooltipContent variant="default">
          <p>High-contrast tooltip</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const AllPositions: Story = {
  ...storyDoc("All Positions example."),
  decorators: [overlayCanvasDecorator],
  render: () => (
    <div className="relative mx-auto flex h-80 w-full max-w-lg items-center justify-center">
      {(["top", "right", "bottom", "left"] as const).map((position) => (
        <div
          key={position}
          className={cn(
            "absolute",
            position === "top" && "top-6 left-1/2 -translate-x-1/2",
            position === "bottom" && "bottom-6 left-1/2 -translate-x-1/2",
            position === "left" && "left-6 top-1/2 -translate-y-1/2",
            position === "right" && "right-6 top-1/2 -translate-y-1/2",
          )}
        >
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button variant="outline" className="capitalize">
                {position}
              </Button>
            </TooltipTrigger>
            <TooltipContent position={position}>
              <p className="capitalize">Tooltip on {position}</p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

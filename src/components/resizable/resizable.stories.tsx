import type { Meta, StoryObj } from "@storybook/react";
import {
  defineComponentStories,
  hiddenArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import {
  PersistedResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  subcomponents: { ResizablePanel, ResizableHandle, PersistedResizablePanelGroup },
  ...defineComponentStories(
    "Horizontal or vertical resizable panel layouts with optional persisted layout storage.",
    {
      orientation: sharedArgTypes.horizontalVertical(),
      autoSaveId: textArg({
        description:
          "Unique id used by PersistedResizablePanelGroup to store layout in localStorage.",
      }),
      panelIds: hiddenArg("Panel ids for conditional layouts — must match mounted panels."),
      defaultLayout: hiddenArg("Initial panel size percentages."),
      onLayoutChanged: hiddenArg("Called when panel sizes change."),
    },
  ),
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { orientation: "horizontal" },
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      className="min-h-[200px] max-w-md rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
});

export const PersistedLayout: Story = {
  ...storyDoc("Persisted Layout example."),
  render: () => (
    <PersistedResizablePanelGroup
      autoSaveId="storybook-resizable-demo"
      panelIds={["left", "right"]}
      orientation="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border border-border"
    >
      <ResizablePanel id="left" defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Left</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="right" defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Right</span>
        </div>
      </ResizablePanel>
    </PersistedResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  ...storyDoc("Vertical layout orientation."),
  render: () => (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[240px] max-w-md rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-4">Top</div>
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Resize panels" />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-4">Bottom</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

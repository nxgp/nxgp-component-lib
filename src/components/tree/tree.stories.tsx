import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { defineComponentStories, hiddenArg, textArg } from "../../../.storybook/utils/arg-types";
import { playgroundStory } from "../../../.storybook/utils/playground";
import { Tree, TreeItem } from "./tree";

type TreeStoryArgs = Pick<ComponentProps<typeof Tree>, "selectedId">;

const meta = {
  title: "Components/Tree",
  component: Tree,
  tags: ["autodocs"],
  subcomponents: { TreeItem },
  ...defineComponentStories(
    "Accessible hierarchical tree for file explorers, org charts, and nested navigation.",
    {
      selectedId: textArg({ description: "Controlled selected item id.", defaultValue: "index" }),
      onSelect: hiddenArg("Called when an item is selected."),
      defaultExpandedIds: hiddenArg("Initially expanded branch ids for uncontrolled usage."),
    },
  ),
} satisfies Meta<TreeStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  render: function PlaygroundStory(args: TreeStoryArgs) {
    const [selectedId, setSelectedId] = useState(args.selectedId ?? "index");
    return (
      <Tree
        {...args}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        defaultExpandedIds={["src"]}
        className="w-64"
      >
        <TreeItem itemId="src" label="src">
          <TreeItem itemId="components" label="components">
            <TreeItem itemId="button" label="button.tsx" />
          </TreeItem>
          <TreeItem itemId="index" label="index.ts" />
        </TreeItem>
      </Tree>
    );
  },
});

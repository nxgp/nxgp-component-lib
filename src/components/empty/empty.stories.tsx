import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Button } from "../button/button";
import { Inbox } from "../icons/curated";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

type EmptyStoryArgs = {
  title?: string;
  description?: string;
  mediaVariant?: ComponentProps<typeof EmptyMedia>["variant"];
  showAction?: boolean;
};

const meta = {
  title: "Components/Empty",
  component: Empty,
  tags: ["autodocs"],
  subcomponents: {
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
  },
  ...defineComponentStories(
    "Centered empty-state container for lists, tables, and panels with optional icon and actions.",
    {
      title: textArg({
        description: "Primary heading for the empty state.",
        defaultValue: "No results",
      }),
      description: textArg({
        description: "Supporting copy below the title.",
        defaultValue: "Try adjusting your filters or search terms.",
      }),
      mediaVariant: choiceArg(["default", "icon"] as const, {
        description: "Visual treatment for optional media above the title.",
        defaultValue: "icon",
      }),
      showAction: booleanArg({
        description: "When true, renders a sample action button in the content area.",
        defaultValue: true,
      }),
    },
  ),
} satisfies Meta<EmptyStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = playgroundStory({
  args: {
    title: "No results",
    description: "Try adjusting your filters or search terms.",
    mediaVariant: "icon",
    showAction: true,
  },
  render: ({ title, description, mediaVariant, showAction }: EmptyStoryArgs) => (
    <Empty>
      <EmptyHeader>
        {mediaVariant === "icon" ? (
          <EmptyMedia variant="icon">
            <Inbox aria-hidden />
          </EmptyMedia>
        ) : (
          <EmptyMedia variant="default" />
        )}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {showAction ? (
        <EmptyContent>
          <Button variant="outline" size="sm">
            Clear filters
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  ),
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Simple empty</EmptyTitle>
          <EmptyDescription>Minimal copy only.</EmptyDescription>
        </EmptyHeader>
      </Empty>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox aria-hidden />
          </EmptyMedia>
          <EmptyTitle>With icon</EmptyTitle>
          <EmptyDescription>Icon media variant.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

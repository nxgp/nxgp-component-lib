import type { Meta, StoryObj } from "@storybook/react";
import { defineComponentStories, sharedArgTypes } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { CircleIcon } from "../../lib/icons";
import { Button } from "../button/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group";

const meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  subcomponents: { ButtonGroupText, ButtonGroupSeparator },
  ...defineComponentStories(
    "Groups related buttons with merged borders and shared focus stacking.",
    {
      orientation: sharedArgTypes.horizontalVertical(),
    },
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { orientation: "horizontal" },
  render: (args) => (
    <ButtonGroup {...args} aria-label="Text formatting">
      <Button variant="outline">Bold</Button>
      <Button variant="outline">Italic</Button>
      <Button variant="outline">Underline</Button>
    </ButtonGroup>
  ),
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex flex-col gap-6">
      <ButtonGroup aria-label="Horizontal">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Vertical">
        <Button variant="outline">Top</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Bottom</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="With label">
        <ButtonGroupText>https://</ButtonGroupText>
        <Button variant="outline">Copy</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="With separator">
        <Button variant="outline">Save</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Share</Button>
      </ButtonGroup>
    </div>
  ),
};

export const WithIcons: Story = {
  ...storyDoc("Tab labels with leading icons."),
  render: () => (
    <ButtonGroup aria-label="Notifications">
      <Button variant="outline">
        <CircleIcon data-icon="inline-start" />
        Alerts
      </Button>
      <Button variant="outline">Settings</Button>
    </ButtonGroup>
  ),
};

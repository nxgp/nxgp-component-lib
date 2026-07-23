import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  choiceArg,
  defineComponentStories,
  sharedArgTypes,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { SettingsIcon } from "../../lib/icons";
import { IconButton } from "./icon-button";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Icon-only button with enforced `aria-label`, icon size presets, and loading support.",
    {
      variant: sharedArgTypes.buttonVariant(),
      size: choiceArg(["icon-xs", "icon-sm", "icon", "icon-lg"] as const, {
        description: "Square dimension preset for icon-only buttons.",
        defaultValue: "icon",
      }),
      loading: sharedArgTypes.loading,
      loadingLabel: sharedArgTypes.loadingLabel,
      disabled: sharedArgTypes.disabled,
    },
  ),
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = playgroundStory({
  args: { "aria-label": "Settings" },
  render: (args) => {
    const props = args as ComponentProps<typeof IconButton>;
    return (
      <IconButton {...props} aria-label={props["aria-label"] ?? "Settings"}>
        <SettingsIcon />
      </IconButton>
    );
  },
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  args: { "aria-label": "Settings" },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton aria-label="Default settings">
        <SettingsIcon />
      </IconButton>
      <IconButton variant="secondary" aria-label="Secondary settings">
        <SettingsIcon />
      </IconButton>
      <IconButton variant="destructive" aria-label="Delete">
        <SettingsIcon />
      </IconButton>
      <IconButton variant="outline" aria-label="Outline settings">
        <SettingsIcon />
      </IconButton>
      <IconButton variant="ghost" aria-label="Ghost settings">
        <SettingsIcon />
      </IconButton>
      <IconButton variant="link" aria-label="Link settings">
        <SettingsIcon />
      </IconButton>
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  args: { "aria-label": "Settings" },
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {(
        [
          ["icon-xs", "Extra small"],
          ["icon-sm", "Small"],
          ["icon", "Default"],
          ["icon-lg", "Large"],
        ] as const
      ).map(([size, label]) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton size={size} variant="outline" aria-label={label}>
            <SettingsIcon />
          </IconButton>
          <span className="text-meta text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  ...storyDoc("Loading indicator while async work is in progress."),
  args: { loading: true, loadingLabel: "Saving", "aria-label": "Save" },
  render: () => (
    <IconButton loading loadingLabel="Saving" aria-label="Save">
      <SettingsIcon />
    </IconButton>
  ),
};

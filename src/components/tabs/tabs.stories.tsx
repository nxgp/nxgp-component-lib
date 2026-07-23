import type { Meta, StoryObj } from "@storybook/react";
import { choiceArg, defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { expect, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  ...defineComponentStories(
    "Tabbed panels with controlled or uncontrolled state; list variant and size propagate to triggers.",
    {
      defaultValue: choiceArg(["account", "password", "notifications"] as const, {
        description: "Initial active tab for uncontrolled usage.",
        defaultValue: "account",
      }),
      orientation: choiceArg(["horizontal", "vertical"] as const, {
        description: "Layout axis for the tab list and panels.",
        defaultValue: "horizontal",
      }),
      activationMode: choiceArg(["automatic", "manual"] as const, {
        description: "Whether tabs activate on focus or require Enter/Space.",
        defaultValue: "automatic",
      }),
      variant: choiceArg(["default", "line", "compact"] as const, {
        description: "Visual style preset applied to TabsList and triggers.",
        defaultValue: "compact",
      }),
      size: choiceArg(["sm", "default", "comfortable", "lg"] as const, {
        description: "Height and typography preset for the tab list.",
        defaultValue: "default",
      }),
      value: textArg({ description: "Controlled value of the active tab." }),
    },
    ["onValueChange"],
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

type TabsPlaygroundArgs = {
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  variant?: "default" | "line" | "compact";
  size?: "sm" | "default" | "comfortable" | "lg";
  value?: string;
};

const tabPanels = (
  variant: "default" | "line" | "compact" = "compact",
  size: "sm" | "default" | "comfortable" | "lg" = "default",
) => (
  <>
    <TabsList variant={variant} size={size}>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
      <TabsTrigger value="notifications">Notifications</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Manage your account settings.</TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
    <TabsContent value="notifications">Configure notification preferences.</TabsContent>
  </>
);

export const Default: Story = playgroundStory({
  args: { defaultValue: "account", variant: "compact", size: "default" },
  actions: ["onValueChange"],
  render: ({ variant = "compact", size = "default", ...args }: TabsPlaygroundArgs) => (
    <Tabs {...args} className="w-full max-w-md">
      {tabPanels(variant, size)}
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: /password/i }));
    await expect(canvas.getByRole("tab", { name: /password/i })).toHaveAttribute(
      "data-state",
      "active",
    );
    await expect(canvas.getByText(/change your password/i)).toBeVisible();
  },
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="account" className="w-full max-w-md">
        <TabsList variant="default">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Default pill-style tabs.</TabsContent>
        <TabsContent value="password">Password panel.</TabsContent>
      </Tabs>
      <Tabs defaultValue="account" className="w-full max-w-md">
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Underline-style tabs.</TabsContent>
        <TabsContent value="password">Password panel.</TabsContent>
      </Tabs>
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="a" className="w-full max-w-md">
        <TabsList size="sm">
          <TabsTrigger value="a">Small</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Small tabs.</TabsContent>
        <TabsContent value="b">Tab B content.</TabsContent>
      </Tabs>
      <Tabs defaultValue="a" className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="a">Default</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Default size tabs.</TabsContent>
        <TabsContent value="b">Tab B content.</TabsContent>
      </Tabs>
      <Tabs defaultValue="a" className="w-full max-w-md">
        <TabsList size="lg">
          <TabsTrigger value="a">Large</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Large tabs.</TabsContent>
        <TabsContent value="b">Tab B content.</TabsContent>
      </Tabs>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <Tabs defaultValue="active" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="inactive">Inactive</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">Active tab content.</TabsContent>
      <TabsContent value="inactive">Inactive tab content.</TabsContent>
      <TabsContent value="disabled">Disabled tab content.</TabsContent>
    </Tabs>
  ),
};

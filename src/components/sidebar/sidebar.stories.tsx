import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  hiddenArg,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Home as HomeIcon, Settings as SettingsIcon } from "../icons/curated";
import { TooltipProvider } from "../tooltip/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./index";

type SidebarStoryArgs = ComponentProps<typeof SidebarProvider> & {
  side?: ComponentProps<typeof Sidebar>["side"];
  collapsible?: ComponentProps<typeof Sidebar>["collapsible"];
};

const componentStories = defineComponentStories(
  "Application sidebar layout with collapsible desktop panel, mobile sheet, and keyboard toggle.",
  {
    defaultOpen: booleanArg({
      description: "Initial open state for uncontrolled usage.",
      defaultValue: true,
    }),
    open: booleanArg({ description: "Controlled open state." }),
    storageKey: textArg({
      description: "Persist open state in `localStorage` under this key.",
    }),
    keyboardShortcut: booleanArg({
      description: "Register ⌘/Ctrl+B to toggle the sidebar.",
      defaultValue: true,
    }),
    side: choiceArg(["left", "right"] as const, {
      description: "Which side the sidebar is anchored to.",
      defaultValue: "left",
    }),
    collapsible: choiceArg(["offcanvas", "icon", "none"] as const, {
      description: "Collapse behavior on desktop. Mobile always uses a sheet overlay.",
      defaultValue: "icon",
    }),
    onOpenChange: hiddenArg("Called when open state changes."),
  },
);

const meta = {
  title: "Components/Sidebar",
  component: SidebarProvider,
  tags: ["autodocs"],
  ...componentStories,
  parameters: {
    ...componentStories.parameters,
    layout: "fullscreen",
  },
  subcomponents: {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
  },
} satisfies Meta<SidebarStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = playgroundStory({
  args: { defaultOpen: true, keyboardShortcut: true, side: "left", collapsible: "icon" },
  render: (args: SidebarStoryArgs) => {
    const { side, collapsible, ...providerArgs } = args;
    return (
      <TooltipProvider>
        <SidebarProvider {...providerArgs} storageKey="storybook-sidebar">
          <Sidebar collapsible={collapsible} side={side}>
            <SidebarHeader>
              <span className="text-sm font-semibold">Acme Inc</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard" isActive>
                      <HomeIcon aria-hidden />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <SettingsIcon aria-hidden />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <span className="text-xs text-muted-foreground">v1.0.0 · ⌘B toggles</span>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="flex h-14 items-center gap-2 border-b border-border px-4">
              <SidebarTrigger />
              <span className="text-sm font-medium">Dashboard</span>
            </header>
            <div className="p-4 text-sm text-muted-foreground">Main content area</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    );
  },
});

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-col gap-8">
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarHeader>
            <span className="text-sm font-semibold">Expanded</span>
          </SidebarHeader>
          <SidebarContent>Sidebar open</SidebarContent>
        </Sidebar>
        <SidebarInset className="p-4">Expanded sidebar layout</SidebarInset>
      </SidebarProvider>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="offcanvas">
          <SidebarHeader>
            <span className="text-sm font-semibold">Collapsed</span>
          </SidebarHeader>
          <SidebarContent>Hidden when collapsed</SidebarContent>
        </Sidebar>
        <SidebarInset className="p-4">
          <SidebarTrigger />
          Offcanvas collapsed — content hidden
        </SidebarInset>
      </SidebarProvider>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <span className="text-sm font-semibold">Icon</span>
          </SidebarHeader>
          <SidebarContent>Visible in icon rail</SidebarContent>
        </Sidebar>
        <SidebarInset className="p-4">Icon-collapsed rail (narrow width)</SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

export const RightSide: Story = {
  ...storyDoc("Right Side example."),
  render: () => (
    <SidebarProvider>
      <SidebarInset className="p-4">Content with right sidebar</SidebarInset>
      <Sidebar side="right">
        <SidebarHeader>
          <span className="text-sm font-semibold">Panel</span>
        </SidebarHeader>
        <SidebarContent>Right-side sidebar</SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};

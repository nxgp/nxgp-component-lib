import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Home as HomeIcon } from "../icons/curated";
import { TooltipProvider } from "../tooltip/tooltip";
import { Sidebar, SidebarContent, SidebarProvider } from "./sidebar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar-menu";

function SidebarMenuLayout({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Dashboard">
                    <HomeIcon aria-hidden />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </TooltipProvider>
  );
}

describe("SidebarMenu", () => {
  describe("rendering", () => {
    it("renders menu button with label", () => {
      const { getByText } = renderWithProviders(<SidebarMenuLayout />);
      expect(getByText("Dashboard")).toBeInTheDocument();
      expect(getByText("Main")).toBeInTheDocument();
      expect(getByText("3")).toBeInTheDocument();
    });

    it("forwards ref on SidebarMenuButton", () => {
      const ref = createRef<HTMLButtonElement>();
      renderWithProviders(
        <TooltipProvider>
          <SidebarProvider>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton ref={ref}>Item</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarProvider>
        </TooltipProvider>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("marks active menu buttons", () => {
      const { getByRole } = renderWithProviders(
        <TooltipProvider>
          <SidebarProvider>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Active item</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarProvider>
        </TooltipProvider>,
      );
      expect(getByRole("button", { name: "Active item" })).toHaveAttribute("data-active", "true");
    });

    it("supports asChild on menu button", () => {
      const { getByRole } = renderWithProviders(
        <TooltipProvider>
          <SidebarProvider>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/home">Home link</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarProvider>
        </TooltipProvider>,
      );
      expect(getByRole("link", { name: "Home link" })).toBeInTheDocument();
    });

    it("shows tooltip when sidebar is icon-collapsed", async () => {
      const user = userEvent.setup();
      const { getByRole, findByRole } = renderWithProviders(
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <Sidebar collapsible="icon">
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <HomeIcon aria-hidden />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </TooltipProvider>,
      );

      await user.hover(getByRole("button", { name: "Dashboard" }));
      expect(await findByRole("tooltip")).toHaveTextContent("Dashboard");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<SidebarMenuLayout />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByText } = renderWithProviders(<SidebarMenuLayout />);
      rerender(
        <TooltipProvider>
          <SidebarProvider defaultOpen={false}>
            <Sidebar collapsible="icon">
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">Settings</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </TooltipProvider>,
      );
      expect(getByText("Settings")).toBeInTheDocument();
    });
  });
});

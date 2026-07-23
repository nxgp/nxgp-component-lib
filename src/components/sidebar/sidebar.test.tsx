import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";

const mockUseIsMobile = vi.hoisted(() => vi.fn(() => false));

vi.mock("../../lib/use-is-mobile", () => ({
  useIsMobile: () => mockUseIsMobile(),
}));

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "./sidebar";

function SidebarLayout({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>Nav content</SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger aria-label="Toggle sidebar" />
        Main
      </SidebarInset>
    </SidebarProvider>
  );
}

describe("Sidebar", () => {
  describe("rendering", () => {
    it("renders sidebar layout with header, content, and footer", () => {
      const { getByText, getByRole } = renderWithProviders(<SidebarLayout />);
      expect(getByText("Header")).toBeInTheDocument();
      expect(getByText("Nav content")).toBeInTheDocument();
      expect(getByText("Footer")).toBeInTheDocument();
      expect(getByRole("button", { name: "Toggle sidebar" })).toBeInTheDocument();
    });

    it("merges custom className on parts", () => {
      const { container, getByRole } = renderWithProviders(
        <SidebarProvider>
          <Sidebar className="custom-sidebar">
            <SidebarHeader className="custom-header">Header</SidebarHeader>
            <SidebarContent className="custom-content">Body</SidebarContent>
            <SidebarFooter className="custom-footer">Footer</SidebarFooter>
          </Sidebar>
          <SidebarInset className="custom-inset">Main</SidebarInset>
        </SidebarProvider>,
      );
      expect(container.querySelector('[data-slot="sidebar-header"]')).toHaveClass("custom-header");
      expect(container.querySelector('[data-slot="sidebar-content"]')).toHaveClass(
        "custom-content",
      );
      expect(container.querySelector('[data-slot="sidebar-footer"]')).toHaveClass("custom-footer");
      expect(getByRole("main")).toHaveClass("custom-inset");
    });

    it("hides sidebar content when collapsed in offcanvas mode", () => {
      const { queryByText } = renderWithProviders(<SidebarLayout defaultOpen={false} />);
      expect(queryByText("Nav content")).not.toBeInTheDocument();
    });

    it("keeps sidebar content in icon collapsible mode when collapsed", () => {
      const { getByText } = renderWithProviders(
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="icon">
            <SidebarContent>Icon rail</SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      );
      expect(getByText("Icon rail")).toBeInTheDocument();
    });

    it("renders fixed sidebar when collapsible is none", () => {
      const { getByText } = renderWithProviders(
        <SidebarProvider defaultOpen={false}>
          <Sidebar collapsible="none">
            <SidebarContent>Always visible</SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      );
      expect(getByText("Always visible")).toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on sidebar parts", () => {
      const sidebarRef = createRef<HTMLElement>();
      const headerRef = createRef<HTMLDivElement>();
      const contentRef = createRef<HTMLDivElement>();
      const footerRef = createRef<HTMLDivElement>();
      const insetRef = createRef<HTMLElement>();
      const triggerRef = createRef<HTMLButtonElement>();

      renderWithProviders(
        <SidebarProvider>
          <Sidebar ref={sidebarRef}>
            <SidebarHeader ref={headerRef}>Header</SidebarHeader>
            <SidebarContent ref={contentRef}>Body</SidebarContent>
            <SidebarFooter ref={footerRef}>Footer</SidebarFooter>
          </Sidebar>
          <SidebarInset ref={insetRef}>Main</SidebarInset>
          <SidebarTrigger ref={triggerRef} aria-label="Toggle" />
        </SidebarProvider>,
      );

      expect(sidebarRef.current).toBeInstanceOf(HTMLElement);
      expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
      expect(footerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(insetRef.current).toBeInstanceOf(HTMLElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("calls onOpenChange when toggled", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <SidebarProvider onOpenChange={onOpenChange}>
          <Sidebar>
            <SidebarContent>Body</SidebarContent>
          </Sidebar>
          <SidebarTrigger aria-label="Toggle sidebar" />
        </SidebarProvider>,
      );
      await user.click(getByRole("button", { name: "Toggle sidebar" }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("throws when useSidebar is used outside provider", () => {
      function BadConsumer() {
        useSidebar();
        return null;
      }
      expect(() => renderWithProviders(<BadConsumer />)).toThrow(
        "useSidebar must be used within a SidebarProvider.",
      );
    });
  });

  describe("interactions", () => {
    it("toggles sidebar open state on trigger click", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText, getByText } = renderWithProviders(<SidebarLayout />);
      expect(getByText("Nav content")).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Toggle sidebar" }));
      expect(queryByText("Nav content")).not.toBeInTheDocument();
      await user.click(getByRole("button", { name: "Toggle sidebar" }));
      expect(getByText("Nav content")).toBeInTheDocument();
    });

    it("opens mobile sheet without changing desktop open state", async () => {
      mockUseIsMobile.mockReturnValue(true);
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { getByRole, findByText } = renderWithProviders(
        <SidebarProvider onOpenChange={onOpenChange}>
          <Sidebar>
            <SidebarContent>Mobile nav</SidebarContent>
          </Sidebar>
          <SidebarTrigger aria-label="Toggle sidebar" />
        </SidebarProvider>,
      );
      await user.click(getByRole("button", { name: "Toggle sidebar" }));
      expect(await findByText("Mobile nav")).toBeInTheDocument();
      expect(onOpenChange).not.toHaveBeenCalled();
      mockUseIsMobile.mockReturnValue(false);
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<SidebarLayout />);
      await expectNoA11yViolations(container);
    });

    it("exposes toggle button with accessible name", () => {
      const { getByRole } = renderWithProviders(<SidebarLayout />);
      expect(getByRole("button", { name: "Toggle sidebar" })).toBeInTheDocument();
    });
  });

  describe("reliability", () => {
    it("supports controlled open state", async () => {
      const user = userEvent.setup();
      function Demo() {
        const [open, setOpen] = useState(true);
        return (
          <SidebarProvider open={open} onOpenChange={setOpen}>
            <Sidebar>
              <SidebarContent>{open ? "Open" : "Closed"}</SidebarContent>
            </Sidebar>
            <SidebarTrigger aria-label="Toggle sidebar" />
          </SidebarProvider>
        );
      }
      const { getByRole, getByText, queryByText } = renderWithProviders(<Demo />);
      expect(getByText("Open")).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Toggle sidebar" }));
      expect(queryByText("Open")).not.toBeInTheDocument();
    });

    it("re-renders layout without throwing", () => {
      const { rerender, getByText } = renderWithProviders(<SidebarLayout />);
      rerender(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>Updated</SidebarContent>
          </Sidebar>
          <SidebarInset>Main</SidebarInset>
        </SidebarProvider>,
      );
      expect(getByText("Updated")).toBeInTheDocument();
    });

    it("persists open state to localStorage", async () => {
      const user = userEvent.setup();
      window.localStorage.clear();
      const { getByRole } = renderWithProviders(
        <SidebarProvider storageKey="test-sidebar">
          <Sidebar>
            <SidebarContent>Body</SidebarContent>
          </Sidebar>
          <SidebarTrigger aria-label="Toggle sidebar" />
        </SidebarProvider>,
      );
      await user.click(getByRole("button", { name: "Toggle sidebar" }));
      expect(window.localStorage.getItem("test-sidebar")).toBe("false");
      window.localStorage.clear();
    });

    it("restores open state from localStorage", () => {
      window.localStorage.setItem("test-sidebar-restore", "false");
      const { queryByText } = renderWithProviders(
        <SidebarProvider storageKey="test-sidebar-restore">
          <Sidebar>
            <SidebarContent>Stored</SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      );
      expect(queryByText("Stored")).not.toBeInTheDocument();
      window.localStorage.removeItem("test-sidebar-restore");
    });

    it("restores expanded state when localStorage is true", () => {
      window.localStorage.setItem("test-sidebar-true", "true");
      const { getByText } = renderWithProviders(
        <SidebarProvider defaultOpen={false} storageKey="test-sidebar-true">
          <Sidebar>
            <SidebarContent>Expanded from storage</SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      );
      expect(getByText("Expanded from storage")).toBeInTheDocument();
      window.localStorage.removeItem("test-sidebar-true");
    });

    it("toggles via keyboard shortcut", async () => {
      const user = userEvent.setup();
      const { getByText, queryByText } = renderWithProviders(
        <SidebarProvider keyboardShortcut>
          <Sidebar>
            <SidebarContent>Shortcut body</SidebarContent>
          </Sidebar>
        </SidebarProvider>,
      );
      expect(getByText("Shortcut body")).toBeInTheDocument();
      await user.keyboard("{Meta>}b{/Meta}");
      expect(queryByText("Shortcut body")).not.toBeInTheDocument();
    });
  });
});

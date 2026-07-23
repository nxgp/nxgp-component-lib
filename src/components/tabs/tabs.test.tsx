import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs", () => {
  describe("rendering", () => {
    it("renders tab triggers and default panel", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Panel one</TabsContent>
          <TabsContent value="two">Panel two</TabsContent>
        </Tabs>,
      );
      expect(getByRole("tab", { name: "One" })).toHaveAttribute("data-state", "active");
      expect(getByText("Panel one")).toBeVisible();
    });

    it("merges custom className on list, trigger, and content", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList className="custom-list">
            <TabsTrigger value="one" className="custom-trigger">
              One
            </TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="custom-content">
            Body
          </TabsContent>
        </Tabs>,
      );
      expect(getByRole("tab", { name: "One" })).toHaveClass("custom-trigger");
      expect(getByText("Body")).toHaveClass("custom-content");
    });

    it("renders line variant triggers", () => {
      const { getByRole } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList variant="line">
            <TabsTrigger value="one">One</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Body</TabsContent>
        </Tabs>,
      );
      expect(getByRole("tab", { name: "One" })).toHaveClass("border-transparent");
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on list, trigger, and content", () => {
      const listRef = createRef<HTMLDivElement>();
      const triggerRef = createRef<HTMLButtonElement>();
      const contentRef = createRef<HTMLDivElement>();

      renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList ref={listRef}>
            <TabsTrigger ref={triggerRef} value="one">
              One
            </TabsTrigger>
          </TabsList>
          <TabsContent ref={contentRef} value="one">
            Body
          </TabsContent>
        </Tabs>,
      );

      expect(listRef.current).toBeInstanceOf(HTMLDivElement);
      expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it("does not activate disabled triggers", () => {
      const { getByRole } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two" disabled>
              Two
            </TabsTrigger>
          </TabsList>
          <TabsContent value="one">One</TabsContent>
          <TabsContent value="two">Two</TabsContent>
        </Tabs>,
      );
      expect(getByRole("tab", { name: "Two" })).toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("switches panels on trigger click", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Panel one</TabsContent>
          <TabsContent value="two">Panel two</TabsContent>
        </Tabs>,
      );
      await user.click(getByRole("tab", { name: "Two" }));
      expect(getByRole("tab", { name: "Two" })).toHaveAttribute("data-state", "active");
      expect(getByText("Panel two")).toBeVisible();
    });

    it("calls onValueChange when selection changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Tabs defaultValue="one" onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">One</TabsContent>
          <TabsContent value="two">Two</TabsContent>
        </Tabs>,
      );
      await user.click(getByRole("tab", { name: "Two" }));
      expect(onValueChange).toHaveBeenCalledWith("two");
    });

    it("navigates tabs with arrow keys", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">One</TabsContent>
          <TabsContent value="two">Two</TabsContent>
        </Tabs>,
      );
      getByRole("tab", { name: "One" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(getByRole("tab", { name: "Two" })).toHaveFocus();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">Account</TabsTrigger>
            <TabsTrigger value="two">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Account settings</TabsContent>
          <TabsContent value="two">App settings</TabsContent>
        </Tabs>,
      );
      await expectNoA11yViolations(container);
    });

    it("exposes tablist and tab roles", () => {
      const { getByRole } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Body</TabsContent>
        </Tabs>,
      );
      expect(getByRole("tablist")).toBeInTheDocument();
      expect(getByRole("tab", { name: "One" })).toBeInTheDocument();
    });
  });

  describe("reliability", () => {
    it("supports controlled value changes", async () => {
      const user = userEvent.setup();
      function Demo() {
        const [value, setValue] = useState("one");
        return (
          <Tabs value={value} onValueChange={setValue}>
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent value="one">One</TabsContent>
            <TabsContent value="two">Two</TabsContent>
          </Tabs>
        );
      }
      const { getByRole } = renderWithProviders(<Demo />);
      await user.click(getByRole("tab", { name: "Two" }));
      expect(getByRole("tab", { name: "Two" })).toHaveAttribute("data-state", "active");
    });

    it("re-renders tabs without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
          </TabsList>
          <TabsContent value="one">One</TabsContent>
        </Tabs>,
      );
      rerender(
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">One</TabsContent>
          <TabsContent value="two">Two</TabsContent>
        </Tabs>,
      );
      expect(getByRole("tab", { name: "Two" })).toBeInTheDocument();
    });
  });
});

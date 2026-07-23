import { fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

function ContextMenuFixture() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>Right click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel inset>Actions</ContextMenuLabel>
        <ContextMenuItem inset>Copy</ContextMenuItem>
        <ContextMenuItem disabled>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
        <ContextMenuRadioGroup value="list">
          <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
          <ContextMenuRadioItem value="grid">Grid</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              Email
              <ContextMenuShortcut>⌘E</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function openContextMenu(getByText: (text: string) => HTMLElement) {
  fireEvent.contextMenu(getByText("Right click here"));
}

describe("ContextMenu", () => {
  describe("rendering", () => {
    it("renders menu content in portal after context menu", () => {
      const { getByRole, getByText } = renderWithProviders(<ContextMenuFixture />);
      openContextMenu(getByText);
      expect(getByRole("menu")).toBeInTheDocument();
      expect(getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
    });

    it("merges custom className on items", () => {
      const { getByRole, getByText } = renderWithProviders(
        <ContextMenu>
          <ContextMenuTrigger>
            <div>Target</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem className="custom-item">Item</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      );
      fireEvent.contextMenu(getByText("Target"));
      expect(getByRole("menuitem", { name: "Item" })).toHaveClass("custom-item");
    });

    it("renders destructive and small items", () => {
      const { getByRole, getByText } = renderWithProviders(
        <ContextMenu>
          <ContextMenuTrigger>
            <div>Target</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem size="sm">Small</ContextMenuItem>
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      );
      fireEvent.contextMenu(getByText("Target"));
      expect(getByRole("menuitem", { name: "Small" })).toHaveClass("text-xs");
      expect(getByRole("menuitem", { name: "Delete" })).toHaveClass("text-destructive");
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on menu parts", () => {
      const contentRef = createRef<HTMLDivElement>();
      const itemRef = createRef<HTMLDivElement>();
      const labelRef = createRef<HTMLDivElement>();
      const separatorRef = createRef<HTMLDivElement>();
      const subTriggerRef = createRef<HTMLDivElement>();
      const subContentRef = createRef<HTMLDivElement>();

      const { getByText } = renderWithProviders(
        <ContextMenu>
          <ContextMenuTrigger>
            <div>Target</div>
          </ContextMenuTrigger>
          <ContextMenuContent ref={contentRef}>
            <ContextMenuLabel ref={labelRef}>Label</ContextMenuLabel>
            <ContextMenuItem ref={itemRef}>Item</ContextMenuItem>
            <ContextMenuSeparator ref={separatorRef} />
            <ContextMenuSub>
              <ContextMenuSubTrigger ref={subTriggerRef}>Sub</ContextMenuSubTrigger>
              <ContextMenuSubContent ref={subContentRef}>
                <ContextMenuItem>Nested</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>,
      );
      fireEvent.contextMenu(getByText("Target"));

      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
      expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
      expect(labelRef.current).toBeInstanceOf(HTMLDivElement);
      expect(separatorRef.current).toBeInstanceOf(HTMLDivElement);
      expect(subTriggerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(subContentRef.current).toBeNull();
    });
  });

  describe("interactions", () => {
    it("opens menu on context menu event", () => {
      const { getByText, getByRole } = renderWithProviders(
        <ContextMenu>
          <ContextMenuTrigger>
            <div>Target area</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Action</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      );
      fireEvent.contextMenu(getByText("Target area"));
      expect(getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { getByRole, getByText } = renderWithProviders(<ContextMenuFixture />);
      openContextMenu(getByText);
      await expectNoA11yViolations(getByRole("menu"));
    });
  });

  describe("reliability", () => {
    it("re-renders menu items without throwing", () => {
      const { rerender, getByRole, getByText } = renderWithProviders(
        <ContextMenu>
          <ContextMenuTrigger>
            <div>Target</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>First</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      );
      rerender(
        <ContextMenu>
          <ContextMenuTrigger>
            <div>Target</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Second</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      );
      fireEvent.contextMenu(getByText("Target"));
      expect(getByRole("menuitem", { name: "Second" })).toBeInTheDocument();
    });
  });
});

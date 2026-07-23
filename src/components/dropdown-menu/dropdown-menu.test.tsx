import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function OpenDropdownMenu() {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button>Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel inset>Actions</DropdownMenuLabel>
        <DropdownMenuItem inset>Profile</DropdownMenuItem>
        <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Show status</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked leadingSlot={<span data-testid="leading-slot">::</span>}>
          With leading slot
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="comfortable">
          <DropdownMenuRadioItem value="default">Default</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              Export
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  describe("rendering", () => {
    it("renders open menu content in portal", () => {
      const { getAllByRole } = renderWithProviders(<OpenDropdownMenu />);
      expect(getAllByRole("menu").length).toBeGreaterThan(0);
      expect(getAllByRole("menuitem", { name: "Profile" })[0]).toBeInTheDocument();
    });

    it("merges custom className on items", () => {
      const { getByRole } = renderWithProviders(
        <DropdownMenu defaultOpen>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item">Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByRole("menuitem", { name: "Item" })).toHaveClass("custom-item");
    });

    it("renders destructive and small items", () => {
      const { getByRole } = renderWithProviders(
        <DropdownMenu defaultOpen>
          <DropdownMenuContent>
            <DropdownMenuItem size="sm">Small</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
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

      renderWithProviders(
        <DropdownMenu defaultOpen>
          <DropdownMenuContent ref={contentRef}>
            <DropdownMenuLabel ref={labelRef}>Label</DropdownMenuLabel>
            <DropdownMenuItem ref={itemRef}>Item</DropdownMenuItem>
            <DropdownMenuSeparator ref={separatorRef} />
            <DropdownMenuSub open>
              <DropdownMenuSubTrigger ref={subTriggerRef}>Sub</DropdownMenuSubTrigger>
              <DropdownMenuSubContent ref={subContentRef}>
                <DropdownMenuItem>Nested</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
      expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
      expect(labelRef.current).toBeInstanceOf(HTMLDivElement);
      expect(separatorRef.current).toBeInstanceOf(HTMLDivElement);
      expect(subTriggerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(subContentRef.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("interactions", () => {
    it("renders trigger when closed", () => {
      const { getByRole } = renderWithProviders(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByRole("button", { name: "Menu" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { getByRole } = renderWithProviders(
        <DropdownMenu defaultOpen>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      await expectNoA11yViolations(getByRole("menu"));
    });
  });

  describe("reliability", () => {
    it("re-renders menu items without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <DropdownMenu defaultOpen>
          <DropdownMenuContent>
            <DropdownMenuItem>First</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      rerender(
        <DropdownMenu defaultOpen>
          <DropdownMenuContent>
            <DropdownMenuItem>Second</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(getByRole("menuitem", { name: "Second" })).toBeInTheDocument();
    });
  });
});

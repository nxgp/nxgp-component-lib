import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Tree, TreeItem } from "./tree";

describe("Tree", () => {
  describe("rendering", () => {
    it("renders tree with nested items", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Tree defaultExpandedIds={["src"]}>
          <TreeItem itemId="src" label="src">
            <TreeItem itemId="index" label="index.ts" />
          </TreeItem>
        </Tree>,
      );
      expect(getByRole("tree")).toBeInTheDocument();
      expect(getByText("src")).toBeInTheDocument();
      expect(getByText("index.ts")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("selects an item on click", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { getByRole } = renderWithProviders(
        <Tree onSelect={onSelect}>
          <TreeItem itemId="one" label="One" />
        </Tree>,
      );
      await user.click(getByRole("treeitem", { name: "One" }));
      expect(onSelect).toHaveBeenCalledWith("one");
    });

    it("selects a branch label on click", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { getByRole } = renderWithProviders(
        <Tree defaultExpandedIds={["parent"]} onSelect={onSelect}>
          <TreeItem itemId="parent" label="Parent">
            <TreeItem itemId="child" label="Child" />
          </TreeItem>
        </Tree>,
      );
      await user.click(getByRole("button", { name: "Parent" }));
      expect(onSelect).toHaveBeenCalledWith("parent");
    });

    it("expands and collapses branches", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText } = renderWithProviders(
        <Tree>
          <TreeItem itemId="parent" label="Parent">
            <TreeItem itemId="child" label="Child" />
          </TreeItem>
        </Tree>,
      );
      expect(queryByText("Child")).not.toBeInTheDocument();
      await user.click(getByRole("button", { name: "Expand" }));
      expect(getByRole("treeitem", { name: "Child" })).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Collapse" }));
      expect(queryByText("Child")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Tree>
          <TreeItem itemId="a" label="Alpha" />
        </Tree>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("throws when TreeItem is used outside Tree", () => {
      expect(() => renderWithProviders(<TreeItem itemId="x" label="X" />)).toThrow(
        "TreeItem must be used within Tree",
      );
    });
  });
});

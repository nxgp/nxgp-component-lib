import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

describe("Empty", () => {
  describe("rendering", () => {
    it("renders title and description", () => {
      const { getByText } = renderWithProviders(
        <Empty>
          <EmptyTitle>No data</EmptyTitle>
          <EmptyDescription>Check back later.</EmptyDescription>
        </Empty>,
      );
      expect(getByText("No data")).toBeInTheDocument();
      expect(getByText("Check back later.")).toHaveClass("text-muted-foreground");
    });

    it("renders header and content slots", () => {
      const { getByText } = renderWithProviders(
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Header</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <button type="button">Action</button>
          </EmptyContent>
        </Empty>,
      );
      expect(getByText("Header").closest("[data-slot='empty-header']")).toBeInTheDocument();
      expect(getByText("Action").closest("[data-slot='empty-content']")).toBeInTheDocument();
    });

    it("renders media variant", () => {
      const { getByText } = renderWithProviders(
        <EmptyMedia variant="icon">
          <span>Icon</span>
        </EmptyMedia>,
      );
      expect(getByText("Icon").parentElement).toHaveClass("bg-muted");
    });

    it("merges custom className", () => {
      const { getByText } = renderWithProviders(
        <Empty className="custom-empty">
          <EmptyTitle>Title</EmptyTitle>
        </Empty>,
      );
      expect(getByText("Title").closest("[data-slot='empty']")).toHaveClass("custom-empty");
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref on Empty", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Empty ref={ref}>
          <EmptyTitle>Title</EmptyTitle>
        </Empty>,
      );
      expect(ref.current?.dataset.slot).toBe("empty");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Empty>
          <EmptyTitle>Empty inbox</EmptyTitle>
          <EmptyDescription>Nothing to show.</EmptyDescription>
        </Empty>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders children", () => {
      const { getByText, rerender } = renderWithProviders(
        <Empty>
          <EmptyTitle>First</EmptyTitle>
        </Empty>,
      );
      rerender(
        <Empty>
          <EmptyTitle>Second</EmptyTitle>
        </Empty>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });
  });
});

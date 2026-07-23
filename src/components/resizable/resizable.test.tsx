import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import {
  PersistedResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  usePersistedPanelLayout,
} from "./resizable";

describe("Resizable", () => {
  describe("rendering", () => {
    it("renders panels and separator", () => {
      const { getByText, getByRole } = renderWithProviders(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={50}>Left</ResizablePanel>
          <ResizableHandle aria-label="Resize panels" />
          <ResizablePanel defaultSize={50}>Right</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(getByText("Left")).toBeInTheDocument();
      expect(getByText("Right")).toBeInTheDocument();
      expect(getByRole("separator", { name: "Resize panels" })).toBeInTheDocument();
    });

    it("renders handle grip when withHandle is set", () => {
      const { container } = renderWithProviders(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={50}>A</ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize" />
          <ResizablePanel defaultSize={50}>B</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("renders a horizontal separator for vertical panel groups", () => {
      const { getByRole } = renderWithProviders(
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize={50}>Top</ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize panels" />
          <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
        </ResizablePanelGroup>,
      );
      const handle = getByRole("separator", { name: "Resize panels" });
      expect(handle).toHaveAttribute("aria-orientation", "horizontal");
      expect(handle.className).toContain("aria-[orientation=horizontal]:w-full");
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref on ResizablePanel", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel ref={ref} defaultSize={100}>
            Panel
          </ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges custom className on group", () => {
      const { getByText } = renderWithProviders(
        <ResizablePanelGroup orientation="horizontal" className="custom-group">
          <ResizablePanel defaultSize={100}>Panel</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(getByText("Panel").closest("[data-group]")).toHaveClass("custom-group");
    });

    it("renders persisted panel group with autoSaveId", () => {
      window.localStorage.clear();
      const onLayoutChanged = vi.fn();
      const { getByText } = renderWithProviders(
        <PersistedResizablePanelGroup
          autoSaveId="test-layout"
          panelIds={["left", "right"]}
          defaultLayout={{ left: 40, right: 60 }}
          onLayoutChanged={onLayoutChanged}
          orientation="horizontal"
        >
          <ResizablePanel id="left" defaultSize={50}>
            Left
          </ResizablePanel>
          <ResizableHandle aria-label="Resize" />
          <ResizablePanel id="right" defaultSize={50}>
            Right
          </ResizablePanel>
        </PersistedResizablePanelGroup>,
      );
      expect(getByText("Left")).toBeInTheDocument();
      expect(getByText("Right")).toBeInTheDocument();
      window.localStorage.clear();
    });

    it("exposes persisted layout via hook", () => {
      window.localStorage.clear();
      const { result } = renderHook(() =>
        usePersistedPanelLayout({ autoSaveId: "hook-layout", panelIds: ["a"] }),
      );
      expect(typeof result.current.onLayoutChanged).toBe("function");
      act(() => {
        result.current.onLayoutChanged({ a: 100 });
      });
      window.localStorage.clear();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={50}>Left panel</ResizablePanel>
          <ResizableHandle aria-label="Resize panels" />
          <ResizablePanel defaultSize={50}>Right panel</ResizablePanel>
        </ResizablePanelGroup>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders panel content", () => {
      const { getByText, rerender } = renderWithProviders(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={100}>First</ResizablePanel>
        </ResizablePanelGroup>,
      );
      rerender(
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={100}>Second</ResizablePanel>
        </ResizablePanelGroup>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });
  });
});

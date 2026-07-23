import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

function OpenTooltip() {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  describe("rendering", () => {
    it("defaults to inverted variant", () => {
      renderWithProviders(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipContent data-testid="tooltip-content">Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(document.querySelector("[data-testid='tooltip-content']")).toHaveClass(
        "bg-background",
        "text-foreground",
      );
    });

    it("renders open tooltip content in portal", () => {
      const { getByRole } = renderWithProviders(<OpenTooltip />);
      expect(getByRole("tooltip")).toHaveTextContent("Tooltip text");
    });

    it("renders tooltip arrow", () => {
      renderWithProviders(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Target</Button>
            </TooltipTrigger>
            <TooltipContent>
              Hint
              <TooltipArrow data-testid="tooltip-arrow" />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(document.querySelector("[data-testid='tooltip-arrow']")).toBeInTheDocument();
    });

    it("merges custom className on TooltipContent", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Target</Button>
            </TooltipTrigger>
            <TooltipContent ref={ref} className="custom-tooltip">
              Hint
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(ref.current).toHaveClass("custom-tooltip");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on TooltipContent", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipContent ref={ref}>Hint</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("maps position to side", () => {
      renderWithProviders(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger asChild>
              <Button>Target</Button>
            </TooltipTrigger>
            <TooltipContent position="right">Right hint</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(document.querySelector('[data-side="right"]')).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("renders trigger when closed", () => {
      const { getByRole } = renderWithProviders(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Target</Button>
            </TooltipTrigger>
            <TooltipContent>Hidden</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(getByRole("button", { name: "Target" })).toBeInTheDocument();
    });

    it("shows tooltip on focus", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Focus me</Button>
            </TooltipTrigger>
            <TooltipContent>Focused hint</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      await user.tab();
      expect(getByRole("tooltip", { name: "Focused hint" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { getByRole } = renderWithProviders(<OpenTooltip />);
      await expectNoA11yViolations(getByRole("tooltip"));
    });
  });

  describe("reliability", () => {
    it("re-renders content without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipContent>First</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      rerender(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipContent>Second</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );
      expect(getByRole("tooltip")).toHaveTextContent("Second");
    });
  });
});

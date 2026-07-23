import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import { Popover, PopoverAnchor, PopoverArrow, PopoverContent, PopoverTrigger } from "./popover";

function OpenPopover() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button>Open</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Popover panel">
        <p>Popover body</p>
      </PopoverContent>
    </Popover>
  );
}

function OpenHoverPopover() {
  return (
    <Popover trigger="hover" defaultOpen>
      <PopoverTrigger asChild>
        <Button>@hover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Hover preview</p>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  describe("rendering", () => {
    it("renders open popover content in portal", () => {
      const { getByText } = renderWithProviders(<OpenPopover />);
      expect(getByText("Popover body")).toBeInTheDocument();
    });

    it("renders hover-mode content when trigger is hover", () => {
      const { getByText } = renderWithProviders(<OpenHoverPopover />);
      expect(getByText("Hover preview")).toBeInTheDocument();
    });

    it("renders popover arrow", () => {
      renderWithProviders(
        <Popover defaultOpen>
          <PopoverContent aria-label="Popover panel">
            Body
            <PopoverArrow data-testid="popover-arrow" />
          </PopoverContent>
        </Popover>,
      );
      expect(document.querySelector("[data-testid='popover-arrow']")).toBeInTheDocument();
    });

    it("merges custom className on PopoverContent", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Popover defaultOpen>
          <PopoverContent ref={ref} className="custom-popover">
            Content
          </PopoverContent>
        </Popover>,
      );
      expect(ref.current).toHaveClass("custom-popover");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on PopoverContent", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Popover defaultOpen>
          <PopoverContent ref={ref}>Body</PopoverContent>
        </Popover>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("supports PopoverAnchor in click mode", () => {
      const { getByText } = renderWithProviders(
        <Popover defaultOpen>
          <PopoverAnchor>
            <span>Anchor</span>
          </PopoverAnchor>
          <PopoverContent>Content</PopoverContent>
        </Popover>,
      );
      expect(getByText("Anchor")).toBeInTheDocument();
      expect(getByText("Content")).toBeInTheDocument();
    });

    it("throws when PopoverAnchor is used in hover mode", () => {
      expect(() =>
        renderWithProviders(
          <Popover trigger="hover" defaultOpen>
            <PopoverAnchor>
              <span>Anchor</span>
            </PopoverAnchor>
            <PopoverContent>Content</PopoverContent>
          </Popover>,
        ),
      ).toThrow('PopoverAnchor is only supported when Popover trigger="click".');
    });
  });

  describe("interactions", () => {
    it("renders trigger when closed", () => {
      const { getByRole } = renderWithProviders(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Toggle</Button>
          </PopoverTrigger>
          <PopoverContent>Hidden</PopoverContent>
        </Popover>,
      );
      expect(getByRole("button", { name: "Toggle" })).toBeInTheDocument();
    });

    it("opens hover popover on pointer enter", async () => {
      const user = userEvent.setup();
      const { getByRole, findByText } = renderWithProviders(
        <Popover trigger="hover" openDelay={0}>
          <PopoverTrigger asChild>
            <Button>Hover me</Button>
          </PopoverTrigger>
          <PopoverContent>Card body</PopoverContent>
        </Popover>,
      );
      await user.hover(getByRole("button", { name: "Hover me" }));
      expect(await findByText("Card body")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations for click popover", async () => {
      const { getByRole } = renderWithProviders(<OpenPopover />);
      await expectNoA11yViolations(getByRole("dialog", { name: "Popover panel" }));
    });

    it("has no axe violations for hover popover", async () => {
      const { getByText } = renderWithProviders(<OpenHoverPopover />);
      await expectNoA11yViolations(getByText("Hover preview"));
    });
  });

  describe("reliability", () => {
    it("re-renders content without throwing", () => {
      const { rerender, getByText } = renderWithProviders(
        <Popover defaultOpen>
          <PopoverContent>First</PopoverContent>
        </Popover>,
      );
      rerender(
        <Popover defaultOpen>
          <PopoverContent>Second</PopoverContent>
        </Popover>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });

    it("switches between click and hover modes", () => {
      const { rerender, getByText } = renderWithProviders(
        <Popover defaultOpen>
          <PopoverContent>Click mode</PopoverContent>
        </Popover>,
      );
      rerender(
        <Popover trigger="hover" defaultOpen>
          <PopoverContent>Hover mode</PopoverContent>
        </Popover>,
      );
      expect(getByText("Hover mode")).toBeInTheDocument();
    });
  });
});

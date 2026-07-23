import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Button } from "../button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

describe("Collapsible", () => {
  describe("rendering", () => {
    it("renders trigger and content", () => {
      const { getByRole } = renderWithProviders(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>,
      );
      expect(getByRole("button", { name: "Toggle" })).toBeInTheDocument();
    });

    it("merges custom className on content", () => {
      const { getByText } = renderWithProviders(
        <Collapsible open>
          <CollapsibleTrigger asChild>
            <Button>Open</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="custom-panel">Panel</CollapsibleContent>
        </Collapsible>,
      );
      expect(getByText("Panel")).toHaveClass("custom-panel");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on CollapsibleContent", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Collapsible open>
          <CollapsibleContent ref={ref}>Body</CollapsibleContent>
        </Collapsible>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("shows content when open", () => {
      const { getByText } = renderWithProviders(
        <Collapsible open>
          <CollapsibleContent>Visible</CollapsibleContent>
        </Collapsible>,
      );
      expect(getByText("Visible")).toBeVisible();
    });
  });

  describe("interactions", () => {
    it("toggles content on trigger click", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText } = renderWithProviders(
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Hidden</CollapsibleContent>
        </Collapsible>,
      );
      expect(queryByText("Hidden")).not.toBeInTheDocument();
      await user.click(getByRole("button", { name: "Toggle" }));
      expect(queryByText("Hidden")).toBeVisible();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Collapsible open>
          <CollapsibleTrigger asChild>
            <Button>Toggle</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Expanded content</CollapsibleContent>
        </Collapsible>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders open state without throwing", () => {
      const { rerender, getByText, queryByText } = renderWithProviders(
        <Collapsible open={false}>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>,
      );
      expect(queryByText("Panel")).not.toBeInTheDocument();
      rerender(
        <Collapsible open>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>,
      );
      expect(getByText("Panel")).toBeVisible();
    });
  });
});

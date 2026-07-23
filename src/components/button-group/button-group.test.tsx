import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Button } from "../button/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./button-group";

describe("ButtonGroup", () => {
  describe("rendering", () => {
    it("renders grouped buttons with group role", () => {
      const { getByRole } = renderWithProviders(
        <ButtonGroup aria-label="Actions">
          <Button variant="outline">One</Button>
          <Button variant="outline">Two</Button>
        </ButtonGroup>,
      );
      expect(getByRole("group", { name: "Actions" })).toBeInTheDocument();
    });

    it("renders text and separator segments", () => {
      const { getByText } = renderWithProviders(
        <ButtonGroup aria-label="Copy">
          <ButtonGroupText>Label</ButtonGroupText>
          <ButtonGroupSeparator />
          <Button variant="outline">Copy</Button>
        </ButtonGroup>,
      );
      expect(getByText("Label")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <ButtonGroup aria-label="Custom" className="custom-group">
          <Button>Go</Button>
        </ButtonGroup>,
      );
      expect(getByRole("group")).toHaveClass("custom-group");
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on ButtonGroup", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <ButtonGroup ref={ref} aria-label="Ref">
          <Button>Go</Button>
        </ButtonGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders vertical orientation", () => {
      const { getByRole } = renderWithProviders(
        <ButtonGroup orientation="vertical" aria-label="Vertical">
          <Button variant="outline">A</Button>
          <Button variant="outline">B</Button>
        </ButtonGroup>,
      );
      expect(getByRole("group")).toHaveClass("flex-col");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <ButtonGroup aria-label="Format">
          <Button variant="outline">Bold</Button>
          <Button variant="outline">Italic</Button>
        </ButtonGroup>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByText } = renderWithProviders(
        <ButtonGroup aria-label="Actions">
          <Button>First</Button>
        </ButtonGroup>,
      );
      rerender(
        <ButtonGroup aria-label="Actions">
          <Button>Second</Button>
        </ButtonGroup>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });
  });
});

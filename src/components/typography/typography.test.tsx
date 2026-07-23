import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Blockquote, H1, H2, H3, H4, Lead, Muted, Small, Typography } from "./typography";

describe("Typography", () => {
  describe("rendering", () => {
    it("renders heading variant as h1", () => {
      const { getByRole } = renderWithProviders(<H1>Title</H1>);
      expect(getByRole("heading", { level: 1 })).toHaveTextContent("Title");
    });

    it("renders all heading and text variants", () => {
      const { getByRole, getByText } = renderWithProviders(
        <div>
          <H2>H2</H2>
          <H3>H3</H3>
          <H4>H4</H4>
          <Lead>Lead</Lead>
          <Small>Small</Small>
          <Blockquote>Quote</Blockquote>
        </div>,
      );
      expect(getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(getByRole("heading", { level: 4 })).toBeInTheDocument();
      expect(getByText("Lead")).toHaveClass("text-muted-foreground");
      expect(getByText("Small")).toBeInTheDocument();
      expect(getByText("Quote").tagName.toLowerCase()).toBe("blockquote");
    });

    it("renders muted variant", () => {
      const { getByText } = renderWithProviders(<Muted>Hint</Muted>);
      expect(getByText("Hint")).toHaveClass("text-muted-foreground");
    });

    it("merges custom className", () => {
      const { getByText } = renderWithProviders(
        <Typography variant="p" className="custom-text">
          Body
        </Typography>,
      );
      expect(getByText("Body")).toHaveClass("custom-text");
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref on Typography", () => {
      const ref = createRef<HTMLParagraphElement>();
      renderWithProviders(
        <Typography ref={ref} variant="p">
          Text
        </Typography>,
      );
      expect(ref.current?.tagName.toLowerCase()).toBe("p");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <div>
          <H1>Accessible title</H1>
          <Muted>Description</Muted>
        </div>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders with a new variant", () => {
      const { getByText, rerender } = renderWithProviders(
        <Typography variant="p">Text</Typography>,
      );
      rerender(<Typography variant="muted">Text</Typography>);
      expect(getByText("Text")).toHaveClass("text-muted-foreground");
    });
  });
});

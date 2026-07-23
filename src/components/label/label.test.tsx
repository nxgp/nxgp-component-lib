import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Input } from "../input";
import { Label } from "./label";

describe("Label", () => {
  describe("rendering", () => {
    it("renders label text", () => {
      const { getByText } = renderWithProviders(<Label>Email</Label>);
      expect(getByText("Email")).toBeInTheDocument();
    });

    it("associates with input via htmlFor", () => {
      const { getByLabelText } = renderWithProviders(
        <>
          <Label htmlFor="email">Email</Label>
          <Input id="email" />
        </>,
      );
      expect(getByLabelText("Email")).toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("renders required indicator and hint", () => {
      const { getByText } = renderWithProviders(
        <Label required hint="optional">
          Name
        </Label>,
      );
      expect(getByText("*")).toBeInTheDocument();
      expect(getByText("(optional)")).toBeInTheDocument();
    });

    it("forwards ref to label element", () => {
      const ref = createRef<HTMLLabelElement>();
      renderWithProviders(<Label ref={ref}>Email</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it("merges custom className", () => {
      const { getByText } = renderWithProviders(<Label className="custom-label">Email</Label>);
      expect(getByText("Email")).toHaveClass("custom-label", "text-sm");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <>
          <Label htmlFor="n">Name</Label>
          <Input id="n" />
        </>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders", () => {
      const { rerender, getByText } = renderWithProviders(<Label>A</Label>);
      rerender(<Label>B</Label>);
      expect(getByText("B")).toBeInTheDocument();
    });
  });
});

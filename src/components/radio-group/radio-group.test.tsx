import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  describe("rendering", () => {
    it("renders radio items", () => {
      const { getAllByRole } = renderWithProviders(
        <RadioGroup defaultValue="a">
          <RadioGroupItem value="a" aria-label="A" />
          <RadioGroupItem value="b" aria-label="B" />
        </RadioGroup>,
      );
      expect(getAllByRole("radio")).toHaveLength(2);
    });

    it("renders horizontal orientation", () => {
      const { container } = renderWithProviders(
        <RadioGroup orientation="horizontal" defaultValue="a">
          <RadioGroupItem value="a" aria-label="A" />
        </RadioGroup>,
      );
      expect(container.firstChild).toHaveClass("flex");
    });

    it.each(["sm", "lg"] as const)("renders %s size on items via group", (size) => {
      const { getByRole } = renderWithProviders(
        <RadioGroup size={size} defaultValue="a">
          <RadioGroupItem value="a" aria-label="A" />
        </RadioGroup>,
      );
      expect(getByRole("radio", { name: "A" })).toBeInTheDocument();
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on root", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <RadioGroup ref={ref} defaultValue="a">
          <RadioGroupItem value="a" aria-label="A" />
        </RadioGroup>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("disables individual items", () => {
      const { getByRole } = renderWithProviders(
        <RadioGroup>
          <RadioGroupItem value="a" aria-label="A" disabled />
        </RadioGroup>,
      );
      expect(getByRole("radio", { name: "A" })).toBeDisabled();
    });

    it("merges custom className on root", () => {
      const { container } = renderWithProviders(
        <RadioGroup className="custom-group">
          <RadioGroupItem value="a" aria-label="A" />
        </RadioGroup>,
      );
      expect(container.firstChild).toHaveClass("custom-group");
    });
  });

  describe("interactions", () => {
    it("selects item on click", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <RadioGroup onValueChange={onValueChange}>
          <RadioGroupItem value="a" aria-label="A" />
          <RadioGroupItem value="b" aria-label="B" />
        </RadioGroup>,
      );
      await user.click(getByRole("radio", { name: "B" }));
      expect(onValueChange).toHaveBeenCalledWith("b");
    });

    it("moves focus with arrow keys", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <RadioGroup defaultValue="a">
          <RadioGroupItem value="a" aria-label="A" />
          <RadioGroupItem value="b" aria-label="B" />
        </RadioGroup>,
      );
      getByRole("radio", { name: "A" }).focus();
      await user.keyboard("{ArrowDown}");
      expect(getByRole("radio", { name: "B" })).toHaveFocus();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <RadioGroup defaultValue="a">
          <RadioGroupItem value="a" aria-label="A" />
        </RadioGroup>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders value", () => {
      const { rerender, getByRole } = renderWithProviders(
        <RadioGroup value="a">
          <RadioGroupItem value="a" aria-label="A" />
          <RadioGroupItem value="b" aria-label="B" />
        </RadioGroup>,
      );
      rerender(
        <RadioGroup value="b">
          <RadioGroupItem value="a" aria-label="A" />
          <RadioGroupItem value="b" aria-label="B" />
        </RadioGroup>,
      );
      expect(getByRole("radio", { name: "B" })).toHaveAttribute("data-state", "checked");
    });
  });
});

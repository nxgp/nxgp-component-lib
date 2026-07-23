import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

function FruitSelect({
  open,
  defaultValue,
  onValueChange,
  invalid,
  size,
}: {
  open?: boolean;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  invalid?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  return (
    <Select open={open} defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger aria-label="fruit" invalid={invalid} size={size}>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  describe("rendering", () => {
    it("renders trigger", () => {
      const { getByRole } = renderWithProviders(<FruitSelect />);
      expect(getByRole("combobox", { name: "fruit" })).toBeInTheDocument();
    });

    it("renders options when open", () => {
      const { getByRole } = renderWithProviders(<FruitSelect open />);
      expect(getByRole("option", { name: "Apple" })).toBeInTheDocument();
      expect(getByRole("option", { name: "Carrot" })).toBeInTheDocument();
    });

    it.each(["sm", "lg"] as const)("applies %s size on trigger", (size) => {
      const { getByRole } = renderWithProviders(<FruitSelect size={size} />);
      const trigger = getByRole("combobox", { name: "fruit" });
      expect(trigger).toHaveClass(size === "sm" ? "h-control-sm" : "h-control-lg");
    });

    it("merges custom className on trigger", () => {
      const { getByRole } = renderWithProviders(
        <Select>
          <SelectTrigger className="custom-trigger" aria-label="fruit">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );
      expect(getByRole("combobox")).toHaveClass("custom-trigger");
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on label and separator", () => {
      const labelRef = createRef<HTMLDivElement>();
      const separatorRef = createRef<HTMLDivElement>();

      renderWithProviders(
        <Select open>
          <SelectTrigger aria-label="food">
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel ref={labelRef}>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectGroup>
            <SelectSeparator ref={separatorRef} />
          </SelectContent>
        </Select>,
      );

      expect(labelRef.current).toBeInstanceOf(HTMLDivElement);
      expect(separatorRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it("sets aria-invalid when invalid", () => {
      const { getByRole } = renderWithProviders(<FruitSelect invalid />);
      expect(getByRole("combobox", { name: "fruit" })).toHaveAttribute("aria-invalid", "true");
    });

    it("disables trigger when Select is disabled", () => {
      const { getByRole } = renderWithProviders(
        <Select disabled>
          <SelectTrigger aria-label="f">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );
      expect(getByRole("combobox")).toBeDisabled();
    });
  });

  describe("interactions", () => {
    it("selects item on click", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(<FruitSelect open onValueChange={onValueChange} />);
      await user.click(getByRole("option", { name: "Banana" }));
      expect(onValueChange).toHaveBeenCalledWith("banana");
    });

    it("opens listbox from trigger with arrow key", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(<FruitSelect />);
      getByRole("combobox").focus();
      await user.keyboard("{ArrowDown}");
      expect(getByRole("option", { name: "Apple" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations on closed trigger", async () => {
      const { container } = renderWithProviders(<FruitSelect />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders disabled trigger", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Select>
          <SelectTrigger aria-label="f">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );
      rerender(
        <Select disabled>
          <SelectTrigger aria-label="f">
            <SelectValue />
          </SelectTrigger>
        </Select>,
      );
      expect(getByRole("combobox")).toBeDisabled();
    });
  });
});

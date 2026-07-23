import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

function FruitCommand({ onSelect }: { onSelect?: (value: string) => void }) {
  return (
    <Command label="Fruit command">
      <CommandInput placeholder="Search fruits" aria-label="Search fruits" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Fruits">
          <CommandItem value="apple" onSelect={onSelect}>
            Apple
          </CommandItem>
          <CommandItem value="banana" onSelect={onSelect}>
            Banana
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="More">
          <CommandItem value="orange" disabled>
            Orange
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  describe("rendering", () => {
    it("renders input, groups, and items", () => {
      const { getByPlaceholderText, getByText } = renderWithProviders(<FruitCommand />);
      expect(getByPlaceholderText("Search fruits")).toBeInTheDocument();
      expect(getByText("Apple")).toBeInTheDocument();
      expect(getByText("Fruits")).toBeInTheDocument();
    });

    it("merges custom className on Command root", () => {
      const { container } = renderWithProviders(
        <Command className="custom-command" label="Test">
          <CommandList />
        </Command>,
      );
      expect(container.querySelector("[data-slot=command]")).toHaveClass(
        "custom-command",
        "bg-popover",
      );
    });
  });

  describe("props and edge cases", () => {
    it("forwards ref on CommandInput", () => {
      const ref = createRef<HTMLInputElement>();
      renderWithProviders(
        <Command label="Test">
          <CommandInput ref={ref} />
        </Command>,
      );
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("shows empty state when filter has no matches", async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText, getByText } = renderWithProviders(<FruitCommand />);
      await user.type(getByPlaceholderText("Search fruits"), "zzzz");
      expect(getByText("No results.")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("filters items while typing", async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText, getByText, queryByText } = renderWithProviders(
        <FruitCommand />,
      );
      await user.type(getByPlaceholderText("Search fruits"), "ban");
      expect(getByText("Banana")).toBeInTheDocument();
      expect(queryByText("Apple")).not.toBeInTheDocument();
    });

    it("calls onSelect when item is chosen", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { getByText } = renderWithProviders(<FruitCommand onSelect={onSelect} />);
      await user.click(getByText("Apple"));
      expect(onSelect).toHaveBeenCalledWith("apple");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Command label="Fruit command">
          <CommandInput placeholder="Search fruits" aria-label="Search fruits" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Fruits">
              <CommandItem value="apple">Apple</CommandItem>
              <CommandItem value="banana">Banana</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByText } = renderWithProviders(<FruitCommand />);
      rerender(
        <Command label="Updated">
          <CommandList>
            <CommandItem value="pear">Pear</CommandItem>
          </CommandList>
        </Command>,
      );
      expect(getByText("Pear")).toBeInTheDocument();
    });
  });
});

import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxLoading,
  ComboboxTrigger,
} from "./select-search";

function OpenCombobox({
  value = "apple",
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Combobox open value={value} onValueChange={onValueChange}>
      <ComboboxTrigger aria-label="Select fruit" />
      <ComboboxContent>
        <ComboboxInput placeholder="Search fruits" />
        <ComboboxList>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          <ComboboxItem value="apple">Apple</ComboboxItem>
          <ComboboxItem value="banana">Banana</ComboboxItem>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe("SelectSearch", () => {
  describe("rendering", () => {
    it("renders trigger and open content", () => {
      const { getByRole, getByText } = renderWithProviders(<OpenCombobox />);
      expect(getByRole("combobox", { name: "Select fruit" })).toBeInTheDocument();
      expect(getByText("Apple")).toBeInTheDocument();
      expect(getByText("Banana")).toBeInTheDocument();
    });

    it("merges custom className on ComboboxContent", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Combobox open>
          <ComboboxContent ref={ref} className="custom-combobox">
            <ComboboxList>
              <ComboboxItem value="apple">Apple</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      expect(ref.current).toHaveClass("custom-combobox", "p-0");
    });
  });

  describe("props and edge cases", () => {
    it("shows placeholder when no value is selected", () => {
      const { getByRole } = renderWithProviders(
        <Combobox>
          <ComboboxTrigger aria-label="Fruit" placeholder="Pick fruit" />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxItem value="apple">Apple</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      expect(getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Pick fruit");
    });

    it("forwards ref on ComboboxTrigger", () => {
      const ref = createRef<HTMLButtonElement>();
      renderWithProviders(
        <Combobox>
          <ComboboxTrigger ref={ref} aria-label="Fruit" />
        </Combobox>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("marks trigger invalid when invalid prop is set", () => {
      const { getByRole } = renderWithProviders(
        <Combobox>
          <ComboboxTrigger aria-label="Fruit" invalid />
        </Combobox>,
      );
      expect(getByRole("combobox", { name: "Fruit" })).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("interactions", () => {
    it("selects an item and calls onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByText } = renderWithProviders(<OpenCombobox onValueChange={onValueChange} />);
      await user.click(getByText("Banana"));
      expect(onValueChange).toHaveBeenCalledWith("banana");
    });

    it("filters options via ComboboxInput", async () => {
      const user = userEvent.setup();
      const { getByPlaceholderText, getByText, queryByText } = renderWithProviders(
        <OpenCombobox />,
      );
      await user.type(getByPlaceholderText("Search fruits"), "ban");
      expect(getByText("Banana")).toBeInTheDocument();
      expect(queryByText("Apple")).not.toBeInTheDocument();
    });

    it("supports multi-select toggling", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByText } = renderWithProviders(
        <Combobox multiple open value={["apple"]} onValueChange={onValueChange}>
          <ComboboxTrigger aria-label="Fruits" />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxItem value="apple">Apple</ComboboxItem>
              <ComboboxItem value="banana">Banana</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      await user.click(getByText("Banana"));
      expect(onValueChange).toHaveBeenCalledWith(["apple", "banana"]);
    });

    it("toggles off an selected item in multi mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByText } = renderWithProviders(
        <Combobox multiple open value={["apple", "banana"]} onValueChange={onValueChange}>
          <ComboboxTrigger aria-label="Fruits" />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxItem value="apple">Apple</ComboboxItem>
              <ComboboxItem value="banana">Banana</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      await user.click(getByText("Apple"));
      expect(onValueChange).toHaveBeenCalledWith(["banana"]);
    });

    it("shows overflow count when selections exceed maxBadges", () => {
      const { getByText } = renderWithProviders(
        <Combobox multiple value={["apple", "banana", "orange"]}>
          <ComboboxTrigger aria-label="Fruits" maxBadges={2} />
        </Combobox>,
      );
      expect(getByText("+1")).toBeInTheDocument();
    });

    it("shows overflow count before visible badges when overflowPosition is start", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Combobox multiple value={["apple", "banana", "orange"]}>
          <ComboboxTrigger aria-label="Fruits" maxBadges={2} overflowPosition="start" />
        </Combobox>,
      );
      const trigger = getByRole("combobox", { name: "Fruits" });
      expect(getByText("+1")).toBeInTheDocument();
      expect(trigger.textContent?.indexOf("+1")).toBeLessThan(
        trigger.textContent?.indexOf("apple") ?? 0,
      );
    });

    it("uses getBadgeLabel for badge text", () => {
      const labels: Record<string, string> = {
        apple: "Apple",
        banana: "Banana",
        orange: "Orange",
      };
      const { getByText } = renderWithProviders(
        <Combobox multiple value={["apple", "banana", "orange"]}>
          <ComboboxTrigger
            aria-label="Fruits"
            maxBadges={2}
            getBadgeLabel={(value) => labels[value] ?? value}
          />
        </Combobox>,
      );
      expect(getByText("Apple")).toBeInTheDocument();
      expect(getByText("Banana")).toBeInTheDocument();
      expect(getByText("+1")).toBeInTheDocument();
    });

    it("renders custom multi-select labels", () => {
      const { getByRole } = renderWithProviders(
        <Combobox multiple open value={["apple", "banana"]}>
          <ComboboxTrigger
            aria-label="Fruits"
            getDisplayLabel={(values) => `${values.length} fruits selected`}
          />
        </Combobox>,
      );
      expect(getByRole("combobox", { name: "Fruits" })).toHaveTextContent("2 fruits selected");
    });

    it("shows loading state", () => {
      const { getByText } = renderWithProviders(
        <Combobox open loading>
          <ComboboxContent>
            <ComboboxList>
              <ComboboxLoading />
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      expect(getByText("Loading…")).toBeInTheDocument();
    });

    it("renders custom loading content", () => {
      const { getByText } = renderWithProviders(
        <Combobox open loading>
          <ComboboxContent>
            <ComboboxList>
              <ComboboxLoading>Fetching…</ComboboxLoading>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      expect(getByText("Fetching…")).toBeInTheDocument();
    });

    it("calls onSearchChange from ComboboxInput", async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      renderWithProviders(
        <Combobox open onSearchChange={onSearchChange}>
          <ComboboxContent>
            <ComboboxInput placeholder="Search users" />
            <ComboboxList>
              <ComboboxItem value="ada">Ada</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>,
      );
      await user.type(document.querySelector("[data-slot=combobox-input]") as Element, "a");
      expect(onSearchChange).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations when open", async () => {
      const { container } = renderWithProviders(<OpenCombobox />);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(
        <Combobox open>
          <ComboboxTrigger aria-label="Fruit">Apple</ComboboxTrigger>
        </Combobox>,
      );
      rerender(
        <Combobox open>
          <ComboboxTrigger aria-label="Fruit">Banana</ComboboxTrigger>
        </Combobox>,
      );
      expect(getByRole("combobox", { name: "Fruit" })).toHaveTextContent("Banana");
    });

    it("throws when ComboboxItem is used outside Combobox", () => {
      expect(() => renderWithProviders(<ComboboxItem value="apple">Apple</ComboboxItem>)).toThrow(
        "ComboboxItem must be used within Combobox",
      );
    });
  });
});

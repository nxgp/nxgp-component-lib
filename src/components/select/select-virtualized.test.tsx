import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select";
import { VirtualizedSelectContent, VirtualizedSelectItems } from "./select-virtualized";

const items = Array.from({ length: 100 }, (_, index) => ({
  value: String(index + 1),
  label: `Option ${index + 1}`,
}));

describe("VirtualizedSelectContent", () => {
  describe("rendering", () => {
    it("renders virtualized select content", () => {
      const { getByText } = renderWithProviders(
        <Select open>
          <SelectTrigger aria-label="Options">
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <VirtualizedSelectContent items={items} />
        </Select>,
      );
      expect(getByText("Option 1")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Select open>
          <SelectTrigger aria-label="Options">
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <VirtualizedSelectContent items={items} />
        </Select>,
      );
      await expectNoA11yViolations(container);
    });

    it("renders child content alongside virtualized items", () => {
      const { getByText } = renderWithProviders(
        <Select open>
          <SelectTrigger aria-label="Options">
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <VirtualizedSelectContent items={items.slice(0, 10)}>
            <div>Footer note</div>
          </VirtualizedSelectContent>
        </Select>,
      );
      expect(getByText("Footer note")).toBeInTheDocument();
    });
  });
});

describe("VirtualizedSelectItems", () => {
  it("renders visible items inside SelectContent", () => {
    const { getByText } = renderWithProviders(
      <Select open>
        <SelectTrigger aria-label="Options">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <VirtualizedSelectItems items={items} />
        </SelectContent>
      </Select>,
    );
    expect(getByText("Option 1")).toBeInTheDocument();
  });

  it("renders an empty virtualized list", () => {
    const { container } = renderWithProviders(<VirtualizedSelectItems items={[]} />);
    expect(container.querySelector("[data-slot=select-virtualized-items]")).toBeInTheDocument();
  });
});

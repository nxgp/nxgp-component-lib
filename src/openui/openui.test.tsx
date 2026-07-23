import { createParser } from "@openuidev/react-lang";
import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../tests/utils";
import { KitOpenUIRenderer } from "./kit-openui-renderer";
import { kitOpenUILibrary } from "./library";
import { openUIFixtures } from "./openui.fixtures";
import { buildOpenUISystemPrompt, kitOpenUIPromptOptions } from "./prompt";

vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 400, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe("kitOpenUILibrary", () => {
  it("declares Stack as the root and exposes the v1 component set", () => {
    expect(kitOpenUILibrary.root).toBe("Stack");
    const names = Object.keys(kitOpenUILibrary.components);
    expect(names).toContain("Stack");
    expect(names).toContain("Chart");
    expect(names).toContain("DataTable");
    expect(names).toContain("Form");
    expect(names.length).toBeGreaterThanOrEqual(20);
  });

  it("produces a JSON schema entry per component", () => {
    const schema = kitOpenUILibrary.toJSONSchema();
    expect(Object.keys(schema.$defs ?? {})).toContain("Metric");
  });
});

describe("prompt", () => {
  it("ships static-UI defaults (no tools / bindings)", () => {
    expect(kitOpenUIPromptOptions.toolCalls).toBe(false);
    expect(kitOpenUIPromptOptions.bindings).toBe(false);
  });

  it("includes component signatures and the root rule", () => {
    const prompt = buildOpenUISystemPrompt();
    expect(prompt).toContain("Stack(");
    expect(prompt).toContain("Metric(");
    expect(prompt).toMatch(/root = Stack/);
  });
});

describe("fixtures", () => {
  const parser = createParser(kitOpenUILibrary.toJSONSchema());

  for (const [id, { source }] of Object.entries(openUIFixtures)) {
    it(`parses the ${id} fixture with no errors or dangling references`, () => {
      const { meta } = parser.parse(source);
      expect(meta.errors).toEqual([]);
      expect(meta.unresolved).toEqual([]);
      expect(meta.orphaned).toEqual([]);
      expect(meta.incomplete).toBe(false);
    });
  }
});

describe("KitOpenUIRenderer", () => {
  describe("rendering", () => {
    it("renders analytics headings, metrics, and a chart", () => {
      const { getByText, getAllByTestId } = renderWithProviders(
        <KitOpenUIRenderer response={openUIFixtures.analytics.source} isStreaming={false} />,
      );
      expect(getByText("Q3 performance")).toBeInTheDocument();
      expect(getByText("$48.2k")).toBeInTheDocument();
      expect(getAllByTestId("responsive-container").length).toBeGreaterThan(0);
    });

    it("renders a listing card with badges and a reserve action", () => {
      const { getByText, getByRole } = renderWithProviders(
        <KitOpenUIRenderer response={openUIFixtures.restaurants.source} isStreaming={false} />,
      );
      expect(getByText("Bella Trattoria")).toBeInTheDocument();
      expect(getByRole("button", { name: "Reserve at Bella Trattoria" })).toBeInTheDocument();
    });

    it("renders the approval workflow (alert, stepper, bar chart, actions)", () => {
      const { getByText, getByRole } = renderWithProviders(
        <KitOpenUIRenderer response={openUIFixtures.approval.source} isStreaming={false} />,
      );
      expect(getByText("Expense report #4821")).toBeInTheDocument();
      expect(getByText("Awaiting your review")).toBeInTheDocument();
      expect(getByRole("button", { name: "Reject" })).toBeInTheDocument();
    });

    it("renders the tabbed plan comparison", () => {
      const { getAllByText, getByRole } = renderWithProviders(
        <KitOpenUIRenderer response={openUIFixtures.plans.source} isStreaming={false} />,
      );
      expect(getByRole("tab", { name: "Monthly" })).toBeInTheDocument();
      expect(getAllByText("Pro").length).toBeGreaterThan(0);
    });
  });

  describe("component coverage", () => {
    const kitchenSink = [
      'root = Stack([divider, avatar, cbFC, slFC, selFC, lineChart, badges], "column", "sm", "start", "between", true)',
      "divider = Divider()",
      'avatar = Avatar("AL", "https://example.com/ada.png", "Ada", "lg")',
      'cbFC = FormControl("Subscribe", cb, "We never spam")',
      'cb = CheckBox("subscribe", "Email me updates", false)',
      'slFC = FormControl("Volume", sl)',
      'sl = Slider("volume", 0, 100, 5, 40)',
      'selFC = FormControl("Theme", sel)',
      'sel = Select("theme", themeOpts, "Pick a theme")',
      'themeOpts = [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]',
      'lineChart = Chart("line", "day", [ls], lrows, "Signups")',
      'ls = { key: "count", label: "Count" }',
      'lrows = [{ day: "Mon", count: 3 }, { day: "Tue", count: 6 }]',
      'badges = Buttons([bA, bB], "column")',
      'bA = Button("Primary", "primary", "secondary")',
      'bB = Button("Danger", "danger", "destructive")',
    ].join("\n");

    it("renders divider, avatar image, slider, checkbox, select, and a line chart", () => {
      const { getByText, getByRole, getAllByTestId } = renderWithProviders(
        <KitOpenUIRenderer response={kitchenSink} isStreaming={false} />,
      );
      expect(getByText("We never spam")).toBeInTheDocument();
      expect(getByRole("slider")).toBeInTheDocument();
      expect(getByRole("checkbox")).toBeInTheDocument();
      expect(getAllByTestId("responsive-container").length).toBeGreaterThan(0);
    });

    it("updates state from checkbox and slider interactions", async () => {
      const user = userEvent.setup();
      const onStateUpdate = vi.fn();
      const { getByRole } = renderWithProviders(
        <KitOpenUIRenderer
          response={kitchenSink}
          isStreaming={false}
          onStateUpdate={onStateUpdate}
        />,
      );

      await user.click(getByRole("checkbox"));
      const slider = getByRole("slider");
      slider.focus();
      await user.keyboard("{ArrowRight}");
      expect(onStateUpdate).toHaveBeenCalled();
    });
  });

  describe("interactions", () => {
    it("emits form state on input and an action on submit", async () => {
      const user = userEvent.setup();
      const onStateUpdate = vi.fn();
      const onAction = vi.fn();
      const { getByPlaceholderText, getByRole } = renderWithProviders(
        <KitOpenUIRenderer
          response={openUIFixtures.booking.source}
          isStreaming={false}
          onStateUpdate={onStateUpdate}
          onAction={onAction}
        />,
      );

      const nameInput = getByPlaceholderText("Ada Lovelace");
      await user.type(nameInput, "Ada");
      expect(onStateUpdate).toHaveBeenCalled();

      await user.click(getByRole("button", { name: "Request demo" }));
      await waitFor(() => expect(onAction).toHaveBeenCalled());
      expect(onAction.mock.calls[0]?.[0]?.humanFriendlyMessage).toBe("Submit the demo request");
    });

    it("disables inputs while streaming", () => {
      const { getByPlaceholderText } = renderWithProviders(
        <KitOpenUIRenderer response={openUIFixtures.booking.source} isStreaming />,
      );
      expect(getByPlaceholderText("Ada Lovelace")).toBeDisabled();
    });
  });

  describe("edge cases", () => {
    it("reports structured errors for unknown components", async () => {
      const onError = vi.fn();
      renderWithProviders(
        <KitOpenUIRenderer
          response={'root = Stack([x])\nx = Bogus("hi")'}
          isStreaming={false}
          onError={onError}
        />,
      );
      await waitFor(() => expect(onError).toHaveBeenCalled());
      expect(onError.mock.calls.at(-1)?.[0].length).toBeGreaterThan(0);
    });

    it("renders nothing for an empty response", () => {
      const { container } = renderWithProviders(
        <KitOpenUIRenderer response={null} isStreaming={false} />,
      );
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations for the booking form", async () => {
      const { container } = renderWithProviders(
        <KitOpenUIRenderer response={openUIFixtures.booking.source} isStreaming={false} />,
      );
      await expectNoA11yViolations(container);
    });
  });
});

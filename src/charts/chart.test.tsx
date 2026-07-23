import { Bar, BarChart } from "recharts";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../tests/utils";
import {
  ChartContainer,
  ChartEmpty,
  ChartLegendContent,
  ChartLoading,
  ChartStyle,
  ChartTooltipContent,
  type ChartTooltipContentProps,
} from "./chart";
import { monthlyChartConfig, monthlyChartData, pieChartConfig } from "./chart.fixtures";
import { chartVariants } from "./chart.variants";

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

describe("ChartContainer", () => {
  describe("rendering", () => {
    it("renders a responsive chart shell", () => {
      const { getByTestId } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig} className="h-[200px]">
          <BarChart data={monthlyChartData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" />
          </BarChart>
        </ChartContainer>,
      );
      expect(getByTestId("responsive-container")).toBeInTheDocument();
    });

    it("injects series color variables from config", () => {
      const { container } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig} id="traffic">
          <BarChart data={monthlyChartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      expect(container.innerHTML).toContain("--color-desktop");
      expect(container.querySelector('[data-chart="chart-traffic"]')).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { container } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig} className="custom-chart">
          <BarChart data={monthlyChartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      expect(container.querySelector(".custom-chart")).toBeInTheDocument();
    });
  });

  describe("props and state edge cases", () => {
    it("renders ChartStyle without output when config has no colors", () => {
      const { container } = renderWithProviders(
        <ChartStyle id="empty" config={{ visits: { label: "Visits" } }} />,
      );
      expect(container.querySelector("style")).toBeNull();
    });

    it("supports theme-specific color overrides", () => {
      const { container } = renderWithProviders(
        <ChartStyle
          id="themed"
          config={{
            desktop: {
              label: "Desktop",
              theme: {
                light: "var(--color-chart-1)",
                dark: "var(--color-chart-2)",
              },
            },
          }}
        />,
      );
      const style = container.querySelector("style");
      expect(style?.innerHTML).toContain('[data-theme^="dark"]');
      expect(style?.innerHTML).toContain("--color-desktop");
    });
  });

  describe("interactions", () => {
    it("renders tooltip content when active", () => {
      const { getByText } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig}>
          <ChartTooltipContent
            active
            payload={
              [
                {
                  name: "desktop",
                  dataKey: "desktop",
                  value: 186,
                  type: "rect",
                  color: "var(--color-chart-1)",
                  payload: { month: "January", desktop: 186, mobile: 80 },
                },
              ] as unknown as ChartTooltipContentProps["payload"]
            }
            label="January"
          />
        </ChartContainer>,
      );
      expect(getByText("Desktop")).toBeInTheDocument();
      expect(getByText("186")).toBeInTheDocument();
    });

    it("returns null when tooltip is inactive", () => {
      const { container } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig}>
          <ChartTooltipContent active={false} payload={[]} />
        </ChartContainer>,
      );
      expect(container.querySelector(".grid")).toBeNull();
    });

    it("hides tooltip label when hideLabel is true", () => {
      const { queryByText } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig}>
          <ChartTooltipContent
            active
            hideLabel
            payload={
              [
                {
                  name: "desktop",
                  dataKey: "desktop",
                  value: 186,
                  type: "rect",
                  color: "var(--color-chart-1)",
                  payload: {},
                },
              ] as unknown as ChartTooltipContentProps["payload"]
            }
            label="January"
          />
        </ChartContainer>,
      );
      expect(queryByText("January")).not.toBeInTheDocument();
      expect(queryByText("Desktop")).toBeInTheDocument();
    });

    it("renders legend items from payload", () => {
      const { getByText } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig}>
          <ChartLegendContent
            payload={[
              {
                value: "desktop",
                dataKey: "desktop",
                type: "rect" as const,
                color: "var(--color-chart-1)",
              },
            ]}
          />
        </ChartContainer>,
      );
      expect(getByText("Desktop")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations for tooltip content", async () => {
      const { container } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig}>
          <ChartTooltipContent
            active
            payload={
              [
                {
                  name: "desktop",
                  dataKey: "desktop",
                  value: 186,
                  type: "rect",
                  color: "var(--color-chart-1)",
                  payload: {},
                },
              ] as unknown as ChartTooltipContentProps["payload"]
            }
            label="January"
          />
        </ChartContainer>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders with updated config", () => {
      const { rerender, container } = renderWithProviders(
        <ChartContainer config={monthlyChartConfig}>
          <BarChart data={monthlyChartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      rerender(
        <ChartContainer
          config={{
            ...monthlyChartConfig,
            tablet: { label: "Tablet", color: "var(--color-chart-3)" },
          }}
        >
          <BarChart data={monthlyChartData}>
            <Bar dataKey="desktop" />
          </BarChart>
        </ChartContainer>,
      );
      expect(container.innerHTML).toContain("--color-tablet");
    });
  });
});

describe("ChartTooltipContent edge cases", () => {
  const payload = [
    {
      name: "desktop",
      dataKey: "desktop",
      value: 186,
      type: "rect",
      color: "var(--color-chart-1)",
      payload: { browser: "desktop" },
    },
  ] as unknown as ChartTooltipContentProps["payload"];

  it("uses labelFormatter when provided", () => {
    const { getByText } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent
          active
          payload={payload}
          label="desktop"
          labelFormatter={(value) => `Month: ${String(value)}`}
        />
      </ChartContainer>,
    );
    expect(getByText("Month: Desktop")).toBeInTheDocument();
  });

  it("supports line and dashed indicators", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent active indicator="line" payload={payload} label="desktop" />
      </ChartContainer>,
    );
    expect(container.querySelector(".w-1")).toBeInTheDocument();
  });

  it("hides indicators when hideIndicator is true", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent active hideIndicator payload={payload} label="desktop" />
      </ChartContainer>,
    );
    expect(container.querySelector(".rounded-\\[2px\\]")).toBeNull();
  });

  it("uses custom formatter output", () => {
    const { getByText } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent
          active
          payload={payload}
          formatter={(value) => <span>Custom {value}</span>}
        />
      </ChartContainer>,
    );
    expect(getByText("Custom 186")).toBeInTheDocument();
  });
});

describe("ChartLegendContent edge cases", () => {
  it("returns null without payload", () => {
    const { queryByText } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartLegendContent payload={[]} />
      </ChartContainer>,
    );
    expect(queryByText("Desktop")).not.toBeInTheDocument();
  });

  it("supports top alignment and hideIcon", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartLegendContent
          verticalAlign="top"
          hideIcon
          payload={[
            {
              value: "desktop",
              dataKey: "desktop",
              type: "rect",
              color: "var(--color-chart-1)",
            },
          ]}
        />
      </ChartContainer>,
    );
    expect(container.querySelector(".pb-3")).toBeInTheDocument();
    expect(container.querySelector(".h-2.w-2")).toBeInTheDocument();
  });
});

describe("Chart variants and context", () => {
  it("throws when tooltip content renders outside ChartContainer", () => {
    expect(() => renderWithProviders(<ChartTooltipContent active payload={[]} />)).toThrow(
      "useChart must be used within a <ChartContainer />",
    );
  });

  it("renders square aspect variant", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig} aspect="square" className="h-[200px]">
        <BarChart data={monthlyChartData}>
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>,
    );
    expect(container.querySelector(".aspect-square")).toBeInTheDocument();
  });

  it("resolves config labels from nested payload keys", () => {
    const { getByText } = renderWithProviders(
      <ChartContainer config={pieChartConfig}>
        <ChartTooltipContent
          active
          nameKey="browser"
          payload={
            [
              {
                name: "chrome",
                dataKey: "visitors",
                value: 100,
                type: "rect",
                color: "var(--color-chart-1)",
                browser: "chrome",
                payload: { browser: "chrome" },
              },
            ] as unknown as ChartTooltipContentProps["payload"]
          }
        />
      </ChartContainer>,
    );
    expect(getByText("Chrome")).toBeInTheDocument();
  });

  it("nests label for single dashed indicator payloads", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent
          active
          indicator="dashed"
          payload={
            [
              {
                name: "desktop",
                dataKey: "desktop",
                value: 186,
                type: "rect",
                color: "var(--color-chart-1)",
                payload: {},
              },
            ] as unknown as ChartTooltipContentProps["payload"]
          }
          label="desktop"
        />
      </ChartContainer>,
    );
    expect(container.querySelector(".border-dashed")).toBeInTheDocument();
  });
});

describe("chartVariants", () => {
  it("supports auto aspect without aspect ratio class", () => {
    expect(chartVariants({ aspect: "auto" })).not.toContain("aspect-video");
  });
});

describe("Chart icon and payload filtering", () => {
  const IconStub = () => <svg data-testid="chart-icon" />;

  it("renders configured icons in tooltip content", () => {
    const config = {
      desktop: { label: "Desktop", icon: IconStub, color: "var(--color-chart-1)" },
    };
    const { getByTestId } = renderWithProviders(
      <ChartContainer config={config}>
        <ChartTooltipContent
          active
          payload={
            [
              {
                name: "desktop",
                dataKey: "desktop",
                value: 10,
                type: "rect",
                color: "var(--color-chart-1)",
                payload: {},
              },
            ] as unknown as ChartTooltipContentProps["payload"]
          }
        />
      </ChartContainer>,
    );
    expect(getByTestId("chart-icon")).toBeInTheDocument();
  });

  it("renders configured icons in legend content", () => {
    const config = {
      desktop: { label: "Desktop", icon: IconStub, color: "var(--color-chart-1)" },
    };
    const { getByTestId } = renderWithProviders(
      <ChartContainer config={config}>
        <ChartLegendContent
          payload={[
            {
              value: "desktop",
              dataKey: "desktop",
              type: "rect",
              color: "var(--color-chart-1)",
            },
          ]}
        />
      </ChartContainer>,
    );
    expect(getByTestId("chart-icon")).toBeInTheDocument();
  });
});

describe("Additional chart coverage", () => {
  it("filters none-type tooltip rows", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent
          active
          payload={
            [
              {
                name: "desktop",
                dataKey: "desktop",
                value: 186,
                type: "none",
                color: "var(--color-chart-1)",
                payload: {},
              },
              {
                name: "mobile",
                dataKey: "mobile",
                value: 80,
                type: "rect",
                color: "var(--color-chart-2)",
                payload: {},
              },
            ] as unknown as ChartTooltipContentProps["payload"]
          }
        />
      </ChartContainer>,
    );
    expect(container.querySelectorAll('[class*="flex w-full flex-wrap"]').length).toBe(1);
  });

  it("falls back to config key when resolved label key is missing", () => {
    const { getByText } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig}>
        <ChartTooltipContent
          active
          nameKey="series"
          payload={
            [
              {
                name: "visitors",
                dataKey: "visitors",
                value: 10,
                type: "rect",
                color: "var(--color-chart-1)",
                series: "desktop",
                payload: { series: "desktop" },
              },
            ] as unknown as ChartTooltipContentProps["payload"]
          }
        />
      </ChartContainer>,
    );
    expect(getByText("Desktop")).toBeInTheDocument();
  });

  it("skips tooltip header when labelKey resolves to no config label", () => {
    const { container } = renderWithProviders(
      <ChartContainer config={{}}>
        <ChartTooltipContent
          active
          labelKey="missingKey"
          payload={
            [
              {
                name: "visitors",
                dataKey: "missingKey",
                value: 10,
                type: "rect",
                color: "var(--color-chart-1)",
                payload: {},
              },
            ] as unknown as ChartTooltipContentProps["payload"]
          }
        />
      </ChartContainer>,
    );
    expect(container.querySelector(".grid > .font-medium")).toBeNull();
  });
});

describe("Chart overlays", () => {
  it("renders loading overlay", () => {
    const { getByRole, container } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig} className="h-[200px]">
        <ChartLoading />
        <BarChart data={monthlyChartData}>
          <Bar dataKey="desktop" />
        </BarChart>
      </ChartContainer>,
    );
    expect(getByRole("status")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=chart-loading]")).toBeInTheDocument();
  });

  it("renders empty overlay with custom message", () => {
    const { getByText } = renderWithProviders(
      <ChartContainer config={monthlyChartConfig} className="h-[200px]">
        <ChartEmpty message="No metrics yet" />
      </ChartContainer>,
    );
    expect(getByText("No metrics yet")).toBeInTheDocument();
  });
});

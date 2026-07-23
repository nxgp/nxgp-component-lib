import {
  type ComponentProps,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useMemo,
} from "react";
import type { TooltipValueType } from "recharts";
import * as RechartsPrimitive from "recharts";
import { cn } from "../lib/cn";
import { LoaderIcon } from "../lib/icons";
import { type ChartVariantProps, chartVariants } from "./chart.variants";

/** CSS selector prefixes for optional per-theme series colors in {@link ChartConfig}. */
const CHART_THEME_SELECTORS = { light: "", dark: '[data-theme^="dark"]' } as const;

const INITIAL_DIMENSION = { width: 320, height: 200 } as const;
type TooltipNameType = number | string;

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode;
    icon?: ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof CHART_THEME_SELECTORS, string> }
  )
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextValue | null>(null);

function useChart(): ChartContextValue {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

export type ChartContainerProps = ComponentProps<"div"> &
  ChartVariantProps & {
    config: ChartConfig;
    children: ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
    initialDimension?: {
      width: number;
      height: number;
    };
  };

/**
 * Responsive Recharts wrapper that injects series color CSS variables from {@link ChartConfig}.
 *
 * @example
 * ```tsx
 * import { Bar, BarChart } from "recharts";
 * import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@nxgp/component-lib/charts";
 *
 * <ChartContainer config={chartConfig} className="h-[200px] w-full">
 *   <BarChart data={data}>
 *     <Bar dataKey="desktop" fill="var(--color-desktop)" />
 *     <ChartTooltip content={<ChartTooltipContent />} />
 *   </BarChart>
 * </ChartContainer>
 * ```
 */
export function ChartContainer({
  id,
  className,
  children,
  config,
  aspect,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ChartContainerProps) {
  const uniqueId = useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} className={cn(chartVariants({ aspect }), className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/** Injects `--color-{seriesKey}` variables scoped to the chart container. */
export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.theme ?? item.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: scoped CSS variables from trusted ChartConfig
      dangerouslySetInnerHTML={{
        __html: Object.entries(CHART_THEME_SELECTORS)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
}

/** Recharts tooltip primitive — pass {@link ChartTooltipContent} as `content`. */
export const ChartTooltip = RechartsPrimitive.Tooltip;

export type ChartTooltipContentProps = ComponentProps<typeof RechartsPrimitive.Tooltip> &
  ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
    "accessibilityLayer"
  >;

/**
 * Themed tooltip body for {@link ChartTooltip}.
 */
export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload?.fill ?? item.color;

            return (
              <div
                key={key}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, 0, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            },
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

/** Recharts legend primitive — pass {@link ChartLegendContent} as `content`. */
export const ChartLegend = RechartsPrimitive.Legend;

export type ChartLegendContentProps = ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps;

/**
 * Themed legend body for {@link ChartLegend}.
 */
export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={key}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload && typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === "string") {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export type ChartLoadingProps = ComponentProps<"div">;

/** Loading overlay for {@link ChartContainer} while series data is fetching. */
export function ChartLoading({ className, ...props }: ChartLoadingProps) {
  return (
    <div
      data-slot="chart-loading"
      role="status"
      aria-live="polite"
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-[1px]",
        className,
      )}
      {...props}
    >
      <LoaderIcon className="size-6 animate-spin text-muted-foreground" aria-hidden />
      <span className="sr-only">Loading chart</span>
    </div>
  );
}

export type ChartEmptyProps = ComponentProps<"div"> & {
  /** Message shown when there is no chart data. */
  message?: ReactNode;
};

/** Empty state overlay for {@link ChartContainer} when a series has no points. */
export function ChartEmpty({
  className,
  message = "No data available",
  ...props
}: ChartEmptyProps) {
  return (
    <div
      data-slot="chart-empty"
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/60 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {message}
    </div>
  );
}

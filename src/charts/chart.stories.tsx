import type { Meta, StoryObj } from "@storybook/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { choiceArg, defineComponentStories, hiddenArg } from "../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../.storybook/utils/playground";
import {
  ChartContainer,
  ChartEmpty,
  ChartLegend,
  ChartLegendContent,
  ChartLoading,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import {
  categoryChartConfig,
  categoryChartData,
  dailyActiveUsersConfig,
  dailyActiveUsersData,
  monthlyChartConfig,
  monthlyChartData,
  pieChartConfig,
  pieChartData,
  revenueChartConfig,
  revenueChartData,
} from "./chart.fixtures";

type ChartStoryArgs = {
  aspect?: "video" | "square" | "auto";
};

const meta = {
  title: "Charts/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  subcomponents: {
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartLoading,
    ChartEmpty,
  },
  ...defineComponentStories(
    "Responsive Recharts wrapper that injects series color CSS variables from ChartConfig.",
    {
      config: hiddenArg("Series color and label configuration keyed by dataKey."),
      aspect: choiceArg(["video", "square", "auto"] as const, {
        description: "Aspect ratio preset for the chart container.",
        defaultValue: "video",
      }),
      id: hiddenArg("Optional id for the chart container element."),
      initialDimension: hiddenArg("Fallback width and height before ResponsiveContainer measures."),
      children: hiddenArg("Recharts chart element tree."),
    },
  ),
} satisfies Meta;

export default meta;

const barChartPlayground = (
  <>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => String(value).slice(0, 3)}
    />
    <YAxis tickLine={false} axisLine={false} width={40} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </>
);

export const Default = playgroundStory({
  args: { aspect: "video" },
  render: (args: ChartStoryArgs) => {
    const aspect = args.aspect ?? "video";
    return (
      <ChartContainer
        config={monthlyChartConfig}
        aspect={aspect}
        className={aspect === "auto" ? "h-[280px] w-full max-w-xl" : "w-full max-w-xl"}
      >
        <BarChart accessibilityLayer data={monthlyChartData}>
          {barChartPlayground}
        </BarChart>
      </ChartContainer>
    );
  },
});

export const AllVariants: StoryObj = {
  ...storyDoc("Bar, line, area, stacked, horizontal, and pie chart examples with semantic tokens."),
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      <ChartContainer config={monthlyChartConfig} className="h-[260px] w-full">
        <BarChart accessibilityLayer data={monthlyChartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>

      <ChartContainer config={revenueChartConfig} className="h-[260px] w-full">
        <BarChart accessibilityLayer data={revenueChartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value) => `$${Number(value) / 1000}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="subscriptions"
            stackId="revenue"
            fill="var(--color-subscriptions)"
            radius={0}
          />
          <Bar dataKey="services" stackId="revenue" fill="var(--color-services)" radius={0} />
          <Bar dataKey="ads" stackId="revenue" fill="var(--color-ads)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>

      <ChartContainer config={dailyActiveUsersConfig} className="h-[260px] w-full">
        <LineChart accessibilityLayer data={dailyActiveUsersData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line
            dataKey="users"
            type="monotone"
            stroke="var(--color-users)"
            strokeWidth={2}
            dot={{ fill: "var(--color-users)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={monthlyChartConfig} className="h-[260px] w-full">
        <LineChart accessibilityLayer data={monthlyChartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="desktop"
            type="monotone"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{ fill: "var(--color-desktop)", r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            dataKey="mobile"
            type="monotone"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={{ fill: "var(--color-mobile)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>

      <ChartContainer config={revenueChartConfig} className="h-[260px] w-full">
        <AreaChart accessibilityLayer data={revenueChartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value) => `$${Number(value) / 1000}k`}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="subscriptions"
            type="monotone"
            fill="var(--color-subscriptions)"
            fillOpacity={0.45}
            stroke="var(--color-subscriptions)"
            stackId="revenue"
          />
          <Area
            dataKey="services"
            type="monotone"
            fill="var(--color-services)"
            fillOpacity={0.45}
            stroke="var(--color-services)"
            stackId="revenue"
          />
          <Area
            dataKey="ads"
            type="monotone"
            fill="var(--color-ads)"
            fillOpacity={0.45}
            stroke="var(--color-ads)"
            stackId="revenue"
          />
        </AreaChart>
      </ChartContainer>

      <ChartContainer config={categoryChartConfig} className="h-[260px] w-full">
        <BarChart accessibilityLayer data={categoryChartData} layout="vertical">
          <CartesianGrid horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="category"
            type="category"
            tickLine={false}
            axisLine={false}
            width={108}
            tickMargin={8}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </BarChart>
      </ChartContainer>

      <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[260px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={pieChartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={56}
            outerRadius={96}
          >
            {pieChartData.map((entry) => (
              <Cell key={entry.browser} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
        </PieChart>
      </ChartContainer>

      <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[260px]">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={pieChartData} dataKey="visitors" nameKey="browser" outerRadius={96}>
            {pieChartData.map((entry) => (
              <Cell key={entry.browser} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
        </PieChart>
      </ChartContainer>
    </div>
  ),
};

export const LoadingAndEmpty: StoryObj = {
  ...storyDoc("Loading overlay and empty state placeholders for async chart data."),
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <ChartContainer config={monthlyChartConfig} className="h-[220px] w-full">
        <ChartLoading />
        <BarChart data={monthlyChartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" />
        </BarChart>
      </ChartContainer>
      <ChartContainer config={monthlyChartConfig} className="h-[220px] w-full">
        <ChartEmpty message="No metrics for this range" />
      </ChartContainer>
    </div>
  ),
};

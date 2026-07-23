import type { ChartConfig } from "./chart";

export const monthlyChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 278, mobile: 165 },
  { month: "August", desktop: 189, mobile: 210 },
  { month: "September", desktop: 239, mobile: 178 },
  { month: "October", desktop: 278, mobile: 195 },
  { month: "November", desktop: 312, mobile: 220 },
  { month: "December", desktop: 349, mobile: 248 },
];

export const monthlyChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export const revenueChartData = [
  { month: "Jan", subscriptions: 4200, services: 2400, ads: 1800 },
  { month: "Feb", subscriptions: 3800, services: 2210, ads: 1650 },
  { month: "Mar", subscriptions: 5100, services: 2890, ads: 1920 },
  { month: "Apr", subscriptions: 4700, services: 2750, ads: 2100 },
  { month: "May", subscriptions: 5300, services: 3010, ads: 2280 },
  { month: "Jun", subscriptions: 4900, services: 2940, ads: 2050 },
  { month: "Jul", subscriptions: 5600, services: 3180, ads: 2360 },
  { month: "Aug", subscriptions: 5200, services: 3050, ads: 2190 },
  { month: "Sep", subscriptions: 5800, services: 3320, ads: 2480 },
  { month: "Oct", subscriptions: 6100, services: 3480, ads: 2610 },
  { month: "Nov", subscriptions: 6400, services: 3620, ads: 2740 },
  { month: "Dec", subscriptions: 6900, services: 3910, ads: 2950 },
];

export const revenueChartConfig = {
  subscriptions: {
    label: "Subscriptions",
    color: "var(--color-chart-1)",
  },
  services: {
    label: "Services",
    color: "var(--color-chart-2)",
  },
  ads: {
    label: "Ads",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export const dailyActiveUsersData = [
  { day: "Mon", users: 1240 },
  { day: "Tue", users: 1380 },
  { day: "Wed", users: 1520 },
  { day: "Thu", users: 1410 },
  { day: "Fri", users: 1680 },
  { day: "Sat", users: 1320 },
  { day: "Sun", users: 1180 },
  { day: "Mon", users: 1450 },
  { day: "Tue", users: 1590 },
  { day: "Wed", users: 1720 },
  { day: "Thu", users: 1610 },
  { day: "Fri", users: 1840 },
  { day: "Sat", users: 1490 },
  { day: "Sun", users: 1270 },
];

export const dailyActiveUsersConfig = {
  users: {
    label: "Active users",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export const categoryChartData = [
  { category: "North America", value: 275 },
  { category: "Europe", value: 200 },
  { category: "Asia Pacific", value: 187 },
  { category: "Latin America", value: 173 },
  { category: "Middle East", value: 90 },
];

export const categoryChartConfig = {
  value: {
    label: "Visitors",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export const pieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

export const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--color-chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--color-chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--color-chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--color-chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig;

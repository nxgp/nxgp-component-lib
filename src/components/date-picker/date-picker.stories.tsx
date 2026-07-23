import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  choiceArg,
  defineComponentStories,
  hiddenArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import {
  expect,
  portal,
  storyAction,
  userEvent,
  within,
} from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { overlayCanvasDecorator } from "../../../.storybook/utils/playground-renders";
import { DatePicker } from "./date-picker";
import { DEFAULT_DATE_PRESETS } from "./date-picker-presets";
import { DateRangePicker } from "./date-range-picker";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Single-date picker combining Popover and Calendar with optional presets and form submission.",
    {
      placeholder: textArg({
        description: "Trigger label when no date is selected.",
        defaultValue: "Pick a date",
      }),
      dateFormat: textArg({
        description: "date-fns format string for the selected date label.",
        defaultValue: "PPP",
      }),
      name: textArg({
        description: "Hidden input `name` for native form submission (`yyyy-MM-dd`).",
      }),
      variant: choiceArg(["default", "ghost", "flushed"] as const, {
        description: "Border and background treatment for the trigger.",
        defaultValue: "default",
      }),
      size: choiceArg(["default", "sm", "lg"] as const, {
        description: "Trigger height and horizontal padding preset.",
        defaultValue: "default",
      }),
      invalid: sharedArgTypes.invalid,
      disabled: sharedArgTypes.disabled,
      value: hiddenArg("Controlled selected date."),
      defaultValue: hiddenArg("Initial date for uncontrolled usage."),
      onValueChange: hiddenArg("Called when the user selects a date."),
      calendarProps: hiddenArg("Additional props forwarded to the embedded Calendar."),
      presets: hiddenArg("Quick-select preset buttons shown beside the calendar."),
    },
    ["onValueChange"],
  ),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  decorators: [overlayCanvasDecorator],
  actions: ["onValueChange"],
  args: {
    placeholder: "Pick a date",
    dateFormat: "PPP",
    size: "default",
    variant: "default",
    disabled: false,
    invalid: false,
    calendarProps: { defaultMonth: new Date(2026, 5, 1) },
  },
  render: (args) => <DatePicker {...args} aria-label="Date" />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /pick a date/i }));
    await userEvent.click(portal().getByRole("button", { name: /june 15/i }));
    await expect(storyAction(args, "onValueChange")).toHaveBeenCalled();
  },
});

export const WithValue: Story = {
  ...storyDoc("Example with value."),
  args: {
    value: new Date(2026, 5, 15),
  },
};

export const Disabled: Story = {
  ...storyDoc("Non-interactive muted presentation."),
  args: {
    disabled: true,
    placeholder: "Unavailable",
  },
};

export const Range: Story = {
  ...storyDoc("Date range selection with start and end values."),
  render: () => {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(2026, 5, 10),
      to: new Date(2026, 5, 20),
    });
    return <DateRangePicker value={range} onValueChange={setRange} />;
  },
};

export const WithPresets: Story = {
  ...storyDoc("Quick-pick preset chips for common date ranges."),
  render: () => (
    <div className="flex flex-col gap-4">
      <DatePicker presets={DEFAULT_DATE_PRESETS} placeholder="With presets" />
      <DateRangePicker numberOfMonths={2} />
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DatePicker size="sm" placeholder="Small" aria-label="Small date" />
      <DatePicker placeholder="Default" aria-label="Default date" />
      <DatePicker size="lg" placeholder="Large" aria-label="Large date" />
    </div>
  ),
};

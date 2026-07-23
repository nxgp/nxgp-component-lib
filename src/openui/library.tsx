/**
 * Kit-native OpenUI Lang component library.
 *
 * Every component the LLM may emit is defined here with a Zod schema (the wire
 * contract) and a React renderer that maps **only** onto `@nxgp/component-lib` components.
 * No `@openuidev/react-ui` visuals are used — kit owns the look and feel.
 *
 * @see https://openui.com/docs/openui-lang
 */

import {
  createLibrary,
  defineComponent,
  useIsStreaming,
  useStateField,
  useTriggerAction,
} from "@openuidev/react-lang";
import { type ReactNode, useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod/v4";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../charts/chart";
import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Checkbox } from "../components/checkbox";
import { DatePicker } from "../components/date-picker";
import { Field, FieldControl, FieldDescription, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import { Label } from "../components/label";
import {
  SelectItem as KitSelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Separator } from "../components/separator";
import { Slider } from "../components/slider";
import { Stepper, StepperItem, StepperSeparator } from "../components/stepper";
import { type ColumnDef, DataTable } from "../components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { Textarea } from "../components/textarea";
import { Typography } from "../components/typography";
import { cn } from "../lib/cn";

const GAP_CLASS = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

const ALIGN_CLASS = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const JUSTIFY_CLASS = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

const gapEnum = z.enum(["none", "sm", "md", "lg"]);
const alignEnum = z.enum(["start", "center", "end", "stretch"]);
const justifyEnum = z.enum(["start", "center", "end", "between"]);

// ── Content leaves ──────────────────────────────────────────────────────────

/** Text → kit Typography. */
export const Text = defineComponent({
  name: "Text",
  description: "A block of text rendered with a typographic variant (headings, body, captions).",
  props: z.object({
    text: z.string().describe("The text content."),
    variant: z
      .enum(["h1", "h2", "h3", "h4", "p", "lead", "large", "small", "muted"])
      .optional()
      .describe("Typographic style. Default p."),
  }),
  component: ({ props }) => <Typography variant={props.variant ?? "p"}>{props.text}</Typography>,
});

/** Badge → kit Badge. */
export const Badge_ = defineComponent({
  name: "Badge",
  description: "A small status pill / tag.",
  props: z.object({
    text: z.string(),
    variant: z.enum(["default", "secondary", "destructive", "outline"]).optional(),
  }),
  component: ({ props }) => <Badge variant={props.variant ?? "default"}>{props.text}</Badge>,
});

/** Alert → kit Alert. */
export const Alert_ = defineComponent({
  name: "Alert",
  description: "A callout banner with a title, optional description, and severity variant.",
  props: z.object({
    title: z.string(),
    description: z.string().optional(),
    variant: z.enum(["default", "info", "success", "warning", "destructive"]).optional(),
  }),
  component: ({ props }) => (
    <Alert variant={props.variant ?? "default"}>
      <AlertTitle>{props.title}</AlertTitle>
      {props.description ? <AlertDescription>{props.description}</AlertDescription> : null}
    </Alert>
  ),
});

/** Avatar → kit Avatar. */
export const Avatar_ = defineComponent({
  name: "Avatar",
  description: "A person or brand avatar with an image and text fallback.",
  props: z.object({
    fallback: z.string().describe("Initials shown when no image loads."),
    src: z.string().optional(),
    alt: z.string().optional(),
    size: z.enum(["sm", "default", "lg"]).optional(),
  }),
  component: ({ props }) => (
    <Avatar size={props.size ?? "default"}>
      {props.src ? <AvatarImage src={props.src} alt={props.alt ?? props.fallback} /> : null}
      <AvatarFallback>{props.fallback.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  ),
});

/** Metric → KPI card built from kit tokens + Badge. */
export const Metric = defineComponent({
  name: "Metric",
  description: "A KPI card showing a label, big value, and optional trend delta.",
  props: z.object({
    label: z.string(),
    value: z.string(),
    delta: z.string().optional().describe("e.g. +12%"),
    description: z.string().optional(),
    trend: z.enum(["up", "down", "flat"]).optional(),
  }),
  component: ({ props }) => {
    const trend = props.trend ?? "flat";
    const badgeVariant =
      trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary";
    return (
      <div className="flex min-w-40 flex-1 flex-col gap-1 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">{props.label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold tracking-tight text-foreground">{props.value}</p>
          {props.delta ? <Badge variant={badgeVariant}>{props.delta}</Badge> : null}
        </div>
        {props.description ? (
          <p className="text-xs text-muted-foreground">{props.description}</p>
        ) : null}
      </div>
    );
  },
});

/** Divider → kit Separator. */
export const Divider = defineComponent({
  name: "Divider",
  description: "A horizontal separator line.",
  props: z.object({}),
  component: () => <Separator className="w-full" />,
});

// ── Data display ────────────────────────────────────────────────────────────

const chartSeries = z.object({
  key: z.string().describe("Row field to plot."),
  label: z.string().optional(),
});

/** Chart → kit ChartContainer + Recharts (bar/line/area). */
export const Chart = defineComponent({
  name: "Chart",
  description:
    "A bar, line, or area chart. `data` is an array of row objects; `series` lists the numeric fields to plot; `xKey` is the category field.",
  props: z.object({
    chartType: z.enum(["bar", "line", "area"]),
    xKey: z.string(),
    series: z.array(chartSeries).describe("One entry per plotted field."),
    data: z.array(z.record(z.string(), z.any())).describe("Array of row objects."),
    title: z.string().optional(),
  }),
  component: ({ props }) => {
    const series = props.series ?? [];
    const rows = (props.data ?? []) as Record<string, unknown>[];
    const config = series.reduce<ChartConfig>((acc, item, index) => {
      acc[item.key] = {
        label: item.label ?? item.key,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
      return acc;
    }, {});
    const ChartImpl =
      props.chartType === "line" ? LineChart : props.chartType === "area" ? AreaChart : BarChart;
    return (
      <div className="w-full space-y-2">
        {props.title ? (
          <Typography variant="h4" className="text-foreground">
            {props.title}
          </Typography>
        ) : null}
        <ChartContainer config={config} aspect="video" className="w-full">
          <ChartImpl data={rows} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={props.xKey} tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {series.length > 1 ? <ChartLegend content={<ChartLegendContent />} /> : null}
            {series.map((item) => {
              if (props.chartType === "line") {
                return (
                  <Line
                    key={item.key}
                    type="monotone"
                    dataKey={item.key}
                    stroke={`var(--color-${item.key})`}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              }
              if (props.chartType === "area") {
                return (
                  <Area
                    key={item.key}
                    type="monotone"
                    dataKey={item.key}
                    fill={`var(--color-${item.key})`}
                    stroke={`var(--color-${item.key})`}
                    fillOpacity={0.25}
                  />
                );
              }
              return (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  fill={`var(--color-${item.key})`}
                  radius={4}
                />
              );
            })}
          </ChartImpl>
        </ChartContainer>
      </div>
    );
  },
});

const dataColumn = z.object({
  key: z.string(),
  header: z.string(),
});

/** DataTable → kit DataTable. */
export const DataTable_ = defineComponent({
  name: "DataTable",
  description: "A tabular data grid. `columns` maps row keys to headers; `data` is the rows.",
  props: z.object({
    columns: z.array(dataColumn),
    data: z.array(z.record(z.string(), z.any())),
    title: z.string().optional(),
  }),
  component: ({ props }) => {
    const rows = (props.data ?? []) as Record<string, unknown>[];
    const columns: ColumnDef<Record<string, unknown>>[] = (props.columns ?? []).map((col) => ({
      accessorKey: col.key,
      header: col.header,
      cell: ({ row }) => {
        const value = row.getValue(col.key);
        return value === null || value === undefined ? "—" : String(value);
      },
    }));
    return (
      <div className="w-full space-y-2">
        {props.title ? (
          <Typography variant="h4" className="text-foreground">
            {props.title}
          </Typography>
        ) : null}
        <DataTable
          columns={columns}
          data={rows}
          enableFiltering={false}
          enableColumnVisibility={false}
          enablePagination={rows.length > 8}
          emptyMessage="No rows"
        />
      </div>
    );
  },
});

const stepDef = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

/** Stepper → kit Stepper (workflow / approval progress). */
export const Stepper_ = defineComponent({
  name: "Stepper",
  description:
    "A multi-step progress indicator. `steps` is ordered; `value` is the id of the current step.",
  props: z.object({
    steps: z.array(stepDef),
    value: z.string().optional(),
    orientation: z.enum(["horizontal", "vertical"]).optional(),
  }),
  component: ({ props }) => {
    const steps = props.steps ?? [];
    const stepIds = steps.map((step) => step.id);
    const value = props.value ?? steps[0]?.id;
    return (
      <Stepper
        value={value}
        steps={stepIds}
        orientation={props.orientation ?? "horizontal"}
        className="w-full"
      >
        {steps.flatMap((step, index) => {
          const item = (
            <StepperItem
              key={step.id}
              value={step.id}
              title={step.label}
              description={step.description}
            />
          );
          return index === 0 ? [item] : [<StepperSeparator key={`${step.id}-sep`} />, item];
        })}
      </Stepper>
    );
  },
});

// ── Forms ───────────────────────────────────────────────────────────────────

/** Input → kit Field-managed text input. */
export const InputField = defineComponent({
  name: "Input",
  description: "A single-line text input. Use inside FormControl.",
  props: z.object({
    name: z.string().describe("Unique field name for form state."),
    placeholder: z.string().optional(),
    inputType: z.enum(["text", "email", "number", "password", "tel", "url"]).optional(),
    value: z.string().optional(),
  }),
  component: ({ props }) => {
    const field = useStateField<string>(props.name, props.value);
    const streaming = useIsStreaming();
    return (
      <Input
        type={props.inputType ?? "text"}
        placeholder={props.placeholder}
        disabled={streaming}
        value={(field.value as string | undefined) ?? ""}
        onChange={(event) => field.setValue(event.target.value)}
      />
    );
  },
});

/** TextArea → kit Textarea. */
export const TextAreaField = defineComponent({
  name: "TextArea",
  description: "A multi-line text input. Use inside FormControl.",
  props: z.object({
    name: z.string(),
    placeholder: z.string().optional(),
    value: z.string().optional(),
  }),
  component: ({ props }) => {
    const field = useStateField<string>(props.name, props.value);
    const streaming = useIsStreaming();
    return (
      <Textarea
        placeholder={props.placeholder}
        disabled={streaming}
        value={(field.value as string | undefined) ?? ""}
        onChange={(event) => field.setValue(event.target.value)}
      />
    );
  },
});

const selectItem = z.object({
  value: z.string(),
  label: z.string(),
});

/** Select → kit Select. */
export const SelectField = defineComponent({
  name: "Select",
  description: "A single-choice dropdown. Use inside FormControl.",
  props: z.object({
    name: z.string(),
    items: z.array(selectItem),
    placeholder: z.string().optional(),
    value: z.string().optional(),
  }),
  component: ({ props }) => {
    const field = useStateField<string>(props.name, props.value);
    const streaming = useIsStreaming();
    return (
      <Select
        value={(field.value as string | undefined) || undefined}
        disabled={streaming}
        onValueChange={(next) => field.setValue(next)}
      >
        <SelectTrigger aria-label={props.name}>
          <SelectValue placeholder={props.placeholder ?? "Select…"} />
        </SelectTrigger>
        <SelectContent>
          {(props.items ?? []).map((item) => (
            <KitSelectItem key={item.value} value={item.value}>
              {item.label}
            </KitSelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
});

/** CheckBox → kit Checkbox + label. */
export const CheckBoxField = defineComponent({
  name: "CheckBox",
  description: "A single boolean checkbox with an inline label.",
  props: z.object({
    name: z.string(),
    label: z.string(),
    checked: z.boolean().optional(),
  }),
  component: ({ props }) => {
    const field = useStateField<boolean>(props.name, props.checked);
    const streaming = useIsStreaming();
    const id = useId();
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={Boolean(field.value)}
          disabled={streaming}
          onCheckedChange={(next) => field.setValue(next === true)}
        />
        <Label htmlFor={id}>{props.label}</Label>
      </div>
    );
  },
});

/** Slider → kit Slider. */
export const SliderField = defineComponent({
  name: "Slider",
  description: "A numeric range slider. Use inside FormControl.",
  props: z.object({
    name: z.string(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    value: z.number().optional(),
  }),
  component: ({ props }) => {
    const field = useStateField<number>(props.name, props.value ?? props.min ?? 0);
    const streaming = useIsStreaming();
    return (
      <Slider
        aria-label={props.name}
        min={props.min ?? 0}
        max={props.max ?? 100}
        step={props.step ?? 1}
        disabled={streaming}
        value={[Number(field.value ?? props.min ?? 0)]}
        onValueChange={(next) => {
          if (next[0] !== undefined) {
            field.setValue(next[0]);
          }
        }}
      />
    );
  },
});

/** DateInput → kit DatePicker (ISO yyyy-MM-dd). */
export const DateField = defineComponent({
  name: "DateInput",
  description: "A date picker. Stores an ISO yyyy-MM-dd string. Use inside FormControl.",
  props: z.object({
    name: z.string(),
    value: z.string().optional(),
  }),
  component: ({ props }) => {
    const field = useStateField<string>(props.name, props.value);
    const streaming = useIsStreaming();
    const raw = field.value as string | undefined;
    let dateValue: Date | undefined;
    if (raw) {
      const parsed = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw);
      if (!Number.isNaN(parsed.getTime())) {
        dateValue = parsed;
      }
    }
    return (
      <DatePicker
        aria-label={props.name}
        value={dateValue}
        disabled={streaming}
        onValueChange={(next) => {
          field.setValue(next ? next.toISOString().slice(0, 10) : "");
        }}
      />
    );
  },
});

const fieldUnion = z.union([
  InputField.ref,
  TextAreaField.ref,
  SelectField.ref,
  CheckBoxField.ref,
  SliderField.ref,
  DateField.ref,
]);

/** FormControl → kit Field wrapper (label + control + hint). */
export const FormControl = defineComponent({
  name: "FormControl",
  description:
    "A labelled form field wrapper. `field` is one Input/TextArea/Select/CheckBox/Slider/DateInput.",
  props: z.object({
    label: z.string(),
    field: fieldUnion,
    hint: z.string().optional(),
  }),
  component: ({ props, renderNode }) => (
    <Field>
      <FieldLabel>{props.label}</FieldLabel>
      <FieldControl asChild>{renderNode(props.field) as ReactNode}</FieldControl>
      {props.hint ? <FieldDescription>{props.hint}</FieldDescription> : null}
    </Field>
  ),
});

/** Button → kit Button that fires a chat action. */
export const Button_ = defineComponent({
  name: "Button",
  description:
    "A clickable button. Clicking sends `message` (or the label) back to the assistant as the user's intent.",
  props: z.object({
    label: z.string(),
    message: z
      .string()
      .optional()
      .describe("Text sent to the assistant on click. Defaults to label."),
    variant: z.enum(["default", "secondary", "outline", "ghost", "destructive"]).optional(),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    const streaming = useIsStreaming();
    return (
      <Button
        type="button"
        variant={props.variant ?? "default"}
        disabled={streaming}
        onClick={() => triggerAction(props.message ?? props.label)}
      >
        {props.label}
      </Button>
    );
  },
});

/** Buttons → a row/column of Button. */
export const Buttons = defineComponent({
  name: "Buttons",
  description: "A group of Buttons laid out in a row or column.",
  props: z.object({
    items: z.array(Button_.ref),
    direction: z.enum(["row", "column"]).optional(),
  }),
  component: ({ props, renderNode }) => (
    <div
      className={cn(
        "flex gap-2",
        (props.direction ?? "row") === "column" ? "flex-col" : "flex-row flex-wrap",
      )}
    >
      {renderNode(props.items) as ReactNode}
    </div>
  ),
});

/** Form → kit Field layout grouping controls + buttons. */
export const Form = defineComponent({
  name: "Form",
  description:
    "A form container. `controls` are FormControl fields; `actions` are Buttons. Never nest a Form in a Form.",
  props: z.object({
    name: z.string(),
    controls: z.array(FormControl.ref),
    actions: z.array(Button_.ref).optional(),
  }),
  component: ({ props, renderNode }) => (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
      aria-label={props.name}
    >
      {renderNode(props.controls) as ReactNode}
      {props.actions && props.actions.length > 0 ? (
        <div className="flex flex-wrap justify-end gap-2">
          {renderNode(props.actions) as ReactNode}
        </div>
      ) : null}
    </form>
  ),
});

// ── Layout containers (may nest, so children unions are lazy) ────────────────

/**
 * Union of everything that can appear as a block child of a container. Typed as
 * `z.ZodType` to break the recursive-inference cycle (Stack/Card contain blocks,
 * blocks include Stack/Card). Evaluated lazily so forward refs resolve.
 */
const blockChild: z.ZodType = z.lazy(() =>
  z.union([
    Text.ref,
    Badge_.ref,
    Alert_.ref,
    Avatar_.ref,
    Metric.ref,
    Chart.ref,
    DataTable_.ref,
    Stepper_.ref,
    Divider.ref,
    Buttons.ref,
    Button_.ref,
    Form.ref,
    Card.ref,
    Stack.ref,
    Tabs_.ref,
  ]),
);

/** Card → bordered kit surface with optional title/description. */
export const Card = defineComponent({
  name: "Card",
  description: "A bordered card surface. Use for grouped content, list items, and result tiles.",
  props: z.object({
    children: z.array(blockChild),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
  component: ({ props, renderNode }) => (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      {props.title ? (
        <div className="flex flex-col gap-1">
          <Typography variant="h4">{props.title}</Typography>
          {props.description ? <Typography variant="muted">{props.description}</Typography> : null}
        </div>
      ) : null}
      {renderNode(props.children) as ReactNode}
    </div>
  ),
});

/** Stack → flex layout container. The required root component. */
export const Stack = defineComponent({
  name: "Stack",
  description:
    "A flexbox layout container. The root of every response must be a Stack. Use direction 'row' + wrap for grids.",
  props: z.object({
    children: z.array(blockChild),
    direction: z.enum(["row", "column"]).optional(),
    gap: gapEnum.optional(),
    align: alignEnum.optional(),
    justify: justifyEnum.optional(),
    wrap: z.boolean().optional(),
  }),
  component: ({ props, renderNode }) => (
    <div
      className={cn(
        "flex w-full",
        (props.direction ?? "column") === "row" ? "flex-row" : "flex-col",
        props.wrap ? "flex-wrap" : "",
        GAP_CLASS[props.gap ?? "md"],
        ALIGN_CLASS[props.align ?? "stretch"],
        JUSTIFY_CLASS[props.justify ?? "start"],
      )}
    >
      {renderNode(props.children) as ReactNode}
    </div>
  ),
});

const tabItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  content: z.array(blockChild),
});

/** Tabs → kit Tabs. `items` are inline tab objects (value/label/content). */
export const Tabs_ = defineComponent({
  name: "Tabs",
  description:
    "A tabbed panel. `items` is an array of { value, label, content } where content is an array of blocks.",
  props: z.object({
    items: z.array(tabItemSchema),
  }),
  component: ({ props, renderNode }) => {
    const items = props.items ?? [];
    const defaultValue = items[0]?.value;
    return (
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList>
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {renderNode(item.content) as ReactNode}
          </TabsContent>
        ))}
      </Tabs>
    );
  },
});

/**
 * The kit-native OpenUI Lang library. Pass to `Renderer` / `KitOpenUIRenderer`
 * on the client and to prompt generation on the backend.
 */
export const kitOpenUILibrary = createLibrary({
  root: "Stack",
  components: [
    Stack,
    Card,
    Text,
    Badge_,
    Alert_,
    Avatar_,
    Metric,
    Divider,
    Chart,
    DataTable_,
    Stepper_,
    Tabs_,
    Form,
    FormControl,
    InputField,
    TextAreaField,
    SelectField,
    CheckBoxField,
    SliderField,
    DateField,
    Button_,
    Buttons,
  ],
  componentGroups: [
    {
      name: "Layout",
      components: ["Stack", "Card", "Divider", "Tabs"],
      notes: [
        "- Every response must start with `root = Stack(...)`.",
        '- Use Stack(direction: "row", wrap: true) for grid-like / side-by-side layouts.',
        "- Card groups related content (list items, result tiles, KPI+chart blocks).",
      ],
    },
    {
      name: "Content",
      components: ["Text", "Badge", "Alert", "Avatar", "Metric"],
      notes: [
        "- Use Text for all copy; pick a variant (h2/h3 for titles, p for body, muted for captions).",
        "- Metric is for a single KPI number; group several in a Stack row.",
      ],
    },
    {
      name: "Data",
      components: ["Chart", "DataTable", "Stepper"],
      notes: [
        "- Chart for trends/comparisons (bar/line/area); DataTable for row detail.",
        "- Stepper shows workflow/approval progress; set `value` to the current step id.",
      ],
    },
    {
      name: "Forms",
      components: [
        "Form",
        "FormControl",
        "Input",
        "TextArea",
        "Select",
        "CheckBox",
        "Slider",
        "DateInput",
        "Button",
        "Buttons",
      ],
      notes: [
        "- Define EACH FormControl and field as its own statement for progressive streaming.",
        "- Every field needs a unique `name`.",
        "- Buttons send their label (or `message`) back to the assistant on click.",
        "- NEVER nest a Form inside a Form.",
      ],
    },
  ],
});

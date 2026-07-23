import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
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
import { Field, FieldControl, FieldDescription, FieldLabel } from "../field";
import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSearch,
  SelectSearchContent,
  SelectSearchEmpty,
  SelectSearchInput,
  SelectSearchItem,
  SelectSearchList,
  SelectSearchLoading,
  SelectSearchTrigger,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from ".";
import { VirtualizedSelectContent } from "./select-virtualized";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
];

const asyncUsers = [
  { value: "ada", label: "Ada Lovelace" },
  { value: "grace", label: "Grace Hopper" },
  { value: "alan", label: "Alan Turing" },
];

const fruitLabels = Object.fromEntries(fruits.map((fruit) => [fruit.value, fruit.label]));

const manyOptions = Array.from({ length: 500 }, (_, index) => ({
  value: String(index + 1),
  label: `Option ${index + 1}`,
}));

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  subcomponents: {
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectSearch,
    SelectSearchTrigger,
    SelectSearchContent,
    SelectSearchInput,
    SelectSearchList,
    SelectSearchItem,
    SelectSearchEmpty,
    SelectSearchLoading,
  },
  ...defineComponentStories(
    "List select for standard dropdowns, SelectSearch for filterable single/multi-select, and VirtualizedSelectContent for large option sets.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Trigger height preset.",
        defaultValue: "default",
      }),
      placeholder: textArg({
        description: "Placeholder shown when no value is selected.",
        defaultValue: "Select a fruit",
      }),
      defaultValue: choiceArg(["apple", "banana", "orange"] as const, {
        description: "Initial selected value for uncontrolled usage.",
        defaultValue: "apple",
      }),
      disabled: sharedArgTypes.disabled,
      loading: sharedArgTypes.loading,
      invalid: sharedArgTypes.invalid,
      required: booleanArg({
        description: "Marks the select as required for form validation.",
        defaultValue: false,
      }),
      defaultOpen: booleanArg({
        description: "Initial open state for uncontrolled usage.",
        defaultValue: false,
      }),
    },
    ["onValueChange"],
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

type SelectPlaygroundArgs = {
  size?: "sm" | "default" | "lg";
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  loading?: boolean;
  invalid?: boolean;
  required?: boolean;
  defaultOpen?: boolean;
};

export const Default: Story = playgroundStory({
  actions: ["onValueChange"],
  args: {
    defaultValue: "apple",
    size: "default",
    placeholder: "Select a fruit",
    loading: false,
    disabled: false,
    invalid: false,
  },
  render: ({ size, placeholder, loading, invalid, ...args }: SelectPlaygroundArgs) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="fruit">Fruit</Label>
      <Select {...args}>
        <SelectTrigger
          id="fruit"
          size={size}
          loading={loading}
          invalid={invalid}
          aria-label="Fruit"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox", { name: /fruit/i }));
    const portalQueries = portal();
    await userEvent.click(portalQueries.getByRole("option", { name: /banana/i }));
    await expect(storyAction(args, "onValueChange")).toHaveBeenCalledWith("banana");
  },
});

export const InContext: Story = {
  ...storyDoc("Fruit picker inside a Field with label and helper text."),
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="context-fruit">Favorite fruit</FieldLabel>
      <FieldControl asChild>
        <Select defaultValue="apple">
          <SelectTrigger id="context-fruit" aria-label="Favorite fruit">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
      </FieldControl>
      <FieldDescription>Choose the fruit you eat most often.</FieldDescription>
    </Field>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Select defaultValue="apple">
        <SelectTrigger size="sm" aria-label="Small fruit select">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="apple">
        <SelectTrigger aria-label="Default fruit select">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="apple">
        <SelectTrigger size="lg" aria-label="Large fruit select">
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Select defaultValue="apple">
        <SelectTrigger aria-label="Default state select">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="apple">
        <SelectTrigger invalid aria-label="Invalid select">
          <SelectValue placeholder="Invalid" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
      <Select disabled defaultValue="apple">
        <SelectTrigger aria-label="Disabled select">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  ...storyDoc("Grouped options with labels and separators for long lists."),
  render: () => (
    <Select defaultValue="apple">
      <SelectTrigger aria-label="Food select">
        <SelectValue placeholder="Select food" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Virtualized: Story = {
  ...storyDoc("Large option lists rendered with virtual scrolling for performance."),
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="w-[200px]" aria-label="Large list">
        <SelectValue placeholder="Pick option" />
      </SelectTrigger>
      <VirtualizedSelectContent items={manyOptions} />
    </Select>
  ),
};

type SelectSearchPlaygroundArgs = {
  size?: "sm" | "default" | "lg";
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  defaultOpen?: boolean;
  maxBadges?: number;
  overflowPosition?: "start" | "end";
  overflowTooltip?: boolean;
};

export const Searchable: Story = playgroundStory({
  args: {
    defaultOpen: false,
    multiple: false,
    loading: false,
    disabled: false,
    size: "default",
    placeholder: "Select fruit",
    maxBadges: 2,
    overflowPosition: "end",
    overflowTooltip: true,
  },
  render: function SearchableStory({
    size,
    placeholder,
    disabled,
    multiple = false,
    loading,
    defaultOpen,
    maxBadges = 2,
    overflowPosition = "end",
    overflowTooltip = true,
  }: SelectSearchPlaygroundArgs) {
    const [singleValue, setSingleValue] = useState("apple");
    const [multiValue, setMultiValue] = useState<string[]>(["apple"]);

    const trigger = (
      <SelectSearchTrigger
        size={size}
        disabled={disabled}
        aria-label="Select fruit"
        placeholder={placeholder}
        maxBadges={maxBadges}
        overflowPosition={overflowPosition}
        overflowTooltip={overflowTooltip}
        getBadgeLabel={(value) => fruitLabels[value] ?? value}
      />
    );

    const content = (
      <SelectSearchContent>
        <SelectSearchInput placeholder="Search fruits..." />
        <SelectSearchList>
          <SelectSearchEmpty>No fruit found.</SelectSearchEmpty>
          {fruits.map((fruit) => (
            <SelectSearchItem key={fruit.value} value={fruit.value}>
              {fruit.label}
            </SelectSearchItem>
          ))}
        </SelectSearchList>
      </SelectSearchContent>
    );

    return (
      <Field className="max-w-sm">
        <FieldLabel>Fruit</FieldLabel>
        <FieldControl asChild>
          {multiple ? (
            <SelectSearch
              multiple
              defaultOpen={defaultOpen}
              loading={loading}
              value={multiValue}
              onValueChange={setMultiValue}
            >
              {trigger}
              {content}
            </SelectSearch>
          ) : (
            <SelectSearch
              defaultOpen={defaultOpen}
              loading={loading}
              value={singleValue}
              onValueChange={setSingleValue}
            >
              {trigger}
              {content}
            </SelectSearch>
          )}
        </FieldControl>
        <FieldDescription>Filterable select with optional multi-select.</FieldDescription>
      </Field>
    );
  },
});

export const SearchableMultiSelect: Story = {
  ...storyDoc("Multiple values with badge overflow and +N indicator."),
  render: function SearchableMultiSelectStory() {
    const [values, setValues] = useState<string[]>(["apple", "banana", "orange"]);

    return (
      <SelectSearch multiple value={values} onValueChange={setValues}>
        <SelectSearchTrigger
          aria-label="Select fruits"
          placeholder="Select fruits"
          maxBadges={2}
          getBadgeLabel={(value) => fruitLabels[value] ?? value}
        />
        <SelectSearchContent>
          <SelectSearchInput placeholder="Search..." />
          <SelectSearchList>
            {fruits.map((fruit) => (
              <SelectSearchItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectSearchItem>
            ))}
          </SelectSearchList>
        </SelectSearchContent>
      </SelectSearch>
    );
  },
};

export const SearchableAsync: Story = {
  ...storyDoc("Server-filtered options with loading state — set shouldFilter={false}."),
  render: function SearchableAsyncStory() {
    const allUsers = asyncUsers;
    const [value, setValue] = useState<string>();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(allUsers);

    useEffect(() => {
      setLoading(true);
      const timer = window.setTimeout(() => {
        const query = search.trim().toLowerCase();
        setOptions(
          query ? allUsers.filter((user) => user.label.toLowerCase().includes(query)) : allUsers,
        );
        setLoading(false);
      }, 400);
      return () => window.clearTimeout(timer);
    }, [search]);

    return (
      <SelectSearch
        value={value}
        onValueChange={setValue}
        loading={loading}
        onSearchChange={setSearch}
      >
        <SelectSearchTrigger aria-label="Assignee" placeholder="Search assignees" />
        <SelectSearchContent shouldFilter={false}>
          <SelectSearchInput placeholder="Type to search..." />
          <SelectSearchList>
            <SelectSearchLoading />
            {!loading && options.length === 0 ? (
              <SelectSearchEmpty>No users found.</SelectSearchEmpty>
            ) : null}
            {options.map((user) => (
              <SelectSearchItem key={user.value} value={user.value}>
                {user.label}
              </SelectSearchItem>
            ))}
          </SelectSearchList>
        </SelectSearchContent>
      </SelectSearch>
    );
  },
};

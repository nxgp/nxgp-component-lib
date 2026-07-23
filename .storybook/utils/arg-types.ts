import type { ArgTypes } from "@storybook/react";

type EnumArgOptions = {
  description: string;
  defaultValue?: string;
  tableType?: string;
};

type BooleanArgOptions = {
  description: string;
  defaultValue?: boolean;
};

type TextArgOptions = {
  description: string;
  defaultValue?: string;
};

/** Build a radio control for small option sets. */
export function radioArg<const T extends string>(
  options: readonly T[],
  { description, defaultValue, tableType }: EnumArgOptions,
) {
  return {
    control: "inline-radio" as const,
    options: [...options],
    description,
    ...(defaultValue !== undefined && { defaultValue }),
    table: {
      type: { summary: tableType ?? options.map((option) => `"${option}"`).join(" | ") },
      ...(defaultValue !== undefined && { defaultValue: { summary: defaultValue } }),
    },
  };
}

/** Build a select control with docs table metadata. */
export function enumArg<const T extends string>(
  options: readonly T[],
  { description, defaultValue, tableType }: EnumArgOptions,
) {
  return {
    control: "select" as const,
    options: [...options],
    description,
    ...(defaultValue !== undefined && { defaultValue }),
    table: {
      type: { summary: tableType ?? options.map((option) => `"${option}"`).join(" | ") },
      ...(defaultValue !== undefined && { defaultValue: { summary: defaultValue } }),
    },
  };
}

/** Build a boolean control with docs table metadata. */
export function booleanArg({ description, defaultValue }: BooleanArgOptions) {
  return {
    control: "boolean" as const,
    description,
    ...(defaultValue !== undefined && { defaultValue }),
    table: {
      type: { summary: "boolean" },
      ...(defaultValue !== undefined && { defaultValue: { summary: String(defaultValue) } }),
    },
  };
}

/** Build a text control with docs table metadata. */
export function textArg({ description, defaultValue }: TextArgOptions) {
  return {
    control: "text" as const,
    description,
    ...(defaultValue !== undefined && { defaultValue }),
    table: { type: { summary: "string" } },
  };
}

/** Build a number/range control with docs table metadata. */
export function numberArg(
  description: string,
  { min, max, step }: { min?: number; max?: number; step?: number } = {},
) {
  return {
    control: { type: "number" as const, min, max, step },
    description,
    table: { type: { summary: "number" } },
  };
}

/** Keys from component argTypes to show in the Default story Controls panel. */
export function playgroundControlKeys(argTypes: ArgTypes): string[] {
  return Object.entries(argTypes)
    .filter(([, config]) => {
      if (!config || config.control === false) return false;
      if (config.table && "disable" in config.table && config.table.disable) return false;
      return true;
    })
    .map(([key]) => key);
}

/** Docs + Controls panel scoped to the props defined for this component. */
export function storyParameters(description: string, componentArgTypes: ArgTypes) {
  return {
    ...componentDocs(description),
    controls: {
      expanded: true,
      sort: "requiredFirst" as const,
      include: playgroundControlKeys(componentArgTypes),
    },
  };
}

/** Pick enum control by option count — inline-radio for small sets, select for larger. */
export function choiceArg<const T extends string>(options: readonly T[], config: EnumArgOptions) {
  return options.length <= 4 ? radioArg(options, config) : enumArg(options, config);
}

/** Build a range slider control for bounded numeric props. */
export function rangeArg(
  description: string,
  {
    min,
    max,
    step = 1,
    defaultValue,
  }: { min: number; max: number; step?: number; defaultValue?: number },
) {
  return {
    control: { type: "range" as const, min, max, step },
    description,
    ...(defaultValue !== undefined && { defaultValue }),
    table: {
      type: { summary: "number" },
      ...(defaultValue !== undefined && { defaultValue: { summary: String(defaultValue) } }),
    },
  };
}

/** Hide props that are not useful in Storybook controls. */
export function hiddenArg(description?: string) {
  return {
    table: { disable: true },
    control: false as const,
    ...(description && { description }),
  };
}

/** Log an event handler to the Actions panel (use with `fn()` in story args). */
export function actionArg(description?: string) {
  return {
    action: description ?? true,
    control: false as const,
    table: { disable: true },
  };
}

/** Action argTypes for common event props — pair with `actions: [...]` in playgroundStory. */
export function actionArgTypes(...keys: string[]): ArgTypes {
  return Object.fromEntries(keys.map((key) => [key, actionArg()]));
}

/** Merge action argTypes into component meta argTypes. */
export function withActionArgTypes(argTypes: ArgTypes, ...actionKeys: string[]): ArgTypes {
  return { ...argTypes, ...actionArgTypes(...actionKeys) };
}

/** Standard props to hide across components. */
export const hideStandardProps: ArgTypes = {
  className: hiddenArg("Additional CSS classes merged onto the root element."),
  style: hiddenArg(),
  ref: hiddenArg(),
  key: hiddenArg(),
  as: hiddenArg(),
  asChild: hiddenArg(
    "Radix Slot composition — use dedicated AsChild stories; unsafe in generic playgrounds.",
  ),
  value: hiddenArg("Controlled value — use interaction stories or wire explicitly in argTypes."),
  onValueChange: hiddenArg("Change handler — hidden from generic playgrounds."),
  id: hiddenArg("Element id — rarely needed in playground previews."),
  children: hiddenArg("React children — set in the story render, not via Controls."),
  defaultValue: hiddenArg("Initial value — expose explicitly when meaningful in Controls."),
  defaultChecked: hiddenArg("Initial checked state — expose explicitly when meaningful."),
  defaultOpen: hiddenArg("Initial open state — expose explicitly for overlays."),
  open: hiddenArg("Controlled open state — expose explicitly for overlays."),
  onOpenChange: hiddenArg("Open change handler."),
  onClick: hiddenArg(),
  onChange: hiddenArg(),
  onBlur: hiddenArg(),
  onFocus: hiddenArg(),
  name: hiddenArg(),
  form: hiddenArg(),
  autoFocus: hiddenArg(),
  tabIndex: hiddenArg(),
  role: hiddenArg(),
  type: hiddenArg("Native input type — expose explicitly for input components."),
};

/** Shared CVA and behavioral prop argTypes used across the library. */
export const sharedArgTypes = {
  asChild: booleanArg({
    description:
      "Merge props onto the child element instead of rendering the default DOM node (Radix Slot).",
    defaultValue: false,
  }),

  variant: (options: readonly string[], description: string, defaultValue?: string) =>
    enumArg(options, { description, defaultValue }),

  size: (options: readonly string[], description: string, defaultValue?: string) =>
    enumArg(options, { description, defaultValue }),

  disabled: booleanArg({
    description: "Disables interaction and applies muted styling.",
    defaultValue: false,
  }),

  invalid: booleanArg({
    description: "Applies error styling for failed validation.",
    defaultValue: false,
  }),

  loading: booleanArg({
    description: "Shows a loading indicator and prevents interaction.",
    defaultValue: false,
  }),

  fullWidth: booleanArg({
    description: "Stretches the component to fill the container width.",
    defaultValue: false,
  }),

  orientation: (options: readonly string[], description: string, defaultValue?: string) =>
    enumArg(options, { description, defaultValue }),

  // Button
  buttonVariant: () =>
    enumArg(["default", "destructive", "outline", "secondary", "ghost", "link"] as const, {
      description: "Visual style preset for the button surface and emphasis.",
      defaultValue: "default",
    }),

  buttonSize: () =>
    enumArg(
      [
        "default",
        "comfortable",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ] as const,
      {
        description:
          "Height and padding preset. Icon sizes are square controls meant for icon-only buttons.",
        defaultValue: "default",
      },
    ),

  loadingLabel: textArg({
    description: "Accessible label announced while `loading` is true.",
    defaultValue: "Loading",
  }),

  // Badge
  dot: booleanArg({
    description: "Renders a status dot before the label.",
    defaultValue: false,
  }),

  // Dialog / Drawer
  dialogSize: () =>
    enumArg(["sm", "default", "lg", "xl", "full"] as const, {
      description: "Maximum width preset for dialog content.",
      defaultValue: "default",
    }),

  resizable: booleanArg({
    description: "When true, shows a border dome handle for drag-resizing along the open axis.",
    defaultValue: false,
  }),

  drawerSize: () =>
    enumArg(["default", "sm", "lg", "xl", "full"] as const, {
      description: "Width or max-height preset along the drawer axis.",
      defaultValue: "default",
    }),

  showCloseButton: booleanArg({
    description: "When false, the built-in close button is not rendered.",
    defaultValue: true,
  }),

  // Alert
  alertVariant: () =>
    enumArg(["default", "destructive", "success", "warning", "info"] as const, {
      description: "Semantic tone for border, background, and title color.",
      defaultValue: "default",
    }),

  // Separator / Stepper / Carousel
  horizontalVertical: () =>
    enumArg(["horizontal", "vertical"] as const, {
      description: "Layout axis for the component.",
      defaultValue: "horizontal",
    }),

  // Toast
  closeButton: booleanArg({
    description: "Shows a dismiss button on each toast.",
    defaultValue: true,
  }),

  richColors: booleanArg({
    description: "Uses semantic colors for success, error, warning, and info toasts.",
    defaultValue: true,
  }),

  // Separator decorative
  decorative: booleanArg({
    description: "When true, the separator is purely visual (no landmark role).",
    defaultValue: true,
  }),
} satisfies Record<string, unknown>;

/** Merge shared hidden props with component-specific argTypes. */
export function defineArgTypes(argTypes: ArgTypes, actionKeys?: string[]): ArgTypes {
  return {
    ...hideStandardProps,
    ...argTypes,
    ...(actionKeys ? actionArgTypes(...actionKeys) : {}),
  };
}

/** ArgTypes + docs parameters scoped to the same public props. */
export function defineComponentStories(
  description: string,
  componentArgTypes: ArgTypes,
  actionKeys?: string[],
) {
  const argTypes = defineArgTypes(componentArgTypes, actionKeys);
  return {
    argTypes,
    parameters: storyParameters(description, argTypes),
  };
}

/** Standard docs parameters for a component page. */
export function componentDocs(description: string) {
  return {
    docs: {
      description: {
        component: description,
      },
      controls: {
        expanded: true,
        sort: "requiredFirst" as const,
      },
    },
  };
}

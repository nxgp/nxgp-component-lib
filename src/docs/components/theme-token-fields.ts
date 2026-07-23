/** Semantic token keys editable in the Theme Playground. */
export type ThemeTokenKey =
  | "background"
  | "foreground"
  | "muted"
  | "mutedForeground"
  | "border"
  | "accent"
  | "accentForeground"
  | "primary"
  | "primaryForeground"
  | "destructive"
  | "destructiveForeground"
  | "ring"
  | "chrome"
  | "popover"
  | "popoverForeground"
  | "chart1"
  | "chart2"
  | "chart3"
  | "chart4"
  | "chart5";

export type ThemeTokenField = {
  key: ThemeTokenKey;
  label: string;
  cssVar: string;
  hint: string;
};

export type ThemeTokenGroup = {
  id: string;
  label: string;
  description: string;
  fields: ThemeTokenField[];
};

/** Maps playground fields to `--app-*` semantic variables. */
export const THEME_TOKEN_GROUPS: ThemeTokenGroup[] = [
  {
    id: "surfaces",
    label: "Surfaces",
    description: "Page background, text hierarchy, and borders.",
    fields: [
      {
        key: "background",
        label: "Background",
        cssVar: "--app-bg",
        hint: "Page and panel backgrounds",
      },
      {
        key: "foreground",
        label: "Foreground",
        cssVar: "--app-fg",
        hint: "Headings, body text, icons",
      },
      {
        key: "muted",
        label: "Muted",
        cssVar: "--app-muted",
        hint: "Subtle fills, secondary surfaces",
      },
      {
        key: "mutedForeground",
        label: "Muted text",
        cssVar: "--app-muted-fg",
        hint: "Helper text, placeholders, meta labels",
      },
      {
        key: "border",
        label: "Border",
        cssVar: "--app-border",
        hint: "Input, card, and table borders",
      },
      {
        key: "accent",
        label: "Accent",
        cssVar: "--app-accent",
        hint: "Hover rows, selected nav items",
      },
      {
        key: "accentForeground",
        label: "Accent text",
        cssVar: "--app-accent-fg",
        hint: "Text on accent surfaces",
      },
    ],
  },
  {
    id: "brand",
    label: "Brand & feedback",
    description: "Primary actions, focus ring, and destructive states.",
    fields: [
      {
        key: "primary",
        label: "Primary",
        cssVar: "--app-primary",
        hint: "Primary buttons, links, active badges",
      },
      {
        key: "primaryForeground",
        label: "On primary",
        cssVar: "--app-primary-fg",
        hint: "Text and icons on primary buttons",
      },
      {
        key: "destructive",
        label: "Destructive",
        cssVar: "--app-destructive",
        hint: "Delete and error actions",
      },
      {
        key: "destructiveForeground",
        label: "On destructive",
        cssVar: "--app-destructive-fg",
        hint: "Text on destructive buttons",
      },
      {
        key: "ring",
        label: "Focus ring",
        cssVar: "--app-ring",
        hint: "Focus outline on inputs and buttons",
      },
    ],
  },
  {
    id: "chrome",
    label: "Chrome & overlays",
    description: "Sidebar, popovers, and elevated surfaces.",
    fields: [
      {
        key: "chrome",
        label: "Chrome",
        cssVar: "--app-chrome",
        hint: "Sidebar and app shell background",
      },
      {
        key: "popover",
        label: "Popover",
        cssVar: "--app-popover",
        hint: "Popover and dropdown backgrounds",
      },
      {
        key: "popoverForeground",
        label: "Popover text",
        cssVar: "--app-popover-fg",
        hint: "Text inside popovers and menus",
      },
    ],
  },
  {
    id: "charts",
    label: "Charts",
    description: "Series palette for @nxgp/component-lib/charts (maps to --color-chart-*).",
    fields: [
      {
        key: "chart1",
        label: "Series 1",
        cssVar: "--app-chart-1",
        hint: "First chart series color",
      },
      {
        key: "chart2",
        label: "Series 2",
        cssVar: "--app-chart-2",
        hint: "Second chart series color",
      },
      {
        key: "chart3",
        label: "Series 3",
        cssVar: "--app-chart-3",
        hint: "Third chart series color",
      },
      {
        key: "chart4",
        label: "Series 4",
        cssVar: "--app-chart-4",
        hint: "Fourth chart series color",
      },
      {
        key: "chart5",
        label: "Series 5",
        cssVar: "--app-chart-5",
        hint: "Fifth chart series color",
      },
    ],
  },
];

/** Flat list of all editable token fields. */
export const THEME_TOKEN_FIELDS: ThemeTokenField[] = THEME_TOKEN_GROUPS.flatMap(
  (group) => group.fields,
);

export const DEFAULT_PLAYGROUND_THEME_ID = "my-theme";

/** WCAG AA minimum contrast ratio for normal text. */
export const WCAG_AA_CONTRAST_RATIO = 4.5;

export type ContrastPair = {
  foreground: ThemeTokenKey;
  background: ThemeTokenKey;
};

/** Foreground/background pairs checked for readable contrast. */
export const CONTRAST_PAIRS: ContrastPair[] = [
  { foreground: "foreground", background: "background" },
  { foreground: "primaryForeground", background: "primary" },
  { foreground: "destructiveForeground", background: "destructive" },
  { foreground: "accentForeground", background: "accent" },
  { foreground: "popoverForeground", background: "popover" },
  { foreground: "mutedForeground", background: "muted" },
];

export type LowContrastWarning = {
  foreground: ThemeTokenKey;
  background: ThemeTokenKey;
  ratio: number;
};

export type ThemePreset = {
  id: string;
  label: string;
  description: string;
};

/** Built-in themes consumers can load as a starting point. */
export const THEME_PRESETS: ThemePreset[] = [
  { id: "light-default", label: "Light", description: "Default light palette" },
  { id: "light-warm", label: "Warm", description: "Warm accent light theme" },
  { id: "light-sage", label: "Sage", description: "Calm sage neutrals with emerald accent" },
  { id: "dark-default", label: "Dark", description: "Standard dark mode" },
  { id: "dark-midnight", label: "Midnight", description: "Higher contrast indigo dark" },
  { id: "dark-violet", label: "Violet", description: "Modern violet dev-tool dark palette" },
];

/**
 * Builds a paste-ready theme CSS block for `[data-theme]`.
 */
export function buildThemeCss(
  themeId: string,
  values: Partial<Record<ThemeTokenKey, string>>,
  radiusId: RadiusOptionId = DEFAULT_RADIUS_ID,
): string {
  const lines = THEME_TOKEN_FIELDS.flatMap((field) => {
    const value = values[field.key];
    return value ? [`  ${field.cssVar}: ${value};`] : [];
  });

  if (radiusId !== DEFAULT_RADIUS_ID) {
    const radiusVars = getRadiusStyleVars(radiusId);
    for (const [cssVar, value] of Object.entries(radiusVars)) {
      lines.push(`  ${cssVar}: ${value};`);
    }
  }

  if (lines.length === 0) {
    return `/* Add at least one token value to export a theme */\n[data-theme="${themeId}"] {\n}\n`;
  }

  return `[data-theme="${themeId}"] {\n${lines.join("\n")}\n}\n`;
}

/**
 * Reads semantic token values from the document root (raw CSS values).
 */
export function readTokenDefaults(root: HTMLElement): Record<ThemeTokenKey, string> {
  const styles = getComputedStyle(root);
  return THEME_TOKEN_FIELDS.reduce(
    (accumulator, field) => {
      accumulator[field.key] = styles.getPropertyValue(field.cssVar).trim();
      return accumulator;
    },
    {} as Record<ThemeTokenKey, string>,
  );
}

/**
 * Reads resolved sRGB hex values for each token — used for visible swatches and presets.
 */
export function readResolvedTokenDefaults(root: HTMLElement): Record<ThemeTokenKey, string> {
  if (typeof document === "undefined") {
    return {} as Record<ThemeTokenKey, string>;
  }

  const probe = document.createElement("div");
  probe.style.display = "none";
  root.appendChild(probe);

  const resolved = THEME_TOKEN_FIELDS.reduce(
    (accumulator, field) => {
      probe.style.backgroundColor = `var(${field.cssVar})`;
      const computed = getComputedStyle(probe).backgroundColor;
      const resolvedHex = rgbStringToHex(computed);
      if (resolvedHex) {
        accumulator[field.key] = resolvedHex;
        return accumulator;
      }

      const fallback = readTokenDefaults(root)[field.key];
      if (!fallback) {
        accumulator[field.key] = "";
        return accumulator;
      }

      const fallbackRgb = resolveCssColorToRgb(fallback);
      accumulator[field.key] = fallbackRgb ? rgbToHexColor(fallbackRgb) : fallback;
      return accumulator;
    },
    {} as Record<ThemeTokenKey, string>,
  );

  root.removeChild(probe);
  return resolved;
}

/**
 * Snapshots resolved token values for a built-in theme without mutating `<html>`.
 */
export function readPresetTokens(presetId: string): Record<ThemeTokenKey, string> {
  if (typeof document === "undefined") {
    return {} as Record<ThemeTokenKey, string>;
  }

  const host = document.createElement("div");
  host.setAttribute("data-theme", presetId);
  if (presetId.startsWith("dark")) {
    host.classList.add("dark");
  }
  Object.assign(host.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
  });
  document.body.appendChild(host);

  const values = readResolvedTokenDefaults(host);
  host.remove();

  return values;
}

/** Tokens surfaced in the quick-color section of the theme panel. */
export const QUICK_COLOR_KEYS: ThemeTokenKey[] = [
  "primary",
  "destructive",
  "background",
  "foreground",
];

/** Appearance presets for the Light/Dark segmented control. */
export const APPEARANCE_PRESETS = [
  { id: "light-default", label: "Light" },
  { id: "dark-default", label: "Dark" },
] as const;

export type AccentSwatch = {
  id: string;
  label: string;
  value: string;
};

/** Named accent palette mapped to primitive tokens. */
export const ACCENT_SWATCHES: AccentSwatch[] = [
  { id: "blue", label: "Blue", value: "var(--primitive-blue-500)" },
  { id: "indigo", label: "Indigo", value: "var(--primitive-indigo-500)" },
  { id: "teal", label: "Teal", value: "var(--primitive-teal-500)" },
  { id: "amber", label: "Amber", value: "var(--primitive-amber-500)" },
  { id: "red", label: "Red", value: "var(--primitive-red-500)" },
  { id: "blue-light", label: "Sky", value: "var(--primitive-blue-400)" },
  { id: "indigo-light", label: "Violet", value: "var(--primitive-indigo-400)" },
  { id: "teal-light", label: "Mint", value: "var(--primitive-teal-400)" },
  { id: "amber-dark", label: "Gold", value: "var(--primitive-amber-600)" },
  { id: "red-dark", label: "Crimson", value: "var(--primitive-red-600)" },
  { id: "blue-dark", label: "Navy", value: "var(--primitive-blue-600)" },
  { id: "slate", label: "Slate", value: "var(--primitive-slate-600)" },
];

export type RadiusOptionId = "none" | "small" | "medium" | "large";

export const DEFAULT_RADIUS_ID: RadiusOptionId = "medium";

export type RadiusOption = {
  id: RadiusOptionId;
  label: string;
  vars: Record<string, string>;
};

/** Border radius presets for the theme panel. */
export const RADIUS_OPTIONS: RadiusOption[] = [
  {
    id: "none",
    label: "None",
    vars: {
      "--app-radius-sm": "0",
      "--app-radius-md": "0",
      "--app-radius-lg": "0",
      "--app-radius-overlay": "0",
    },
  },
  {
    id: "small",
    label: "Small",
    vars: {
      "--app-radius-sm": "0.125rem",
      "--app-radius-md": "0.25rem",
      "--app-radius-lg": "0.25rem",
      "--app-radius-overlay": "0.25rem",
    },
  },
  {
    id: "medium",
    label: "Medium",
    vars: {
      "--app-radius-sm": "0.25rem",
      "--app-radius-md": "0.375rem",
      "--app-radius-lg": "0.5rem",
      "--app-radius-overlay": "0.375rem",
    },
  },
  {
    id: "large",
    label: "Large",
    vars: {
      "--app-radius-sm": "0.375rem",
      "--app-radius-md": "0.5rem",
      "--app-radius-lg": "0.75rem",
      "--app-radius-overlay": "0.5rem",
    },
  },
];

/** UI scaling percentages for the preview panel. */
export const SCALING_OPTIONS = [90, 95, 100, 105] as const;

export const DEFAULT_SCALING = 100;

/** Returns CSS variables for the selected radius preset. */
export function getRadiusStyleVars(radiusId: RadiusOptionId): Record<string, string> {
  const option = RADIUS_OPTIONS.find((item) => item.id === radiusId);
  const medium = RADIUS_OPTIONS.find((item) => item.id === "medium");
  return option?.vars ?? medium?.vars ?? {};
}

/**
 * Picks white or black foreground for text on the given accent color.
 */
export function computePrimaryForeground(accentValue: string): string {
  const accentRgb = resolveCssColorToRgb(accentValue);
  if (!accentRgb) {
    return "#ffffff";
  }

  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  const whiteContrast = contrastRatio(white, accentRgb);
  const blackContrast = contrastRatio(black, accentRgb);

  return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
}

type Rgb = { r: number; g: number; b: number };

/**
 * Resolves any CSS color string to sRGB channels via a DOM probe.
 */
export function resolveCssColorToRgb(value: string): Rgb | null {
  if (typeof document === "undefined" || !value.trim()) {
    return null;
  }

  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  probe.style.display = "none";
  document.documentElement.appendChild(probe);
  const resolved = getComputedStyle(probe).backgroundColor;
  document.documentElement.removeChild(probe);

  const match = resolved.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    return null;
  }

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
  };
}

/**
 * WCAG 2.1 relative luminance contrast ratio between two sRGB colors.
 */
export function contrastRatio(foreground: Rgb, background: Rgb): number {
  const luminance = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const fg =
    0.2126 * luminance(foreground.r) +
    0.7152 * luminance(foreground.g) +
    0.0722 * luminance(foreground.b);
  const bg =
    0.2126 * luminance(background.r) +
    0.7152 * luminance(background.g) +
    0.0722 * luminance(background.b);

  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);

  return (lighter + 0.05) / (darker + 0.05);
}

function rgbStringToHex(rgb: string): string | null {
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    return null;
  }

  return `#${[match[1], match[2], match[3]]
    .map((channel) => Number(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * Converts resolved RGB to a hex string for native color inputs.
 */
export function rgbToHexColor(rgb: Rgb): string {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * Returns low-contrast warnings for foreground tokens below WCAG AA.
 */
export function getLowContrastWarnings(
  values: Partial<Record<ThemeTokenKey, string>>,
  minimumRatio = WCAG_AA_CONTRAST_RATIO,
): LowContrastWarning[] {
  return CONTRAST_PAIRS.flatMap((pair) => {
    const foregroundValue = values[pair.foreground];
    const backgroundValue = values[pair.background];

    if (!foregroundValue || !backgroundValue) {
      return [];
    }

    const foregroundRgb = resolveCssColorToRgb(foregroundValue);
    const backgroundRgb = resolveCssColorToRgb(backgroundValue);

    if (!foregroundRgb || !backgroundRgb) {
      return [];
    }

    const ratio = contrastRatio(foregroundRgb, backgroundRgb);

    if (ratio >= minimumRatio) {
      return [];
    }

    return [{ foreground: pair.foreground, background: pair.background, ratio }];
  });
}

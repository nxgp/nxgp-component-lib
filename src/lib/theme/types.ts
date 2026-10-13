/** UI density — compact (default) or comfortable spacing. */
export type Density = "compact" | "comfortable";

/** Light or dark color mode. */
export type ThemeMode = "light" | "dark";

/** Built-in theme identifiers. */
export type ThemeId =
  | "light-default"
  | "light-warm"
  | "light-sage"
  | "kiotel-theme"
  | "dark-default"
  | "dark-midnight"
  | "dark-violet";

/** Theme selection including system preference. */
export type ThemeSetting = ThemeId | "system";

/** Metadata for a registered theme. */
export type ThemeDefinition = {
  id: ThemeId;
  label: string;
  mode: ThemeMode;
};

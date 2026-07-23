import type { ThemeDefinition, ThemeId, ThemeMode, ThemeSetting } from "./types";

/** Default storage key for persisting theme preference. */
export const DEFAULT_STORAGE_KEY = "kit-ui-theme";

/** All built-in themes shipped with the library. */
export const THEMES: readonly ThemeDefinition[] = [
  { id: "light-default", label: "Light Default", mode: "light" },
  { id: "light-warm", label: "Light Warm", mode: "light" },
  { id: "light-sage", label: "Light Sage", mode: "light" },
  { id: "dark-default", label: "Dark Default", mode: "dark" },
  { id: "dark-midnight", label: "Dark Midnight", mode: "dark" },
  { id: "dark-violet", label: "Dark Violet", mode: "dark" },
] as const;

/** Default theme when no preference is stored. */
export const DEFAULT_THEME_ID: ThemeId = "light-default";

/** Resolves system preference to a concrete theme id. */
export function resolveSystemThemeId(prefersDark: boolean): ThemeId {
  return prefersDark ? "dark-default" : "light-default";
}

/** Returns the theme definition for a given id. */
export function getThemeById(id: ThemeId): ThemeDefinition {
  const theme = THEMES.find((t) => t.id === id);
  if (!theme) {
    throw new Error(`Unknown theme id: ${id}`);
  }
  return theme;
}

/** Resolves a theme setting (including system) to a concrete theme id. */
export function resolveThemeId(setting: ThemeSetting, prefersDark: boolean): ThemeId {
  if (setting === "system") {
    return resolveSystemThemeId(prefersDark);
  }
  return setting;
}

/** Returns the color mode for a resolved theme id. */
export function getThemeMode(id: ThemeId): ThemeMode {
  return getThemeById(id).mode;
}

/** Validates a stored theme setting string. */
export function isValidThemeSetting(value: string): value is ThemeSetting {
  return value === "system" || THEMES.some((theme) => theme.id === value);
}

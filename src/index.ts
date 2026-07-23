import type { ClassValue } from "clsx";
import { cn } from "./lib/cn";

export type * from "./components";
export * from "./components";
export type {
  Density,
  ThemeContextValue,
  ThemeDefinition,
  ThemeId,
  ThemeMode,
  ThemeProviderProps,
  ThemeSetting,
} from "./lib/theme";
export {
  DEFAULT_STORAGE_KEY,
  DEFAULT_THEME_ID,
  getThemeById,
  getThemeMode,
  isValidThemeSetting,
  resolveSystemThemeId,
  resolveThemeId,
  THEMES,
  ThemeProvider,
  useTheme,
  useThemeOptional,
} from "./lib/theme";
export {
  type UseControllableStateOptions,
  useControllableState,
} from "./lib/use-controllable-state";
export type { ClassValue };
export { cn };

/**
 * Library version — updated by Changesets on release.
 */
export const VERSION = "1.0.0";

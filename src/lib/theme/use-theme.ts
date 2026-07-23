import { createContext, useContext } from "react";
import type { Density, ThemeDefinition, ThemeId, ThemeMode, ThemeSetting } from "./types";

/** React context value exposed by ThemeProvider. */
export type ThemeContextValue = {
  /** Current theme setting (may be "system"). */
  theme: ThemeSetting;
  /** Resolved concrete theme id after system preference. */
  resolvedTheme: ThemeId;
  /** Resolved light/dark mode. */
  resolvedMode: ThemeMode;
  /** Active UI density. */
  density: Density;
  /** All available theme definitions. */
  themes: readonly ThemeDefinition[];
  /** Update the active theme setting. */
  setTheme: (theme: ThemeSetting) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Access the current theme context.
 *
 * @throws If used outside of ThemeProvider.
 *
 * @example
 * ```tsx
 * const { theme, setTheme, resolvedMode } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Returns theme context when inside {@link ThemeProvider}, otherwise `null`.
 * Use for optional theme integration (e.g. {@link Toaster} outside a provider).
 */
export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}

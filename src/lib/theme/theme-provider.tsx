import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_STORAGE_KEY,
  DEFAULT_THEME_ID,
  getThemeMode,
  isValidThemeSetting,
  resolveThemeId,
  THEMES,
} from "./theme-registry";
import type { Density, ThemeSetting } from "./types";
import { ThemeContext, type ThemeContextValue } from "./use-theme";

export type ThemeProviderProps = {
  children: ReactNode;
  /** Initial theme when no stored preference exists. */
  defaultTheme?: ThemeSetting;
  /**
   * When set, theme is controlled externally (e.g. Storybook toolbar).
   * Skips localStorage on init and does not persist changes.
   */
  forcedTheme?: ThemeSetting;
  /** localStorage key for persistence. */
  storageKey?: string;
  /** When true, "system" follows prefers-color-scheme. */
  enableSystem?: boolean;
  /** UI density applied via `data-density` on the document root. @default "compact" */
  density?: Density;
  /** HTML element to apply theme attributes. Defaults to document.documentElement. */
  attributeTarget?: HTMLElement | null;
};

export function readStoredTheme(storageKey: string, fallback: ThemeSetting): ThemeSetting {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && isValidThemeSetting(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be blocked; fall back to default
  }
  return fallback;
}

export function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeToDom(
  target: HTMLElement,
  resolvedTheme: string,
  mode: "light" | "dark",
  density: Density,
): void {
  target.setAttribute("data-theme", resolvedTheme);
  target.setAttribute("data-density", density);
  target.classList.toggle("dark", mode === "dark");
}

/**
 * Provides theme context and applies `data-theme` + `.dark` on the document root.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light-default" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME_ID,
  forcedTheme,
  storageKey = DEFAULT_STORAGE_KEY,
  enableSystem = true,
  density = "compact",
  attributeTarget,
}: ThemeProviderProps) {
  const fallbackTheme =
    defaultTheme === "system" && !enableSystem ? DEFAULT_THEME_ID : defaultTheme;
  const initialTheme =
    forcedTheme ??
    (enableSystem
      ? readStoredTheme(storageKey, fallbackTheme)
      : readStoredTheme(storageKey, fallbackTheme));

  const [theme, setThemeState] = useState<ThemeSetting>(initialTheme);
  const [prefersDark, setPrefersDark] = useState(getSystemPrefersDark);

  const resolvedTheme = useMemo(
    () =>
      resolveThemeId(theme === "system" && !enableSystem ? DEFAULT_THEME_ID : theme, prefersDark),
    [theme, prefersDark, enableSystem],
  );

  const resolvedMode = useMemo(() => getThemeMode(resolvedTheme), [resolvedTheme]);

  const setTheme = useCallback(
    (next: ThemeSetting) => {
      setThemeState(next);
      if (forcedTheme !== undefined) {
        return;
      }
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore storage errors
      }
    },
    [forcedTheme, storageKey],
  );

  useEffect(() => {
    if (forcedTheme !== undefined) {
      setThemeState(forcedTheme);
    }
  }, [forcedTheme]);

  useEffect(() => {
    const target = attributeTarget ?? document.documentElement;
    applyThemeToDom(target, resolvedTheme, resolvedMode, density);
  }, [attributeTarget, resolvedTheme, resolvedMode, density]);

  useEffect(() => {
    if (!enableSystem) {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [enableSystem]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      resolvedMode,
      density,
      themes: THEMES,
      setTheme,
    }),
    [theme, resolvedTheme, resolvedMode, density, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

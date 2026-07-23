import type { Decorator } from "@storybook/react";
import {
  resolveStorybookTheme,
  StorybookThemeShell,
  setLatestStorybookGlobals,
} from "../utils/storybook-theme";

/**
 * Wraps canvas stories in ThemeProvider for live theme switching.
 */
export const withThemeProvider: Decorator = (Story, context) => {
  setLatestStorybookGlobals(context.globals);
  const selectedTheme = resolveStorybookTheme(context.globals);

  return (
    <StorybookThemeShell
      key={selectedTheme}
      theme={selectedTheme}
      className="sb-kit-canvas-root min-h-dvh bg-background text-foreground"
    >
      <Story />
    </StorybookThemeShell>
  );
};

import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { convert, themes } from "storybook/theming";
import { useTheme } from "../../src/lib/theme";
import {
  resolveStorybookTheme,
  StorybookThemeShell,
  useStorybookGlobals,
} from "../utils/storybook-theme";

function readGlobalsFromUrl(): Record<string, unknown> {
  if (typeof window === "undefined") {
    return {};
  }

  const globalsParam = new URLSearchParams(window.location.search).get("globals");
  if (!globalsParam) {
    return {};
  }

  return Object.fromEntries(
    globalsParam
      .split(";")
      .filter(Boolean)
      .map((pair) => {
        const separator = pair.indexOf(":");
        if (separator === -1) {
          return [pair, true];
        }
        return [pair.slice(0, separator), pair.slice(separator + 1)];
      }),
  );
}

function readInitialGlobals(context: DocsContainerProps["context"]): Record<string, unknown> {
  const fromUrl = readGlobalsFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    return fromUrl;
  }

  try {
    const story = context.storyById();
    const storyGlobals = context.getStoryContext(story).globals;
    if (Object.keys(storyGlobals).length > 0) {
      return storyGlobals;
    }
  } catch {
    // MDX docs pages may not have a primary story.
  }

  return context.projectAnnotations.initialGlobals ?? {};
}

/**
 * Applies Storybook's built-in light/dark docs theme from the kit resolved mode.
 */
function StorybookDocsContainer({ context, ...props }: DocsContainerProps) {
  const { resolvedMode } = useTheme();
  const storybookTheme = convert(resolvedMode === "dark" ? themes.dark : themes.light);

  return <DocsContainer context={context} theme={storybookTheme} {...props} />;
}

/**
 * Docs root wrapper — applies kit theme to the full docs page (MDX + autodocs).
 */
export function ThemedDocsContainer({ context, ...props }: DocsContainerProps) {
  const initialGlobals = readInitialGlobals(context);
  const globals = useStorybookGlobals(context.channel, initialGlobals);
  const selectedTheme = resolveStorybookTheme(globals);

  return (
    <StorybookThemeShell
      key={selectedTheme}
      theme={selectedTheme}
      className="sb-kit-docs-root min-h-full bg-background text-foreground"
    >
      <StorybookDocsContainer context={context} {...props} />
    </StorybookThemeShell>
  );
}

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import type { Channel } from "storybook/internal/channels";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import type { Globals } from "storybook/internal/types";
import { ThemeProvider, type ThemeSetting } from "../../src/lib/theme";

/** Storybook toolbar global key for the active kit theme. */
export const STORYBOOK_THEME_GLOBAL = "theme";

let latestGlobals: Globals = {};

/** Caches the most recent Storybook globals for docs container remounts. */
export function setLatestStorybookGlobals(globals: Globals): void {
  latestGlobals = globals;
}

/** Returns cached Storybook globals when available. */
export function getLatestStorybookGlobals(): Globals {
  return latestGlobals;
}

/** Resolves the kit theme from Storybook globals. */
export function resolveStorybookTheme(globals: Record<string, unknown>): ThemeSetting {
  const value = globals[STORYBOOK_THEME_GLOBAL];
  if (typeof value === "string") {
    return value as ThemeSetting;
  }
  return "light-default";
}

const globalsListeners = new Set<() => void>();

function notifyGlobalsListeners(): void {
  for (const listener of globalsListeners) {
    listener();
  }
}

function mergeGlobalsPayload(payload: {
  globals?: Globals;
  userGlobals?: Globals;
  storyGlobals?: Globals;
}): Globals | null {
  if (payload.globals && Object.keys(payload.globals).length > 0) {
    return payload.globals;
  }

  const merged = {
    ...payload.storyGlobals,
    ...payload.userGlobals,
  };

  return Object.keys(merged).length > 0 ? merged : null;
}

/** Subscribes to Storybook toolbar global changes in the preview iframe. */
export function subscribeStorybookGlobals(channel: Channel, onChange: () => void): () => void {
  const handler = (payload: {
    globals?: Globals;
    userGlobals?: Globals;
    storyGlobals?: Globals;
  }) => {
    const next = mergeGlobalsPayload(payload);
    if (!next) {
      return;
    }
    latestGlobals = next;
    notifyGlobalsListeners();
  };

  globalsListeners.add(onChange);
  channel.on(GLOBALS_UPDATED, handler);

  return () => {
    globalsListeners.delete(onChange);
    channel.off(GLOBALS_UPDATED, handler);
  };
}

/** Reads Storybook globals from the preview channel (safe outside story decorators). */
export function useStorybookGlobals(channel: Channel, initialGlobals: Globals): Globals {
  return useSyncExternalStore(
    (onStoreChange) => subscribeStorybookGlobals(channel, onStoreChange),
    () => (Object.keys(latestGlobals).length > 0 ? latestGlobals : initialGlobals),
    () => initialGlobals,
  );
}

export type StorybookThemeShellProps = {
  theme: ThemeSetting;
  children: ReactNode;
  className?: string;
};

/**
 * Applies the kit ThemeProvider for Storybook preview surfaces (canvas + docs).
 */
export function StorybookThemeShell({ theme, children, className }: StorybookThemeShellProps) {
  return (
    <ThemeProvider forcedTheme={theme} enableSystem={theme === "system"}>
      <div
        className={className ?? "min-h-full bg-background text-foreground"}
        data-sb-theme={theme}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}

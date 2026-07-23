import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { getThemeMode, isValidThemeSetting, useTheme } from "../../lib/theme";
import { ThemePlaygroundPanel } from "./theme-playground-panel";
import { ThemePlaygroundPreview } from "./theme-playground-preview";
import {
  APPEARANCE_PRESETS,
  buildThemeCss,
  computePrimaryForeground,
  DEFAULT_PLAYGROUND_THEME_ID,
  DEFAULT_RADIUS_ID,
  DEFAULT_SCALING,
  getLowContrastWarnings,
  getRadiusStyleVars,
  type RadiusOptionId,
  readPresetTokens,
  THEME_PRESETS,
  THEME_TOKEN_GROUPS,
  type ThemeTokenKey,
} from "./theme-token-fields";

export type ThemePlaygroundProps = {
  /** Theme id used in exported CSS. @default "my-theme" */
  themeId?: string;
  className?: string;
};

/**
 * Theme playground — fixed panel left, scrollable component catalog right.
 */
export function ThemePlayground({
  themeId = DEFAULT_PLAYGROUND_THEME_ID,
  className,
}: ThemePlaygroundProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [values, setValues] = useState<Partial<Record<ThemeTokenKey, string>>>({});
  const [defaultValues, setDefaultValues] = useState<Partial<Record<ThemeTokenKey, string>>>({});
  const [appearance, setAppearance] = useState<string>(APPEARANCE_PRESETS[0].id);
  const [accentId, setAccentId] = useState<string | null>(null);
  const [radius, setRadius] = useState<RadiusOptionId>(DEFAULT_RADIUS_ID);
  const [scaling, setScaling] = useState(DEFAULT_SCALING);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const defaults = readPresetTokens(resolvedTheme);
    setDefaultValues(defaults);
    setValues(defaults);
    setAccentId(null);
    setRadius(DEFAULT_RADIUS_ID);
    setScaling(DEFAULT_SCALING);
    setActivePresetId(
      THEME_PRESETS.some((preset) => preset.id === resolvedTheme) ? resolvedTheme : null,
    );

    const mode = getThemeMode(resolvedTheme);
    setAppearance(mode === "dark" ? "dark-default" : "light-default");
  }, [resolvedTheme]);

  const previewStyle = useMemo(() => {
    const style: Record<string, string> = { ...getRadiusStyleVars(radius) };
    for (const group of THEME_TOKEN_GROUPS) {
      for (const field of group.fields) {
        const value = values[field.key];
        if (value) {
          style[field.cssVar] = value;
        }
      }
    }
    return style;
  }, [radius, values]);

  const exportedCss = useMemo(
    () => buildThemeCss(themeId, values, radius),
    [themeId, values, radius],
  );

  const lowContrastByForeground = useMemo(() => {
    const warnings = getLowContrastWarnings(values);
    return new Map(
      warnings.map((warning) => [
        warning.foreground,
        { ratio: warning.ratio, background: warning.background },
      ]),
    );
  }, [values]);

  const previewZoomStyle = useMemo(() => ({ zoom: scaling / 100 }) as CSSProperties, [scaling]);

  const updateToken = (key: ThemeTokenKey, next: string) => {
    setActivePresetId(null);
    if (key === "primary") {
      setAccentId(null);
    }
    setValues((previous) => {
      const nextValues = { ...previous, [key]: next };
      if (key === "accent") {
        nextValues.accentForeground = computePrimaryForeground(next);
      }
      return nextValues;
    });
  };

  const loadPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setAccentId(null);

    if (APPEARANCE_PRESETS.some((preset) => preset.id === presetId)) {
      setAppearance(presetId);
    }

    if (isValidThemeSetting(presetId)) {
      setTheme(presetId);
      return;
    }

    setValues(readPresetTokens(presetId));
  };

  const applyAccent = (swatchId: string, accentValue: string) => {
    setAccentId(swatchId);
    setActivePresetId(null);
    const primaryForeground = computePrimaryForeground(accentValue);
    setValues((previous) => ({
      ...previous,
      primary: accentValue,
      ring: accentValue,
      primaryForeground,
    }));
  };

  const resetValues = () => {
    setValues({ ...defaultValues });
    setActivePresetId(
      THEME_PRESETS.some((preset) => preset.id === resolvedTheme) ? resolvedTheme : null,
    );
    setAccentId(null);
    setRadius(DEFAULT_RADIUS_ID);
    setScaling(DEFAULT_SCALING);
    const mode = getThemeMode(resolvedTheme);
    setAppearance(mode === "dark" ? "dark-default" : "light-default");
  };

  const copyCss = async () => {
    await navigator.clipboard.writeText(exportedCss);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("not-prose w-full min-w-0", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ThemePlaygroundPanel
          values={values}
          appearance={appearance}
          accentId={accentId}
          radius={radius}
          scaling={scaling}
          activePresetId={activePresetId}
          copied={copied}
          lowContrastByForeground={lowContrastByForeground}
          onAppearanceChange={loadPreset}
          onPresetChange={loadPreset}
          onAccentChange={applyAccent}
          onRadiusChange={setRadius}
          onScalingChange={setScaling}
          onTokenChange={updateToken}
          onReset={resetValues}
          onCopy={() => void copyCss()}
        />

        <div
          data-theme={resolvedTheme}
          className="sb-unstyled min-w-0 flex-1 overflow-auto rounded-lg border border-border bg-background p-6 text-foreground lg:p-8"
          style={previewStyle}
        >
          <div style={previewZoomStyle}>
            <ThemePlaygroundPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

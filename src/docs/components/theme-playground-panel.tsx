import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Badge } from "../../components/badge/badge";
import { Button } from "../../components/button/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/collapsible/collapsible";
import { cn } from "../../lib/cn";
import {
  ACCENT_SWATCHES,
  APPEARANCE_PRESETS,
  QUICK_COLOR_KEYS,
  RADIUS_OPTIONS,
  type RadiusOptionId,
  resolveCssColorToRgb,
  rgbToHexColor,
  SCALING_OPTIONS,
  THEME_PRESETS,
  THEME_TOKEN_FIELDS,
  THEME_TOKEN_GROUPS,
  type ThemeTokenField,
  type ThemeTokenKey,
} from "./theme-token-fields";

export type ThemePlaygroundPanelProps = {
  values: Partial<Record<ThemeTokenKey, string>>;
  appearance: string;
  accentId: string | null;
  radius: RadiusOptionId;
  scaling: number;
  activePresetId: string | null;
  copied: boolean;
  lowContrastByForeground: Map<ThemeTokenKey, { ratio: number; background: ThemeTokenKey }>;
  onAppearanceChange: (presetId: string) => void;
  onPresetChange: (presetId: string) => void;
  onAccentChange: (swatchId: string, value: string) => void;
  onRadiusChange: (radiusId: RadiusOptionId) => void;
  onScalingChange: (scaling: number) => void;
  onTokenChange: (key: ThemeTokenKey, value: string) => void;
  onReset: () => void;
  onCopy: () => void;
};

const quickColorFields = QUICK_COLOR_KEYS.flatMap((key) => {
  const field = THEME_TOKEN_FIELDS.find((item) => item.key === key);
  return field ? [field] : [];
});

/**
 * Radix-style fixed theme panel — appearance, presets, quick colors, advanced tokens.
 */
export function ThemePlaygroundPanel({
  values,
  appearance,
  accentId,
  radius,
  scaling,
  activePresetId,
  copied,
  lowContrastByForeground,
  onAppearanceChange,
  onPresetChange,
  onAccentChange,
  onRadiusChange,
  onScalingChange,
  onTokenChange,
  onReset,
  onCopy,
}: ThemePlaygroundPanelProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <aside className="flex w-[280px] shrink-0 flex-col gap-5 rounded-lg border border-border bg-card p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-5rem)]">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">Theme</h2>
        <p className="text-xs text-muted-foreground">Tune tokens — preview updates live.</p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-1">
        <PanelSection label="Appearance">
          <SegmentedButtons
            value={appearance}
            options={APPEARANCE_PRESETS.map((preset) => ({
              value: preset.id,
              label: preset.label,
            }))}
            onValueChange={onAppearanceChange}
          />
        </PanelSection>

        <PanelSection label="Accent color">
          <div className="grid grid-cols-6 gap-1.5 p-1">
            {ACCENT_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                title={swatch.label}
                aria-label={`${swatch.label} accent`}
                aria-pressed={accentId === swatch.id}
                className={cn(
                  "size-8 rounded-md border border-border transition-shadow",
                  accentId === swatch.id && "ring-2 ring-ring ring-offset-2 ring-offset-card",
                )}
                style={{ backgroundColor: swatch.value }}
                onClick={() => onAccentChange(swatch.id, swatch.value)}
              />
            ))}
          </div>
        </PanelSection>

        <PanelSection label="Radius">
          <SegmentedButtons
            value={radius}
            options={RADIUS_OPTIONS.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            onValueChange={(next) => onRadiusChange(next as RadiusOptionId)}
          />
        </PanelSection>

        <PanelSection label="Scaling">
          <SegmentedButtons
            value={String(scaling)}
            options={SCALING_OPTIONS.map((option) => ({
              value: String(option),
              label: `${option}%`,
            }))}
            onValueChange={(next) => onScalingChange(Number(next))}
          />
        </PanelSection>

        <PanelSection label="Presets">
          <div className="flex flex-wrap gap-1.5">
            {THEME_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                size="sm"
                variant={activePresetId === preset.id ? "secondary" : "outline"}
                title={preset.description}
                onClick={() => onPresetChange(preset.id)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </PanelSection>

        <PanelSection label="Colors">
          <ColorTokenList>
            {quickColorFields.map((field) => (
              <ColorTokenField
                key={field.key}
                field={field}
                value={values[field.key] ?? ""}
                onChange={(next) => onTokenChange(field.key, next)}
              />
            ))}
          </ColorTokenList>
        </PanelSection>

        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="w-full justify-between px-0">
              Advanced tokens
              <span className="text-xs text-muted-foreground">{advancedOpen ? "▾" : "▸"}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-5 pt-3">
            {THEME_TOKEN_GROUPS.map((group) => (
              <section key={group.id} className="space-y-2">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">{group.description}</p>
                </div>
                <ColorTokenList>
                  {group.fields.map((field) => (
                    <ColorTokenField
                      key={field.key}
                      field={field}
                      value={values[field.key] ?? ""}
                      lowContrast={lowContrastByForeground.get(field.key)}
                      onChange={(next) => onTokenChange(field.key, next)}
                    />
                  ))}
                </ColorTokenList>
              </section>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex gap-2 border-t border-border pt-4">
        <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={onReset}>
          Reset
        </Button>
        <Button type="button" size="sm" className="flex-1" onClick={onCopy}>
          {copied ? "Copied!" : "Copy Theme"}
        </Button>
      </div>
    </aside>
  );
}

function SegmentedButtons({
  value,
  options,
  onValueChange,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-wrap gap-1">
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "secondary" : "outline"}
          className="flex-1"
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function PanelSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground">{label}</h3>
      {children}
    </section>
  );
}

function ColorTokenList({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-background/40">
      {children}
    </div>
  );
}

function ColorTokenField({
  field,
  value,
  onChange,
  lowContrast,
}: {
  field: ThemeTokenField;
  value: string;
  onChange: (value: string) => void;
  lowContrast?: { ratio: number; background: ThemeTokenKey };
}) {
  const pickerValue = useMemo(() => toHexColorInputValue(value), [value]);
  const inputId = `color-token-${field.key}`;

  return (
    <label
      htmlFor={inputId}
      className="flex cursor-pointer items-start gap-3 border-b border-border-subtle px-3 py-2.5 transition-colors last:border-b-0 hover:bg-accent/50"
    >
      <span className="relative mt-0.5 size-8 shrink-0 overflow-hidden rounded-md border border-border shadow-sm">
        <span
          className="block size-full"
          style={{ backgroundColor: value || "transparent" }}
          aria-hidden
        />
        <input
          id={inputId}
          type="color"
          value={pickerValue}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
          aria-label={`${field.label} color`}
        />
      </span>
      <span className="min-w-0 flex-1 pt-px">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold leading-tight text-foreground">{field.label}</span>
          {lowContrast ? (
            <Badge
              variant="outline"
              className="shrink-0 px-1 py-0 text-[10px] leading-tight"
              title={`Contrast ${lowContrast.ratio.toFixed(1)}:1 (needs 4.5:1)`}
            >
              Low contrast
            </Badge>
          ) : null}
        </span>
        <span className="mt-0.5 block text-[10px] leading-tight text-muted-foreground">
          {field.hint}
        </span>
      </span>
    </label>
  );
}

function toHexColorInputValue(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) {
    return value;
  }

  const rgb = resolveCssColorToRgb(value);
  if (!rgb) {
    return "#808080";
  }

  return rgbToHexColor(rgb);
}

import { describe, expect, it } from "vitest";
import { buildThemeCss, THEME_PRESETS, THEME_TOKEN_FIELDS } from "./theme-token-fields";

describe("buildThemeCss", () => {
  it("returns placeholder when no values are set", () => {
    expect(buildThemeCss("brand", {})).toContain('[data-theme="brand"]');
  });

  it("emits semantic variable declarations", () => {
    const css = buildThemeCss("brand", { background: "#ffffff", primary: "#2563eb" });
    expect(css).toContain("--app-bg: #ffffff;");
    expect(css).toContain("--app-primary: #2563eb;");
  });

  it("covers every token field key", () => {
    expect(THEME_TOKEN_FIELDS.length).toBeGreaterThanOrEqual(18);
  });

  it("lists built-in presets", () => {
    const presetIds = THEME_PRESETS.map((preset) => preset.id);
    expect(presetIds).toContain("light-sage");
    expect(presetIds).toContain("dark-violet");
    expect(presetIds).toHaveLength(6);
  });
});

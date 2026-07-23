import { describe, expect, it } from "vitest";

describe("main barrel", () => {
  it("exports Button and theme utilities", async () => {
    const mod = await import("../src/index");
    expect(mod.Button).toBeDefined();
    expect(mod.ThemeProvider).toBeDefined();
    expect(mod.VERSION).toBe("1.0.0");
  }, 15_000);

  it("exports table, icons, and editor from main barrel", async () => {
    const mod = await import("../src/index");
    expect(mod.DataTable).toBeDefined();
    expect(mod.Table).toBeDefined();
    expect(mod.Icon).toBeDefined();
    expect(mod.RichTextEditor).toBeDefined();
  });
});

describe("cn utility", () => {
  it("merges conflicting tailwind classes", async () => {
    const { cn } = await import("../src/lib/cn");
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("subpath exports", () => {
  it("exports table DataTable", async () => {
    const mod = await import("../src/table/index");
    expect(mod.DataTable).toBeDefined();
    expect(mod.Table).toBeDefined();
  });

  it("exports forms primitives", async () => {
    const mod = await import("../src/forms/index");
    expect(mod.Input).toBeDefined();
    expect(mod.Select).toBeDefined();
    expect(mod.SelectSearch).toBeDefined();
    expect(mod.Calendar).toBeDefined();
  });

  it("exports overlay primitives", async () => {
    const mod = await import("../src/overlays/index");
    expect(mod.Dialog).toBeDefined();
    expect(mod.Drawer).toBeDefined();
    expect(mod.Popover).toBeDefined();
  });

  it("exports client barrel for App Router", async () => {
    const mod = await import("../src/client");
    expect(mod.Dialog).toBeDefined();
    expect(mod.Drawer).toBeDefined();
  });
});

describe("icons subpath", () => {
  it("exports Icon wrapper and curated lucide icons", async () => {
    const mod = await import("../src/icons/index");
    expect(mod.Icon).toBeDefined();
    expect(mod.iconVariants).toBeDefined();
    expect(mod.Search).toBeDefined();
    expect(mod.Calendar).toBeDefined();
  });
});

describe("charts subpath", () => {
  it("exports ChartContainer and chart helpers", async () => {
    const mod = await import("../src/charts/index");
    expect(mod.ChartContainer).toBeDefined();
    expect(mod.ChartTooltip).toBeDefined();
    expect(mod.ChartLegend).toBeDefined();
    expect(mod.chartVariants).toBeDefined();
  });
});

describe("editor subpath", () => {
  it("exports RichTextEditor and extensions", async () => {
    const mod = await import("../src/editor/index");
    expect(mod.RichTextEditor).toBeDefined();
    expect(mod.createRichTextEditorExtensions).toBeDefined();
  });
});

import { describe, expect, it } from "vitest";
import { createRichTextEditorExtensions } from "./rich-text-editor-extensions";

describe("createRichTextEditorExtensions", () => {
  it("includes image and table extensions by default", () => {
    const extensions = createRichTextEditorExtensions();
    const names = extensions.map((extension) => extension.name);
    expect(names).toContain("image");
    expect(names).toContain("table");
    expect(names).toContain("starterKit");
  });

  it("omits image and table when disabled", () => {
    const extensions = createRichTextEditorExtensions({ images: false, tables: false });
    const names = extensions.map((extension) => extension.name);
    expect(names).not.toContain("image");
    expect(names).not.toContain("table");
  });
});

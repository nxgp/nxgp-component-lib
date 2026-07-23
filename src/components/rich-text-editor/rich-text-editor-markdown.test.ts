import { describe, expect, it } from "vitest";
import { richTextHtmlToMarkdown } from "./rich-text-editor-markdown";

describe("richTextHtmlToMarkdown", () => {
  it("converts basic rich text markup", () => {
    expect(richTextHtmlToMarkdown("<p>Hello <strong>world</strong></p>")).toBe("Hello **world**");
  });

  it("converts links and headings", () => {
    expect(
      richTextHtmlToMarkdown(
        '<h2>Title</h2><p>Visit <a href="https://example.com">Example</a></p>',
      ),
    ).toContain("## Title");
    expect(
      richTextHtmlToMarkdown(
        '<h2>Title</h2><p>Visit <a href="https://example.com">Example</a></p>',
      ),
    ).toContain("[Example](https://example.com)");
  });
});

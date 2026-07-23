import "./test-setup";
import type { Editor } from "@tiptap/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, userEvent } from "../../../tests/utils";
import { RichTextEditorToolbar } from "./rich-text-editor-toolbar";

function createEditorMock(overrides: Partial<Editor> = {}): Editor {
  const run = vi.fn();
  const chain = {
    focus: () => ({
      toggleBold: () => ({ run }),
      toggleItalic: () => ({ run }),
      toggleStrike: () => ({ run }),
      toggleBulletList: () => ({ run }),
      toggleOrderedList: () => ({ run }),
      toggleBlockquote: () => ({ run }),
      extendMarkRange: () => ({
        setLink: () => ({ run }),
        unsetLink: () => ({ run }),
      }),
      unsetLink: () => ({ run }),
    }),
  };
  const chainFn = vi.fn(() => chain);

  return {
    isEditable: true,
    isActive: vi.fn(() => false),
    chain: chainFn,
    getAttributes: () => ({}),
    ...overrides,
  } as unknown as Editor;
}

describe("RichTextEditorToolbar", () => {
  it("invokes formatting commands", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole } = renderWithProviders(<RichTextEditorToolbar editor={editor} />);

    await user.click(getByRole("button", { name: "Bold" }));
    await user.click(getByRole("button", { name: "Italic" }));
    await user.click(getByRole("button", { name: "Bullet list" }));
    await user.click(getByRole("button", { name: "Remove link" }));

    expect(editor.chain).toHaveBeenCalled();
  });

  it("reflects active link state on the link button", () => {
    const editor = createEditorMock({
      isActive: (name: string) => name === "link",
    });

    const { getByRole } = renderWithProviders(<RichTextEditorToolbar editor={editor} />);
    expect(getByRole("button", { name: "Add link" })).toHaveClass("bg-muted");
  });

  it("disables toolbar when editor is not editable", () => {
    const editor = createEditorMock({ isEditable: false });
    const { getByRole } = renderWithProviders(<RichTextEditorToolbar editor={editor} />);
    expect(getByRole("button", { name: "Bold" })).toBeDisabled();
  });

  it("invokes strikethrough and list commands", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole } = renderWithProviders(<RichTextEditorToolbar editor={editor} />);

    await user.click(getByRole("button", { name: "Strikethrough" }));
    await user.click(getByRole("button", { name: "Numbered list" }));
    await user.click(getByRole("button", { name: "Blockquote" }));

    expect(editor.chain).toHaveBeenCalled();
  });

  it("sets link via popover form", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole, getByLabelText } = renderWithProviders(
      <RichTextEditorToolbar editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add link" }));
    await user.clear(getByLabelText("URL"));
    await user.type(getByLabelText("URL"), "https://example.com");
    await user.click(getByRole("button", { name: "Apply" }));

    expect(editor.chain).toHaveBeenCalled();
  });

  it("clears link when popover url is empty", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock({
      isActive: (name: string) => name === "link",
      getAttributes: () => ({ href: "https://example.com" }),
    });

    const { getByRole, getByLabelText } = renderWithProviders(
      <RichTextEditorToolbar editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add link" }));
    await user.clear(getByLabelText("URL"));
    await user.click(getByRole("button", { name: "Apply" }));

    expect(editor.chain).toHaveBeenCalled();
  });

  it("closes link popover on cancel", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole, queryByLabelText } = renderWithProviders(
      <RichTextEditorToolbar editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add link" }));
    await user.click(getByRole("button", { name: "Cancel" }));

    expect(queryByLabelText("URL")).not.toBeInTheDocument();
  });

  it("applies link when pressing Enter in the url field", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole, getByLabelText } = renderWithProviders(
      <RichTextEditorToolbar editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add link" }));
    await user.clear(getByLabelText("URL"));
    await user.type(getByLabelText("URL"), "https://example.com{Enter}");

    expect(editor.chain).toHaveBeenCalled();
  });

  it("returns null when editor is missing", () => {
    const { container } = renderWithProviders(<RichTextEditorToolbar editor={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("hides image and table controls when disabled", () => {
    const editor = createEditorMock();
    const { queryByRole } = renderWithProviders(
      <RichTextEditorToolbar editor={editor} enableImages={false} enableTables={false} />,
    );
    expect(queryByRole("button", { name: "Add image" })).not.toBeInTheDocument();
    expect(queryByRole("button", { name: "Insert table" })).not.toBeInTheDocument();
  });

  it("inserts table and toggles code block", async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    const editor = createEditorMock({
      chain: vi.fn(() => ({
        focus: () => ({
          insertTable: () => ({ run }),
          toggleCodeBlock: () => ({ run }),
          toggleBold: () => ({ run }),
          toggleItalic: () => ({ run }),
          toggleStrike: () => ({ run }),
          toggleBulletList: () => ({ run }),
          toggleOrderedList: () => ({ run }),
          toggleBlockquote: () => ({ run }),
          extendMarkRange: () => ({
            setLink: () => ({ run }),
            unsetLink: () => ({ run }),
          }),
          unsetLink: () => ({ run }),
        }),
      })) as unknown as Editor["chain"],
    });

    const { getByRole } = renderWithProviders(<RichTextEditorToolbar editor={editor} />);
    await user.click(getByRole("button", { name: "Insert table" }));
    await user.click(getByRole("button", { name: "Code block" }));
    expect(editor.chain).toHaveBeenCalled();
  });
});

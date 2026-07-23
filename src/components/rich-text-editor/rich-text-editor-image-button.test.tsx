import "./test-setup";
import type { Editor } from "@tiptap/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, userEvent } from "../../../tests/utils";
import { RichTextEditorImageButton } from "./rich-text-editor-image-button";

function createEditorMock(overrides: Partial<Editor> = {}): Editor {
  const run = vi.fn();
  const chain = {
    focus: () => ({
      setImage: () => ({ run }),
    }),
  };

  return {
    chain: vi.fn(() => chain),
    ...overrides,
  } as unknown as Editor;
}

describe("RichTextEditorImageButton", () => {
  it("inserts image via popover form", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole, getByLabelText } = renderWithProviders(
      <RichTextEditorImageButton editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add image" }));
    await user.type(getByLabelText("Image URL"), "https://example.com/photo.jpg");
    await user.type(getByLabelText("Alt text"), "A photo");
    await user.click(getByRole("button", { name: "Insert" }));

    expect(editor.chain).toHaveBeenCalled();
  });

  it("closes without inserting when url is empty", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole, queryByLabelText } = renderWithProviders(
      <RichTextEditorImageButton editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add image" }));
    await user.click(getByRole("button", { name: "Insert" }));

    expect(queryByLabelText("Image URL")).not.toBeInTheDocument();
    expect(editor.chain).not.toHaveBeenCalled();
  });

  it("closes on cancel and resets fields when reopened", async () => {
    const user = userEvent.setup();
    const editor = createEditorMock();

    const { getByRole, getByLabelText, queryByLabelText } = renderWithProviders(
      <RichTextEditorImageButton editor={editor} />,
    );
    await user.click(getByRole("button", { name: "Add image" }));
    await user.type(getByLabelText("Image URL"), "https://example.com/a.jpg");
    await user.click(getByRole("button", { name: "Cancel" }));
    expect(queryByLabelText("Image URL")).not.toBeInTheDocument();

    await user.click(getByRole("button", { name: "Add image" }));
    expect(getByLabelText("Image URL")).toHaveValue("");
  });

  it("disables trigger when disabled", () => {
    const editor = createEditorMock();
    const { getByRole } = renderWithProviders(
      <RichTextEditorImageButton editor={editor} disabled />,
    );
    expect(getByRole("button", { name: "Add image" })).toBeDisabled();
  });
});

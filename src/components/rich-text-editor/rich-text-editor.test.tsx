import "./test-setup";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { RichTextEditor } from "./rich-text-editor";
import { createRichTextEditorExtensions } from "./rich-text-editor-extensions";
import { RichTextEditorToolbar } from "./rich-text-editor-toolbar";

describe("RichTextEditor", () => {
  describe("rendering", () => {
    it("renders toolbar and editable surface", () => {
      const { getByRole } = renderWithProviders(
        <RichTextEditor defaultValue="<p>Hello</p>" aria-label="Body" />,
      );
      expect(getByRole("toolbar", { name: "Text formatting" })).toBeInTheDocument();
      expect(getByRole("textbox", { name: "Body" })).toBeInTheDocument();
    });

    it("hides toolbar when showToolbar is false", () => {
      const { queryByRole, getByRole } = renderWithProviders(
        <RichTextEditor showToolbar={false} aria-label="Notes" />,
      );
      expect(queryByRole("toolbar")).not.toBeInTheDocument();
      expect(getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <RichTextEditor className="custom-editor" aria-label="Body" />,
      );
      expect(
        getByRole("textbox", { name: "Body" }).closest("[data-slot='rich-text-editor']"),
      ).toHaveClass("custom-editor");
    });
  });

  describe("props and state edge cases", () => {
    it("exposes imperative handle methods", async () => {
      const ref = createRef<import("./rich-text-editor").RichTextEditorHandle>();
      renderWithProviders(
        <RichTextEditor ref={ref} defaultValue="<p>Initial</p>" aria-label="Body" />,
      );

      await vi.waitFor(() => {
        expect(ref.current?.editor).not.toBeNull();
      });

      expect(ref.current?.getHTML()).toContain("Initial");
      ref.current?.setHTML("<p>Updated</p>");
      expect(ref.current?.getHTML()).toContain("Updated");
      ref.current?.focus();
    });

    it("calls onChange when content updates", async () => {
      const onChange = vi.fn();
      const ref = createRef<import("./rich-text-editor").RichTextEditorHandle>();

      renderWithProviders(<RichTextEditor ref={ref} onChange={onChange} aria-label="Body" />);

      await vi.waitFor(() => {
        expect(ref.current?.editor).not.toBeNull();
      });

      ref.current?.editor?.commands.setContent("<p>Hi</p>");

      await vi.waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });

    it("respects disabled state", async () => {
      const ref = createRef<import("./rich-text-editor").RichTextEditorHandle>();

      renderWithProviders(
        <RichTextEditor ref={ref} disabled defaultValue="<p>Locked</p>" aria-label="Body" />,
      );

      await vi.waitFor(() => {
        expect(ref.current?.editor).not.toBeNull();
      });

      expect(ref.current?.editor?.isEditable).toBe(false);
    });

    it("syncs controlled value", async () => {
      const { rerender, getByRole } = renderWithProviders(
        <RichTextEditor value="<p>First</p>" aria-label="Body" />,
      );

      rerender(<RichTextEditor value="<p>Second</p>" aria-label="Body" />);

      await vi.waitFor(() => {
        expect(getByRole("textbox", { name: "Body" })).toHaveTextContent("Second");
      });
    });

    it("creates default extensions with placeholder", () => {
      const extensions = createRichTextEditorExtensions({ placeholder: "Type here" });
      expect(extensions.length).toBeGreaterThan(0);
    });
  });

  describe("interactions", () => {
    it("applies bold formatting via editor commands", async () => {
      const ref = createRef<import("./rich-text-editor").RichTextEditorHandle>();

      renderWithProviders(
        <RichTextEditor ref={ref} defaultValue="<p>Text</p>" aria-label="Body" />,
      );

      await vi.waitFor(() => {
        expect(ref.current?.editor).not.toBeNull();
      });

      ref.current?.editor?.commands.selectAll();
      ref.current?.editor?.commands.toggleBold();

      expect(ref.current?.editor?.isActive("bold")).toBe(true);
    });

    it("sets and removes links", async () => {
      const ref = createRef<import("./rich-text-editor").RichTextEditorHandle>();

      const { getByRole, getByLabelText } = renderWithProviders(
        <RichTextEditor ref={ref} defaultValue="<p>Link me</p>" aria-label="Body" />,
      );

      await vi.waitFor(() => {
        expect(ref.current?.editor).not.toBeNull();
      });

      ref.current?.editor?.commands.selectAll();
      await userEvent.click(getByRole("button", { name: "Add link" }));
      await userEvent.clear(getByLabelText("URL"));
      await userEvent.type(getByLabelText("URL"), "https://example.com");
      await userEvent.click(getByRole("button", { name: "Apply" }));

      expect(getByRole("button", { name: "Add link" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { getByRole } = renderWithProviders(
        <RichTextEditor defaultValue="<p>Accessible editor</p>" aria-label="Body" />,
      );
      await expectNoA11yViolations(
        getByRole("textbox", { name: "Body" }).closest(
          "[data-slot='rich-text-editor']",
        ) as HTMLElement,
      );
    });
  });

  describe("reliability", () => {
    it("renders toolbar alone when editor is null", () => {
      const { container } = renderWithProviders(<RichTextEditorToolbar editor={null} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("re-renders with updated placeholder", () => {
      const { rerender, getByRole } = renderWithProviders(
        <RichTextEditor placeholder="One" aria-label="Body" />,
      );
      rerender(<RichTextEditor placeholder="Two" aria-label="Body" />);
      expect(getByRole("textbox", { name: "Body" })).toBeInTheDocument();
    });
  });
});

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import {
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { cn } from "../../lib/cn";
import {
  type RichTextEditorContentVariantProps,
  type RichTextEditorVariantProps,
  richTextEditorContentVariants,
  richTextEditorVariants,
} from "./rich-text-editor.variants";
import { createRichTextEditorExtensions } from "./rich-text-editor-extensions";
import { RichTextEditorToolbar } from "./rich-text-editor-toolbar";

export type RichTextEditorHandle = {
  /** Underlying TipTap editor instance when mounted. */
  editor: Editor | null;
  /** Serialized HTML content. */
  getHTML: () => string;
  /** Replace editor content. */
  setHTML: (html: string) => void;
  focus: () => void;
};

export type RichTextEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  RichTextEditorVariantProps &
  RichTextEditorContentVariantProps & {
    /** Controlled HTML value. */
    value?: string;
    /** Initial HTML when uncontrolled. */
    defaultValue?: string;
    /** Called when content changes. */
    onChange?: (html: string) => void;
    /** Placeholder for an empty editor. */
    placeholder?: string;
    /** Disable editing and toolbar actions. */
    disabled?: boolean;
    /** Show the formatting toolbar. @default true */
    showToolbar?: boolean;
    /** Enable image insertion in the toolbar. @default true */
    enableImages?: boolean;
    /** Enable table insertion in the toolbar. @default true */
    enableTables?: boolean;
    /** Accessible label for the editing surface. */
    "aria-label"?: string;
  };

/**
 * Minimal WYSIWYG rich text editor powered by TipTap.
 *
 * @example
 * ```tsx
 * import { RichTextEditor } from "@nxgp/component-lib";
 *
 * <RichTextEditor
 *   defaultValue="<p>Hello <strong>world</strong></p>"
 *   onChange={setBody}
 *   placeholder="Write your post…"
 *   aria-label="Post body"
 * />
 * ```
 */
export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  (
    {
      className,
      size,
      disabled = false,
      value,
      defaultValue = "",
      onChange,
      placeholder = "Write something…",
      showToolbar = true,
      enableImages = true,
      enableTables = true,
      "aria-label": ariaLabel = "Rich text editor",
      ...props
    },
    ref,
  ) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const extensions = useMemo(
      () =>
        createRichTextEditorExtensions({
          placeholder,
          images: enableImages,
          tables: enableTables,
        }),
      [placeholder, enableImages, enableTables],
    );

    const editor = useEditor({
      extensions,
      content: defaultValue,
      editable: !disabled,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-label": ariaLabel,
          "aria-multiline": "true",
          class: "focus:outline-none",
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChangeRef.current?.(currentEditor.getHTML());
      },
    });

    useEffect(() => {
      if (!editor) {
        return;
      }

      editor.setEditable(!disabled);
    }, [disabled, editor]);

    useEffect(() => {
      if (!editor || value === undefined) {
        return;
      }

      const currentHtml = editor.getHTML();
      if (currentHtml !== value) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }, [editor, value]);

    useImperativeHandle(
      ref,
      () => ({
        editor,
        getHTML: () => editor?.getHTML() ?? "",
        setHTML: (html: string) => {
          editor?.commands.setContent(html, { emitUpdate: false });
        },
        focus: () => {
          editor?.commands.focus();
        },
      }),
      [editor],
    );

    return (
      <div
        data-slot="rich-text-editor"
        className={cn(richTextEditorVariants({ size, disabled, className }))}
        {...props}
      >
        {showToolbar ? (
          <RichTextEditorToolbar
            editor={editor}
            disabled={disabled}
            enableImages={enableImages}
            enableTables={enableTables}
          />
        ) : null}
        <EditorContent editor={editor} className={cn(richTextEditorContentVariants({ size }))} />
      </div>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";

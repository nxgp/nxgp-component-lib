import type { Editor } from "@tiptap/react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
  TableIcon,
  UnlinkIcon,
} from "../../lib/icons";
import { Button } from "../button/button";
import { Separator } from "../separator/separator";
import { richTextEditorToolbarVariants } from "./rich-text-editor.variants";
import { RichTextEditorImageButton } from "./rich-text-editor-image-button";
import { RichTextEditorLinkButton } from "./rich-text-editor-link-button";

export type RichTextEditorToolbarProps = {
  editor: Editor | null;
  className?: string;
  disabled?: boolean;
  enableImages?: boolean;
  enableTables?: boolean;
};

type ToolbarToggleProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & {
  pressed?: boolean;
};

function ToolbarToggle({ pressed, className, ...props }: ToolbarToggleProps) {
  return (
    <Button
      type="button"
      variant={pressed ? "secondary" : "ghost"}
      size="icon-sm"
      aria-pressed={pressed}
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Formatting toolbar for {@link RichTextEditor}.
 */
export function RichTextEditorToolbar({
  editor,
  className,
  disabled,
  enableImages = true,
  enableTables = true,
}: RichTextEditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const isDisabled = disabled || !editor.isEditable;

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className={cn(richTextEditorToolbarVariants(), className)}
    >
      <ToolbarToggle
        pressed={editor.isActive("bold")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <BoldIcon />
      </ToolbarToggle>
      <ToolbarToggle
        pressed={editor.isActive("italic")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <ItalicIcon />
      </ToolbarToggle>
      <ToolbarToggle
        pressed={editor.isActive("strike")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Strikethrough"
      >
        <StrikethroughIcon />
      </ToolbarToggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarToggle
        pressed={editor.isActive("bulletList")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
      >
        <ListIcon />
      </ToolbarToggle>
      <ToolbarToggle
        pressed={editor.isActive("orderedList")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Numbered list"
      >
        <ListOrderedIcon />
      </ToolbarToggle>
      <ToolbarToggle
        pressed={editor.isActive("blockquote")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote"
      >
        <QuoteIcon />
      </ToolbarToggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarToggle
        pressed={editor.isActive("codeBlock")}
        disabled={isDisabled}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code block"
      >
        <Code2Icon />
      </ToolbarToggle>

      {enableTables ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isDisabled}
          aria-label="Insert table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon />
        </Button>
      ) : null}

      {enableImages ? <RichTextEditorImageButton editor={editor} disabled={isDisabled} /> : null}

      <RichTextEditorLinkButton editor={editor} disabled={isDisabled} />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={isDisabled || !editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
        aria-label="Remove link"
      >
        <UnlinkIcon />
      </Button>
    </div>
  );
}

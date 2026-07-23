import type { Extensions } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import StarterKit from "@tiptap/starter-kit";

export type RichTextEditorExtensionsOptions = {
  placeholder?: string;
  /** Enable image nodes. @default true */
  images?: boolean;
  /** Enable table nodes. @default true */
  tables?: boolean;
};

/**
 * Default TipTap extensions for the kit editor — includes CMS-grade image and table support.
 */
export function createRichTextEditorExtensions({
  placeholder,
  images = true,
  tables = true,
}: RichTextEditorExtensionsOptions = {}) {
  const extensions: Extensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: false,
      codeBlock: {},
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      },
    }),
    Placeholder.configure({
      placeholder: placeholder ?? "Write something…",
      emptyEditorClass: "is-editor-empty",
    }),
  ];

  if (images) {
    extensions.push(
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md border border-border max-w-full h-auto",
        },
      }),
    );
  }

  if (tables) {
    extensions.push(
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full border-collapse text-sm",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-border",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-muted px-3 py-2 text-left font-medium",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border px-3 py-2 align-top",
        },
      }),
    );
  }

  return extensions;
}

import { cva, type VariantProps } from "class-variance-authority";
import { focusWithinRing, formFieldMotion } from "../../lib/interactive.variants";

export const richTextEditorVariants = cva(
  `flex w-full flex-col overflow-hidden rounded-md border border-border bg-background text-foreground ${formFieldMotion} ${focusWithinRing}`,
  {
    variants: {
      size: {
        sm: "text-sm",
        default: "text-sm",
        lg: "text-base",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      disabled: false,
    },
  },
);

export const richTextEditorToolbarVariants = cva(
  "flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1",
);

/** Prose styles applied to the TipTap `ProseMirror` root. */
export const richTextEditorContentVariants = cva(
  [
    "min-h-editor-md w-full px-3 py-2 outline-none",
    "[&_.ProseMirror]:min-h-inherit [&_.ProseMirror]:outline-none",
    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground",
    "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
    "[&_h1]:scroll-m-20 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight",
    "[&_h2]:scroll-m-20 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
    "[&_h3]:scroll-m-20 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight",
    "[&_p]:leading-7",
    "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
    "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6",
    "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
    "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
    "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm",
    "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
    "[&_table]:my-2 [&_table]:w-full [&_table]:border-collapse",
    "[&_img]:my-2 [&_img]:max-w-full [&_img]:rounded-md [&_img]:border [&_img]:border-border",
    "[&_strong]:font-semibold",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "min-h-editor-sm",
        default: "min-h-editor-md",
        lg: "min-h-editor-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type RichTextEditorVariantProps = VariantProps<typeof richTextEditorVariants>;
export type RichTextEditorContentVariantProps = VariantProps<typeof richTextEditorContentVariants>;

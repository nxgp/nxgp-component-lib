import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { ImageIcon } from "../../lib/icons";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";

export type RichTextEditorImageButtonProps = {
  editor: Editor;
  disabled?: boolean;
};

/** Image insertion popover for {@link RichTextEditor}. */
export function RichTextEditorImageButton({ editor, disabled }: RichTextEditorImageButtonProps) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    setSrc("");
    setAlt("");
  }, [open]);

  const applyImage = () => {
    const trimmed = src.trim();
    if (!trimmed) {
      setOpen(false);
      return;
    }
    editor
      .chain()
      .focus()
      .setImage({ src: trimmed, alt: alt.trim() || undefined })
      .run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label="Add image"
        >
          <ImageIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3 p-4" align="start">
        <div className="space-y-2">
          <Label htmlFor="rte-image-src">Image URL</Label>
          <Input
            id="rte-image-src"
            value={src}
            onChange={(event) => setSrc(event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rte-image-alt">Alt text</Label>
          <Input
            id="rte-image-alt"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={applyImage}>
            Insert
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import type { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { Link2Icon } from "../../lib/icons";
import { Button } from "../button/button";
import { Input } from "../input/input";
import { Label } from "../label/label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover";

export type RichTextEditorLinkButtonProps = {
  editor: Editor;
  disabled?: boolean;
};

/** Link editor popover — replaces `window.prompt` for URL entry. */
export function RichTextEditorLinkButton({ editor, disabled }: RichTextEditorLinkButtonProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("https://");

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    setUrl(previousUrl ?? "https://");
  }, [editor, open]);

  const applyLink = () => {
    if (url.trim() === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="icon-sm"
          disabled={disabled}
          aria-label="Add link"
        >
          <Link2Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3 p-4" align="start">
        <div className="space-y-2">
          <Label htmlFor="rte-link-url">URL</Label>
          <Input
            id="rte-link-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
            }}
            placeholder="https://example.com"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={applyLink}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

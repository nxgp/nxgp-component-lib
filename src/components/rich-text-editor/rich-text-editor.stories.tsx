import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  hiddenArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { RichTextEditor } from "./rich-text-editor";
import { richTextHtmlToMarkdown } from "./rich-text-editor-markdown";

const defaultHtml = "<p>Edit <strong>rich text</strong> with the toolbar.</p>";

const meta = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  ...defineComponentStories(
    "Minimal WYSIWYG rich text editor powered by TipTap with optional formatting toolbar.",
    {
      size: choiceArg(["sm", "default", "lg"] as const, {
        description: "Editor height and typography preset.",
        defaultValue: "default",
      }),
      disabled: sharedArgTypes.disabled,
      showToolbar: booleanArg({
        description: "Show the formatting toolbar above the editing surface.",
        defaultValue: true,
      }),
      enableImages: booleanArg({
        description: "Enable image insertion in the toolbar.",
        defaultValue: true,
      }),
      enableTables: booleanArg({
        description: "Enable table insertion in the toolbar.",
        defaultValue: true,
      }),
      placeholder: textArg({
        description: "Placeholder shown when the editor is empty.",
        defaultValue: "Write something…",
      }),
      value: hiddenArg("Controlled HTML value."),
      defaultValue: hiddenArg("Initial HTML when uncontrolled."),
      onChange: hiddenArg("Called when content changes."),
    },
  ),
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

function RichTextOutputPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <pre className="max-h-48 overflow-auto rounded-md border border-border bg-muted p-3 text-xs text-foreground">
        {value || "—"}
      </pre>
    </div>
  );
}

export const Default: Story = playgroundStory({
  render: function PlaygroundStory(args) {
    const [html, setHtml] = useState(defaultHtml);
    const markdown = useMemo(() => richTextHtmlToMarkdown(html), [html]);

    return (
      <div className="max-w-2xl space-y-4">
        <RichTextEditor {...args} value={html} onChange={setHtml} aria-label="Article body" />
        <div className="grid gap-3 md:grid-cols-2">
          <RichTextOutputPanel label="HTML output" value={html} />
          <RichTextOutputPanel label="Markdown output" value={markdown} />
        </div>
      </div>
    );
  },
});

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="grid max-w-2xl gap-6">
      <RichTextEditor size="sm" placeholder="Small editor" aria-label="Small" />
      <RichTextEditor size="default" placeholder="Default editor" aria-label="Default" />
      <RichTextEditor size="lg" placeholder="Large editor" aria-label="Large" />
    </div>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="grid max-w-2xl gap-6">
      <RichTextEditor defaultValue="<p>Enabled editor</p>" aria-label="Enabled" />
      <RichTextEditor defaultValue="<p>Disabled editor</p>" disabled aria-label="Disabled" />
      <RichTextEditor
        defaultValue="<p>No toolbar</p>"
        showToolbar={false}
        aria-label="Without toolbar"
      />
    </div>
  ),
};

export const Controlled: Story = {
  ...storyDoc("Controlled open/value state for programmatic control."),
  render: function ControlledStory() {
    const [value, setValue] = useState("<p>Controlled <em>content</em></p>");
    const markdown = useMemo(() => richTextHtmlToMarkdown(value), [value]);

    return (
      <div className="max-w-2xl space-y-4">
        <RichTextEditor value={value} onChange={setValue} aria-label="Controlled editor" />
        <div className="grid gap-3 md:grid-cols-2">
          <RichTextOutputPanel label="HTML output" value={value} />
          <RichTextOutputPanel label="Markdown output" value={markdown} />
        </div>
      </div>
    );
  },
};

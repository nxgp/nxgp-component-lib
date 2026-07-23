import type { Meta, StoryObj } from "@storybook/react";
import {
  booleanArg,
  defineComponentStories,
  hiddenArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { expect, storyAction, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Upload, UploadDropzone, UploadList, UploadTrigger } from "./upload";

const meta = {
  title: "Components/Upload",
  component: Upload,
  tags: ["autodocs"],
  subcomponents: { UploadDropzone, UploadTrigger, UploadList },
  ...defineComponentStories(
    "File upload shell with dropzone, trigger button, and file list primitives.",
    {
      multiple: booleanArg({
        description: "Allow selecting multiple files (`false` = single file).",
        defaultValue: false,
      }),
      accept: textArg({
        description: "Accepted MIME types or patterns (native `accept`, e.g. `image/*`).",
      }),
      acceptExtensions: hiddenArg("Allowed extensions such as `.png,.pdf`."),
      prompt: textArg({
        description: "Dropzone helper text. Auto-generated from accept rules when omitted.",
      }),
      disabled: sharedArgTypes.disabled,
      value: hiddenArg("Controlled file list."),
      defaultFiles: hiddenArg("Initial files for uncontrolled usage."),
      onValueChange: hiddenArg("Called when the file list changes."),
    },
    ["onValueChange"],
  ),
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  actions: ["onValueChange"],
  args: {
    multiple: false,
    accept: "image/*",
    prompt: "Supports Images · Single file",
    disabled: false,
  },
  render: (args) => (
    <Upload {...args} className="max-w-md">
      <UploadDropzone />
      <UploadList />
    </Upload>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('input[type="file"]');
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Expected file input to be rendered");
    }
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await expect(storyAction(args, "onValueChange")).toHaveBeenCalled();
    await expect(canvas.getByText("hello.png")).toBeInTheDocument();
  },
});

export const InContext: Story = {
  ...storyDoc("Attachment field inside a support ticket form."),
  render: () => (
    <form
      className="w-full max-w-md space-y-4 rounded-lg border border-border bg-card p-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium">Report a bug</p>
        <p className="text-xs text-muted-foreground">
          Attach a screenshot to help us reproduce the issue.
        </p>
      </div>
      <Upload accept="image/*" acceptExtensions={[".png", ".jpg", ".webp"]}>
        <UploadDropzone />
        <UploadList />
      </Upload>
    </form>
  ),
};

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="flex flex-col gap-8">
      <Upload acceptExtensions={[".png", ".jpg", ".webp"]} className="max-w-md">
        <UploadDropzone />
        <UploadList />
      </Upload>
      <Upload accept="application/pdf" className="max-w-md">
        <UploadDropzone />
        <UploadList />
      </Upload>
      <Upload
        acceptExtensions={[".doc", ".docx"]}
        prompt="Word documents only"
        className="max-w-md"
      >
        <UploadDropzone />
        <UploadList />
      </Upload>
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <Upload className="max-w-md">
      <UploadDropzone />
      <UploadList />
    </Upload>
  ),
};

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="flex flex-col gap-8">
      <Upload multiple={false} accept="image/*" className="max-w-md">
        <UploadDropzone />
        <UploadTrigger />
        <UploadList />
      </Upload>
      <Upload multiple acceptExtensions={[".png", ".jpg", ".pdf"]} className="max-w-md">
        <UploadDropzone />
        <UploadTrigger />
        <UploadList />
      </Upload>
    </div>
  ),
};

export const WithTrigger: Story = {
  ...storyDoc("Example with trigger."),
  render: () => (
    <Upload className="max-w-md">
      <UploadTrigger />
      <UploadList />
    </Upload>
  ),
};

import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import { Upload, UploadDropzone, UploadList, UploadTrigger } from "./upload";

describe("Upload", () => {
  describe("rendering", () => {
    it("renders dropzone", () => {
      const { getByRole } = renderWithProviders(
        <Upload>
          <UploadDropzone />
        </Upload>,
      );
      expect(
        getByRole("button", { name: "Drop files here or click to browse" }),
      ).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("adds files via file input", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container } = renderWithProviders(
        <Upload onValueChange={onValueChange}>
          <UploadDropzone />
          <UploadList />
        </Upload>,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["hello"], "hello.txt", { type: "text/plain" });
      await user.upload(input, file);
      expect(onValueChange).toHaveBeenCalled();
      expect(onValueChange.mock.calls.at(-1)?.[0]?.[0]?.file.name).toBe("hello.txt");
    });

    it("adds files via drag and drop", () => {
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Upload onValueChange={onValueChange}>
          <UploadDropzone />
        </Upload>,
      );
      const dropzone = getByRole("button", { name: "Drop files here or click to browse" });
      const file = new File(["hello"], "drop.txt", { type: "text/plain" });
      const dataTransfer = {
        files: [file],
        types: ["Files"],
        getData: () => "",
        setData: () => {},
        dropEffect: "none" as DataTransfer["dropEffect"],
        effectAllowed: "none" as DataTransfer["effectAllowed"],
        items: [],
        clearData: () => {},
        setDragImage: () => {},
      };

      const dragOver = new Event("dragover", { bubbles: true });
      Object.defineProperty(dragOver, "preventDefault", { value: vi.fn() });
      dropzone.dispatchEvent(dragOver);

      const drop = new Event("drop", { bubbles: true });
      Object.defineProperty(drop, "dataTransfer", { value: dataTransfer });
      Object.defineProperty(drop, "preventDefault", { value: vi.fn() });
      dropzone.dispatchEvent(drop);

      expect(onValueChange).toHaveBeenCalled();
      expect(onValueChange.mock.calls.at(-1)?.[0]?.[0]?.file.name).toBe("drop.txt");
    });

    it("opens file dialog from trigger", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container, getByRole } = renderWithProviders(
        <Upload onValueChange={onValueChange}>
          <UploadTrigger />
        </Upload>,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const clickSpy = vi.spyOn(input, "click");
      await user.click(getByRole("button", { name: "Choose file" }));
      expect(clickSpy).toHaveBeenCalled();
    });

    it("shows accept prompt and single-file hint in dropzone", () => {
      const { getByText } = renderWithProviders(
        <Upload acceptExtensions={[".png", ".jpg"]}>
          <UploadDropzone />
        </Upload>,
      );
      expect(getByText("Supports PNG, JPG · Single file")).toBeInTheDocument();
    });

    it("shows multiple-file hint on trigger", () => {
      const { getByRole } = renderWithProviders(
        <Upload multiple accept="image/*">
          <UploadTrigger />
        </Upload>,
      );
      expect(getByRole("button", { name: "Choose files" })).toBeInTheDocument();
    });

    it("ignores files that do not match accept rules", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container } = renderWithProviders(
        <Upload acceptExtensions={[".png"]} onValueChange={onValueChange}>
          <UploadDropzone />
        </Upload>,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, new File(["txt"], "notes.txt", { type: "text/plain" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("uses custom prompt when provided", () => {
      const { getByText } = renderWithProviders(
        <Upload prompt="Upload your invoice PDF">
          <UploadDropzone />
        </Upload>,
      );
      expect(getByText("Upload your invoice PDF")).toBeInTheDocument();
    });

    it("shows an image preview for image uploads", () => {
      vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:image-preview");
      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

      const { container } = renderWithProviders(
        <Upload
          defaultFiles={[
            {
              id: "1",
              file: new File(["img"], "photo.jpg", { type: "image/jpeg" }),
              status: "pending",
            },
          ]}
        >
          <UploadList />
        </Upload>,
      );

      const thumbnail = container.querySelector("[data-slot=upload-file-thumbnail]");
      expect(thumbnail).toHaveAttribute("data-file-kind", "image");
      expect(thumbnail?.querySelector("img")).toHaveAttribute("src", "blob:image-preview");
    });

    it("shows a file icon for non-image uploads", () => {
      const { container } = renderWithProviders(
        <Upload
          defaultFiles={[
            {
              id: "1",
              file: new File(["hello"], "hello.txt", { type: "text/plain" }),
              status: "pending",
            },
          ]}
        >
          <UploadList />
        </Upload>,
      );

      const thumbnail = container.querySelector("[data-slot=upload-file-thumbnail]");
      expect(thumbnail).toHaveAttribute("data-file-kind", "text");
      expect(thumbnail?.querySelector("img")).toBeNull();
      expect(thumbnail?.querySelector("svg")).toBeInTheDocument();
    });

    it("shows upload progress and error state", () => {
      const { getByText, getByRole } = renderWithProviders(
        <Upload
          defaultFiles={[
            {
              id: "1",
              file: new File(["a"], "uploading.txt"),
              status: "uploading",
              progress: 40,
            },
            {
              id: "2",
              file: new File(["b"], "failed.txt"),
              status: "error",
              error: "Network error",
            },
          ]}
        >
          <UploadList />
        </Upload>,
      );
      expect(
        getByRole("progressbar", { name: "Upload progress for uploading.txt" }),
      ).toBeInTheDocument();
      expect(getByText(/Network error/)).toBeInTheDocument();
    });

    it("removes a file from the list", async () => {
      const user = userEvent.setup();
      const { container, getByRole, queryByText } = renderWithProviders(
        <Upload defaultFiles={[{ id: "1", file: new File(["a"], "a.txt"), status: "pending" }]}>
          <UploadList />
        </Upload>,
      );
      expect(queryByText("a.txt")).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Remove a.txt" }));
      expect(queryByText("a.txt")).not.toBeInTheDocument();
      expect(container.querySelector("[data-slot=upload-list]")).toBeNull();
    });

    it("supports controlled value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const files = [{ id: "1", file: new File(["a"], "a.txt"), status: "pending" as const }];
      const { container } = renderWithProviders(
        <Upload value={files} onValueChange={onValueChange}>
          <UploadDropzone />
        </Upload>,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, new File(["b"], "b.txt", { type: "text/plain" }));
      expect(onValueChange).toHaveBeenCalled();
    });

    it("replaces file when multiple is false", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { container } = renderWithProviders(
        <Upload multiple={false} onValueChange={onValueChange}>
          <UploadDropzone />
        </Upload>,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, new File(["first"], "first.txt", { type: "text/plain" }));
      await user.upload(input, new File(["second"], "second.txt", { type: "text/plain" }));
      const last = onValueChange.mock.calls.at(-1)?.[0];
      expect(last).toHaveLength(1);
      expect(last?.[0]?.file.name).toBe("second.txt");
    });

    it("ignores drag and drop when disabled", () => {
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <Upload disabled onValueChange={onValueChange}>
          <UploadDropzone />
        </Upload>,
      );
      const dropzone = getByRole("button", { name: "Drop files here or click to browse" });
      const file = new File(["hello"], "drop.txt", { type: "text/plain" });
      const dataTransfer = {
        files: [file],
        types: ["Files"],
        getData: () => "",
        setData: () => {},
        dropEffect: "none" as DataTransfer["dropEffect"],
        effectAllowed: "none" as DataTransfer["effectAllowed"],
        items: [],
        clearData: () => {},
        setDragImage: () => {},
      };

      const dragOver = new Event("dragover", { bubbles: true });
      Object.defineProperty(dragOver, "preventDefault", { value: vi.fn() });
      dropzone.dispatchEvent(dragOver);

      const drop = new Event("drop", { bubbles: true });
      Object.defineProperty(drop, "dataTransfer", { value: dataTransfer });
      Object.defineProperty(drop, "preventDefault", { value: vi.fn() });
      dropzone.dispatchEvent(drop);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("shows progress when file has progress without uploading status", () => {
      const { getByRole } = renderWithProviders(
        <Upload
          defaultFiles={[
            { id: "1", file: new File(["a"], "pending.txt"), status: "pending", progress: 25 },
          ]}
        >
          <UploadList />
        </Upload>,
      );
      expect(
        getByRole("progressbar", { name: "Upload progress for pending.txt" }),
      ).toBeInTheDocument();
    });

    it("announces plural file count in live region", async () => {
      const user = userEvent.setup();
      const { container, getByText } = renderWithProviders(
        <Upload multiple>
          <UploadDropzone />
        </Upload>,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      await user.upload(input, [
        new File(["a"], "a.txt", { type: "text/plain" }),
        new File(["b"], "b.txt", { type: "text/plain" }),
      ]);
      expect(getByText("2 files selected")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Upload>
          <UploadDropzone />
        </Upload>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("throws when dropzone is used outside Upload", () => {
      expect(() => renderWithProviders(<UploadDropzone />)).toThrow(
        "UploadDropzone must be used within Upload",
      );
    });
  });
});

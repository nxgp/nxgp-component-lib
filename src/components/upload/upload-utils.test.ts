import { describe, expect, it } from "vitest";
import {
  buildUploadPrompt,
  extensionsToAccept,
  filterAcceptedFiles,
  isFileAccepted,
  resolveUploadAccept,
} from "./upload-utils";

describe("upload-utils", () => {
  it("merges accept and extensions", () => {
    expect(resolveUploadAccept("image/*", [".png", "jpg"])).toBe("image/*,.png,.jpg");
  });

  it("builds prompt for extensions and selection mode", () => {
    expect(
      buildUploadPrompt({
        acceptExtensions: [".png", ".jpg"],
        multiple: true,
      }),
    ).toBe("Supports PNG, JPG · Multiple files");
  });

  it("filters files by extension", () => {
    const files = [
      new File(["a"], "photo.png", { type: "image/png" }),
      new File(["b"], "notes.txt", { type: "text/plain" }),
    ];

    expect(filterAcceptedFiles(files, undefined, [".png"])).toHaveLength(1);
    expect(filterAcceptedFiles(files, undefined, [".png"])[0]?.name).toBe("photo.png");
  });

  it("matches mime accept patterns", () => {
    const file = new File(["a"], "photo.jpg", { type: "image/jpeg" });
    expect(isFileAccepted(file, "image/*")).toBe(true);
    expect(extensionsToAccept(["png"])).toBe(".png");
  });
});

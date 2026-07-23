import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FileTextIcon,
  FileVideoIcon,
  ImageIcon,
} from "../../lib/icons";
import { uploadFileThumbnailVariants } from "./upload.variants";

type UploadFileKind = "image" | "video" | "audio" | "pdf" | "text" | "archive" | "generic";

function getUploadFileKind(file: File): UploadFileKind {
  const name = file.name.toLowerCase();

  if (file.type.startsWith("image/") || /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(name)) {
    return "image";
  }
  if (file.type.startsWith("video/") || /\.(mp4|mov|webm|ogg|m4v)$/i.test(name)) {
    return "video";
  }
  if (file.type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(name)) {
    return "audio";
  }
  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return "pdf";
  }
  if (
    file.type.startsWith("text/") ||
    /\.(txt|md|csv|json|xml|html?|yml|yaml|ts|tsx|js|jsx)$/i.test(name)
  ) {
    return "text";
  }
  if (
    file.type.includes("zip") ||
    file.type.includes("archive") ||
    /\.(zip|rar|7z|tar|gz|tgz)$/i.test(name)
  ) {
    return "archive";
  }
  return "generic";
}

function useUploadPreviewUrl(file: File, enabled: boolean) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [enabled, file]);

  return url;
}

function UploadFileTypeIcon({ kind }: { kind: UploadFileKind }) {
  const className = "size-5 shrink-0 text-muted-foreground";

  switch (kind) {
    case "image":
      return <ImageIcon className={className} />;
    case "video":
      return <FileVideoIcon className={className} />;
    case "audio":
      return <FileAudioIcon className={className} />;
    case "pdf":
    case "text":
      return <FileTextIcon className={className} />;
    case "archive":
      return <FileArchiveIcon className={className} />;
    default:
      return <FileIcon className={className} />;
  }
}

export type UploadFileThumbnailProps = {
  file: File;
  className?: string;
};

/** Visual preview or file-type icon for an upload list item. */
export function UploadFileThumbnail({ file, className }: UploadFileThumbnailProps) {
  const kind = useMemo(() => getUploadFileKind(file), [file]);
  const previewUrl = useUploadPreviewUrl(file, kind === "image" || kind === "video");

  return (
    <div
      data-slot="upload-file-thumbnail"
      data-file-kind={kind}
      className={cn(uploadFileThumbnailVariants(), className)}
    >
      {kind === "image" && previewUrl ? (
        <img src={previewUrl} alt="" className="size-full object-cover" />
      ) : null}
      {kind === "video" && previewUrl ? (
        <video
          src={previewUrl}
          muted
          playsInline
          preload="metadata"
          className="size-full object-cover"
        />
      ) : null}
      {(kind !== "image" && kind !== "video") || !previewUrl ? (
        <UploadFileTypeIcon kind={kind} />
      ) : null}
    </div>
  );
}

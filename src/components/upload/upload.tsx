import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import { UploadIcon, XIcon } from "../../lib/icons";
import { Button, type ButtonProps } from "../button/button";
import { Progress } from "../progress/progress";
import { type UploadDropzoneVariantProps, uploadDropzoneVariants } from "./upload.variants";
import { UploadFileThumbnail } from "./upload-file-thumbnail";
import { buildUploadPrompt, filterAcceptedFiles, resolveUploadAccept } from "./upload-utils";

export type UploadFile = {
  id: string;
  file: File;
  progress?: number;
  status?: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type UploadContextValue = {
  files: UploadFile[];
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  acceptExtensions?: string[];
  prompt?: string;
  inputId: string;
  openFileDialog: () => void;
};

const UploadContext = createContext<UploadContextValue | null>(null);

function useUpload(component: string): UploadContextValue {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error(`${component} must be used within Upload`);
  }
  return context;
}

function createUploadFile(file: File): UploadFile {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
    progress: 0,
    status: "pending",
  };
}

export type UploadProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
  /** Controlled file list. */
  value?: UploadFile[];
  /** Default files when uncontrolled. */
  defaultFiles?: UploadFile[];
  onValueChange?: (files: UploadFile[]) => void;
  /** Allow selecting more than one file. @default false */
  multiple?: boolean;
  /** Native file input `accept` value (MIME types and/or extensions). */
  accept?: string;
  /** Allowed file extensions (e.g. `[".png", ".pdf"]`). Merged into `accept`. */
  acceptExtensions?: string[];
  /** Helper text shown in {@link UploadDropzone} for supported types and selection mode. */
  prompt?: string;
  disabled?: boolean;
  children?: ReactNode;
};

/**
 * File upload shell with dropzone, trigger, and file list primitives.
 *
 * @example
 * ```tsx
 * <Upload multiple acceptExtensions={[".png", ".jpg"]} onValueChange={setFiles}>
 *   <UploadDropzone />
 *   <UploadList />
 * </Upload>
 * ```
 */
export function Upload({
  className,
  value,
  defaultFiles = [],
  onValueChange,
  multiple = false,
  accept,
  acceptExtensions,
  prompt,
  disabled = false,
  children,
  ...props
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [uncontrolledFiles, setUncontrolledFiles] = useState<UploadFile[]>(defaultFiles);
  const files = value ?? uncontrolledFiles;
  const resolvedAccept = useMemo(
    () => resolveUploadAccept(accept, acceptExtensions),
    [accept, acceptExtensions],
  );
  const resolvedPrompt = useMemo(
    () => prompt ?? buildUploadPrompt({ accept, acceptExtensions, multiple }),
    [accept, acceptExtensions, multiple, prompt],
  );

  const setFiles = useCallback(
    (next: UploadFile[] | ((current: UploadFile[]) => UploadFile[])) => {
      const resolved = typeof next === "function" ? next(files) : next;
      if (value === undefined) {
        setUncontrolledFiles(resolved);
      }
      onValueChange?.(resolved);
    },
    [files, onValueChange, value],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const accepted = filterAcceptedFiles(Array.from(incoming), accept, acceptExtensions);
      const first = accepted[0];
      if (!first) {
        return;
      }
      const nextFiles = multiple ? accepted.map(createUploadFile) : [createUploadFile(first)];
      setFiles((current) => (multiple ? [...current, ...nextFiles] : nextFiles));
    },
    [accept, acceptExtensions, multiple, setFiles],
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((current) => current.filter((item) => item.id !== id));
    },
    [setFiles],
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const context = useMemo(
    () => ({
      files,
      addFiles,
      removeFile,
      disabled,
      multiple,
      accept: resolvedAccept,
      acceptExtensions,
      prompt: resolvedPrompt,
      inputId,
      openFileDialog,
    }),
    [
      files,
      addFiles,
      removeFile,
      disabled,
      multiple,
      resolvedAccept,
      acceptExtensions,
      resolvedPrompt,
      inputId,
      openFileDialog,
    ],
  );

  return (
    <UploadContext.Provider value={context}>
      <div data-slot="upload" className={cn("flex flex-col gap-3", className)} {...props}>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {files.length === 0
            ? a11yLabels.uploadDropzone
            : `${files.length} file${files.length === 1 ? "" : "s"} selected`}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          aria-label="Choose files"
          multiple={multiple}
          accept={resolvedAccept}
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files);
            }
            event.target.value = "";
          }}
        />
        {children}
      </div>
    </UploadContext.Provider>
  );
}

export type UploadDropzoneProps = ComponentPropsWithoutRef<"button"> &
  UploadDropzoneVariantProps & {
    /** Overrides the prompt inherited from {@link Upload}. */
    prompt?: string;
  };

/** Drag-and-drop target for {@link Upload}. */
export const UploadDropzone = forwardRef<HTMLButtonElement, UploadDropzoneProps>(
  ({ className, children, prompt: promptProp, ...props }, ref) => {
    const { addFiles, disabled, openFileDialog, prompt } = useUpload("UploadDropzone");
    const [active, setActive] = useState(false);
    const helperText = promptProp ?? prompt;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="upload-dropzone"
        disabled={disabled}
        aria-label={a11yLabels.uploadDropzone}
        className={cn(uploadDropzoneVariants({ active, disabled, className }))}
        onClick={openFileDialog}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setActive(true);
          }
        }}
        onDragLeave={() => setActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setActive(false);
          if (!disabled && event.dataTransfer.files.length) {
            addFiles(event.dataTransfer.files);
          }
        }}
        {...props}
      >
        <UploadIcon className="size-8 text-muted-foreground" aria-hidden />
        {children ?? (
          <>
            <p className="font-medium text-foreground">Drop files here or click to browse</p>
            {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
          </>
        )}
      </button>
    );
  },
);
UploadDropzone.displayName = "UploadDropzone";

export type UploadTriggerProps = Omit<ButtonProps, "type">;

/** Button that opens the hidden file input. */
export const UploadTrigger = forwardRef<HTMLButtonElement, UploadTriggerProps>(
  ({ className, children, disabled: disabledProp, ...props }, ref) => {
    const { openFileDialog, disabled, inputId, multiple } = useUpload("UploadTrigger");

    return (
      <Button
        ref={ref}
        type="button"
        variant="outline"
        disabled={disabledProp ?? disabled}
        className={className}
        aria-controls={inputId}
        onClick={openFileDialog}
        {...props}
      >
        {children ?? (multiple ? "Choose files" : "Choose file")}
      </Button>
    );
  },
);
UploadTrigger.displayName = "UploadTrigger";

export type UploadListProps = HTMLAttributes<HTMLUListElement>;

/** Renders the current {@link UploadFile} entries. */
export const UploadList = forwardRef<HTMLUListElement, UploadListProps>(
  ({ className, ...props }, ref) => {
    const { files } = useUpload("UploadList");

    if (!files.length) {
      return null;
    }

    return (
      <ul
        ref={ref}
        data-slot="upload-list"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {files.map((item) => (
          <UploadItem key={item.id} file={item} />
        ))}
      </ul>
    );
  },
);
UploadList.displayName = "UploadList";

export type UploadItemProps = HTMLAttributes<HTMLLIElement> & {
  file: UploadFile;
};

export const UploadItem = forwardRef<HTMLLIElement, UploadItemProps>(
  ({ className, file, ...props }, ref) => {
    const { removeFile } = useUpload("UploadItem");

    return (
      <li
        ref={ref}
        data-slot="upload-item"
        className={cn("flex flex-col gap-2 rounded-md border border-border p-3", className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <UploadFileThumbnail file={file.file} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.file.size / 1024).toFixed(1)} KB
                {file.status === "error" && file.error ? ` · ${file.error}` : null}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={a11yLabels.uploadRemoveFile(file.file.name)}
            onClick={() => removeFile(file.id)}
          >
            <XIcon className="size-4" aria-hidden />
          </Button>
        </div>
        {file.status === "uploading" || file.progress ? (
          <Progress
            value={file.progress ?? 0}
            aria-label={`Upload progress for ${file.file.name}`}
          />
        ) : null}
      </li>
    );
  },
);
UploadItem.displayName = "UploadItem";

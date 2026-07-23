/** Normalizes an extension to include a leading dot. */
export function normalizeExtension(extension: string): string {
  const trimmed = extension.trim();
  return trimmed.startsWith(".") ? trimmed : `.${trimmed}`;
}

/** Converts extension tokens into a native `accept` attribute value. */
export function extensionsToAccept(extensions: string[]): string {
  return extensions.map(normalizeExtension).join(",");
}

/** Merges MIME/`accept` tokens and extension tokens into one `accept` value. */
export function resolveUploadAccept(
  accept?: string,
  acceptExtensions?: string[],
): string | undefined {
  const parts = [
    accept?.trim(),
    acceptExtensions?.length ? extensionsToAccept(acceptExtensions) : "",
  ]
    .filter(Boolean)
    .join(",");

  return parts || undefined;
}

function formatAcceptToken(token: string): string {
  if (token === "image/*") {
    return "Images";
  }
  if (token.endsWith("/*")) {
    return `${token.slice(0, -2).toUpperCase()} files`;
  }
  if (token.startsWith(".")) {
    return token.slice(1).toUpperCase();
  }
  return token;
}

/** Builds dropzone helper text from accept rules and selection mode. */
export function buildUploadPrompt(options: {
  accept?: string;
  acceptExtensions?: string[];
  multiple?: boolean;
}): string | undefined {
  const { accept, acceptExtensions, multiple } = options;
  const hints: string[] = [];

  if (acceptExtensions?.length) {
    hints.push(
      `Supports ${acceptExtensions.map((extension) => extension.replace(/^\./, "").toUpperCase()).join(", ")}`,
    );
  } else if (accept) {
    hints.push(
      `Supports ${accept
        .split(",")
        .map((part) => formatAcceptToken(part.trim()))
        .join(", ")}`,
    );
  }

  hints.push(multiple ? "Multiple files" : "Single file");

  if (hints.length === 1) {
    return hints[0];
  }

  return hints.join(" · ");
}

/** Returns whether a file matches the configured accept rules. */
export function isFileAccepted(file: File, accept?: string, acceptExtensions?: string[]): boolean {
  if (!accept && !acceptExtensions?.length) {
    return true;
  }

  const lowerName = file.name.toLowerCase();

  if (
    acceptExtensions?.some((extension) =>
      lowerName.endsWith(normalizeExtension(extension).toLowerCase()),
    )
  ) {
    return true;
  }

  if (accept) {
    for (const token of accept
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)) {
      if (token.startsWith(".")) {
        if (lowerName.endsWith(token.toLowerCase())) {
          return true;
        }
        continue;
      }

      if (token.endsWith("/*")) {
        const base = token.slice(0, -1);
        if (file.type.startsWith(base)) {
          return true;
        }
        continue;
      }

      if (file.type === token) {
        return true;
      }
    }
  }

  return false;
}

/** Filters a file list to only accepted entries. */
export function filterAcceptedFiles(
  files: File[],
  accept?: string,
  acceptExtensions?: string[],
): File[] {
  return files.filter((file) => isFileAccepted(file, accept, acceptExtensions));
}

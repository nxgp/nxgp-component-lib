/**
 * Default accessible labels for internal primitives.
 * Override via component props; wire i18n by replacing this module in app builds.
 */
export const a11yLabels = {
  dismissAlert: "Dismiss alert",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  goToSlide: (index: number) => `Go to slide ${index}`,
  paginationPrevious: "Go to previous page",
  paginationNext: "Go to next page",
  paginationPage: (page: number) => `Go to page ${page}`,
  showPassword: "Show password",
  hidePassword: "Hide password",
  clearInput: "Clear input",
  toggleColumns: "Toggle columns",
  tableLoading: "Loading table data",
  tableSortedBy: (column: string, direction: "ascending" | "descending") =>
    `Sorted by ${column}, ${direction}`,
  uploadDropzone: "Drop files here or click to browse",
  uploadRemoveFile: (name: string) => `Remove ${name}`,
  commandDialogSearch: "Search commands and pages",
  commandDialogShortcut: "Meta+K",
  chatCopyMessage: "Copy message",
  chatRegenerate: "Regenerate response",
  chatStopGenerating: "Stop generating",
  chatEditMessage: "Edit message",
  chatFeedbackPositive: "Good response",
  chatFeedbackNegative: "Bad response",
  chatSendMessage: "Send message",
  chatComposerLabel: "Message composer",
} as const;

export type A11yLabels = typeof a11yLabels;

/** Page index or ellipsis sentinel for windowed pagination. */
export type PaginationPageItem = number | "ellipsis";

/**
 * Returns 0-based page indices with ellipsis sentinels for large page counts.
 * Shows all pages when `pageCount <= 7`.
 */
export function getPaginationRange(pageCount: number, pageIndex: number): PaginationPageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const pages: PaginationPageItem[] = [0];
  const last = pageCount - 1;
  const start = Math.max(1, pageIndex - 1);
  const end = Math.min(last - 1, pageIndex + 1);

  if (start > 1) {
    pages.push("ellipsis");
  }

  for (let index = start; index <= end; index++) {
    pages.push(index);
  }

  if (end < last - 1) {
    pages.push("ellipsis");
  }

  pages.push(last);
  return pages;
}

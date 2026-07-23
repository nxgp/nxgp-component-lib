import type { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination/pagination";
import { getPaginationRange } from "./data-table-pagination-range";

export type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  /** Accessible label for the pagination nav. @default "Table pagination" */
  label?: string;
  className?: string;
};

/**
 * Pagination controls wired to a TanStack {@link Table} instance.
 */
export function DataTablePagination<TData>({
  table,
  label = "Table pagination",
  className,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  if (pageCount <= 1) {
    return null;
  }

  const pages = getPaginationRange(pageCount, pageIndex);
  const pageItems = pages.map((page, index, items) => {
    if (page === "ellipsis") {
      const ellipsisIndex = items.slice(0, index).filter((item) => item === "ellipsis").length;
      return {
        type: "ellipsis" as const,
        key: ellipsisIndex === 0 ? "ellipsis-start" : "ellipsis-end",
      };
    }

    return { type: "page" as const, key: `page-${page}`, page };
  });

  return (
    <Pagination label={label} className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              table.previousPage();
            }}
            aria-disabled={!table.getCanPreviousPage()}
            className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pageItems.map((item) =>
          item.type === "ellipsis" ? (
            <PaginationItem key={item.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.key}>
              <PaginationLink
                href="#"
                isActive={pageIndex === item.page}
                onClick={(event) => {
                  event.preventDefault();
                  table.setPageIndex(item.page);
                }}
              >
                {item.page + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              table.nextPage();
            }}
            aria-disabled={!table.getCanNextPage()}
            className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

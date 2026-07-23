import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { type CSSProperties, useCallback, useMemo, useRef, useState } from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import {
  PaginationRowsPerPage,
  PaginationToolbar,
  PaginationToolbarCenter,
  PaginationToolbarEnd,
  PaginationToolbarStart,
} from "../pagination/pagination";
import { Skeleton } from "../skeleton/skeleton";
import { type DataTableVariantProps, dataTableVariants } from "./data-table.variants";
import { DataTablePagination } from "./data-table-pagination";
import {
  DataTableSelectAllCheckbox,
  DataTableSelectRowCheckbox,
  DataTableToolbar,
} from "./data-table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
};

export type DataTableProps<TData, TValue = unknown> = DataTableVariantProps & {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Show skeleton placeholder rows. */
  loading?: boolean;
  /** Message when no rows match filters. @default "No results." */
  emptyMessage?: string;
  /** Enable column sorting. @default true */
  enableSorting?: boolean;
  /** Enable global text filter in toolbar. @default true */
  enableFiltering?: boolean;
  /** Enable client-side pagination. @default true */
  enablePagination?: boolean;
  /** Enable row selection checkboxes. @default false */
  enableRowSelection?: boolean;
  /** Enable column visibility toggles. @default true */
  enableColumnVisibility?: boolean;
  /** Enable per-column text filters in the toolbar. @default false */
  enableColumnFilters?: boolean;
  /** Enable drag-reorder in the column visibility menu. @default false */
  enableColumnReordering?: boolean;
  /** Virtualize body rows for large datasets. @default false */
  enableVirtualization?: boolean;
  /**
   * Estimated row height when virtualizing (fixed-height rows).
   * @default 48
   */
  estimateRowHeight?: number;
  /**
   * Pin header while the table body scrolls.
   * Requires `maxHeight` or `enableVirtualization` for internal scrolling.
   * @default true
   */
  stickyHeader?: boolean;
  /**
   * Initial rows per page when pagination is enabled (seeds TanStack `initialState` only).
   * @default 10
   */
  pageSize?: number;
  /** Page-size options for the footer selector. Omit to hide the selector. */
  pageSizeOptions?: number[];
  /** Max height of the scroll container (`number` = px). Defaults to 480px when virtualizing. */
  maxHeight?: number | string;
  /** Placeholder for the global filter input. @default "Filter rows…" */
  filterPlaceholder?: string;
  /** Stable row id for selection and updates. */
  getRowId?: (row: TData, index: number) => string;
  /** Called when row selection changes. */
  onRowSelectionChange?: (state: RowSelectionState) => void;
  /** Called when sorting changes. */
  onSortingChange?: (state: SortingState) => void;
  /** Called when the global filter changes. */
  onGlobalFilterChange?: (value: string) => void;
  /** Server-side pagination — set with `pageCount` and controlled `pagination`. */
  manualPagination?: boolean;
  /** Server-side sorting — sorting state is controlled externally. */
  manualSorting?: boolean;
  /** Server-side filtering — filter state is controlled externally. */
  manualFiltering?: boolean;
  /** Total page count from the server when `manualPagination` is true. */
  pageCount?: number;
  /** Total row count from the server (for footer display). */
  rowCount?: number;
  /** Controlled pagination state for server mode. */
  pagination?: PaginationState;
  /** Called when pagination changes in server mode. */
  onPaginationChange?: (state: PaginationState) => void;
  /** Controlled sorting state — omit to manage internally. */
  sorting?: SortingState;
  /** Controlled column filters — omit to manage internally. */
  columnFilters?: ColumnFiltersState;
  /** Called when column filters change. */
  onColumnFiltersChange?: (state: ColumnFiltersState) => void;
  /** Controlled global filter value — omit to manage internally. */
  globalFilter?: string;
  /** Hide built-in toolbar. @default false */
  hideToolbar?: boolean;
  /** Hide built-in pagination. @default false */
  hidePagination?: boolean;
  className?: string;
  /** Accessible label for the table. */
  "aria-label"?: string;
};

function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => <DataTableSelectAllCheckbox table={table} />,
    cell: ({ row, table }) => <DataTableSelectRowCheckbox table={table} rowId={row.id} />,
    enableSorting: false,
    enableHiding: false,
  };
}

function getAriaSortValue<TData, TValue>(
  column: Column<TData, TValue>,
): "ascending" | "descending" | "none" | undefined {
  if (!column.getCanSort()) {
    return undefined;
  }

  const sorted = column.getIsSorted();
  if (sorted === "asc") {
    return "ascending";
  }
  if (sorted === "desc") {
    return "descending";
  }
  return "none";
}

function resolveMaxHeightStyle(
  maxHeight: number | string | undefined,
  enableVirtualization: boolean,
): CSSProperties | undefined {
  const resolved = maxHeight ?? (enableVirtualization ? 480 : undefined);
  if (resolved === undefined) {
    return undefined;
  }

  return {
    maxHeight: typeof resolved === "number" ? `${resolved}px` : resolved,
  };
}

/**
 * Advanced data table built on TanStack Table with sorting, filtering, pagination,
 * column visibility, row selection, sticky header, and optional virtualization.
 *
 * @example
 * ```tsx
 * import { DataTable, type ColumnDef } from "@nxgp/component-lib";
 *
 * const columns: ColumnDef<Payment>[] = [
 *   { accessorKey: "email", header: "Email" },
 * ];
 *
 * <DataTable columns={columns} data={payments} enableRowSelection />
 * ```
 */
export function DataTable<TData, TValue = unknown>({
  columns,
  data,
  loading = false,
  emptyMessage = "No results.",
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = false,
  enableColumnVisibility = true,
  enableColumnFilters = false,
  enableColumnReordering = false,
  enableVirtualization = false,
  estimateRowHeight = 48,
  stickyHeader = true,
  pageSize = 10,
  pageSizeOptions,
  maxHeight,
  filterPlaceholder,
  getRowId,
  onRowSelectionChange,
  onSortingChange,
  onGlobalFilterChange,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  rowCount,
  pagination: paginationProp,
  onPaginationChange,
  sorting: sortingProp,
  columnFilters: columnFiltersProp,
  onColumnFiltersChange,
  globalFilter: globalFilterProp,
  hideToolbar = false,
  hidePagination = false,
  layout,
  className,
  "aria-label": ariaLabel,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const sorting = sortingProp ?? internalSorting;
  const columnFilters = columnFiltersProp ?? internalColumnFilters;
  const globalFilter = globalFilterProp ?? internalGlobalFilter;
  const pagination = paginationProp ?? internalPagination;

  const handleSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (sortingProp === undefined) {
        setInternalSorting(next);
      }
      onSortingChange?.(next);
    },
    [onSortingChange, sorting, sortingProp],
  );

  const handleColumnFiltersChange = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const next = typeof updater === "function" ? updater(columnFilters) : updater;
      if (columnFiltersProp === undefined) {
        setInternalColumnFilters(next);
      }
      onColumnFiltersChange?.(next);
    },
    [columnFilters, columnFiltersProp, onColumnFiltersChange],
  );

  const handlePaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      if (paginationProp === undefined) {
        setInternalPagination(next);
      }
      onPaginationChange?.(next);
    },
    [onPaginationChange, pagination, paginationProp],
  );

  const handleRowSelectionChange = useCallback(
    (updater: Updater<RowSelectionState>) => {
      setRowSelection((previous) => {
        const next = typeof updater === "function" ? updater(previous) : updater;
        onRowSelectionChange?.(next);
        return next;
      });
    },
    [onRowSelectionChange],
  );

  const handleGlobalFilterChange = useCallback(
    (updater: Updater<string>) => {
      const next = typeof updater === "function" ? updater(globalFilter) : updater;
      if (globalFilterProp === undefined) {
        setInternalGlobalFilter(next);
      }
      onGlobalFilterChange?.(next);
    },
    [globalFilter, globalFilterProp, onGlobalFilterChange],
  );

  const resolvedColumns = useMemo(
    () => (enableRowSelection ? [createSelectionColumn<TData>(), ...columns] : columns),
    [columns, enableRowSelection],
  );

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
      globalFilter,
      pagination,
    },
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    rowCount,
    enableSorting,
    enableRowSelection,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: handleRowSelectionChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering && !manualFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel:
      enablePagination && !manualPagination ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: { pageSize },
    },
  });

  const rows = table.getRowModel().rows;
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: enableVirtualization ? rows.length : 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 8,
  });

  const virtualRows = enableVirtualization ? virtualizer.getVirtualItems() : [];
  const paddingTop = virtualRows.length > 0 ? (virtualRows[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end ?? 0)
      : 0;

  const scrollStyle = resolveMaxHeightStyle(maxHeight, enableVirtualization);
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const filteredCount = rowCount ?? table.getFilteredRowModel().rows.length;
  const resolvedPageCount = manualPagination ? (pageCount ?? 0) : table.getPageCount();
  const tableAnnouncement = useMemo(() => {
    const parts: string[] = [];
    if (globalFilter) {
      parts.push(`Filtered to ${globalFilter}`);
    }
    const activeSort = sorting[0];
    if (activeSort) {
      const column = table.getColumn(activeSort.id);
      const header = column?.columnDef.header;
      const label = typeof header === "string" ? header : activeSort.id;
      parts.push(a11yLabels.tableSortedBy(label, activeSort.desc ? "descending" : "ascending"));
    }
    return parts.join(". ");
  }, [globalFilter, sorting, table]);
  const hasPagination =
    !hidePagination &&
    enablePagination &&
    (manualPagination ? resolvedPageCount > 1 : table.getPageCount() > 1);
  const showFooter =
    enableRowSelection ||
    (enablePagination && pageSizeOptions && pageSizeOptions.length > 0) ||
    hasPagination;

  const renderRows = () => {
    if (loading) {
      return (["alpha", "beta", "gamma"] as const).map((slot) => (
        <TableRow key={`loading-${slot}`}>
          {resolvedColumns.map((column) => (
            <TableCell key={column.id ?? `loading-cell-${slot}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={resolvedColumns.length} className="h-24 text-center">
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }

    const rowElements = (
      enableVirtualization ? virtualRows : rows.map((_, index) => ({ index }))
    ).map((virtualRow) => {
      const row = rows[virtualRow.index];
      if (!row) {
        return null;
      }

      return (
        <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      );
    });

    if (!enableVirtualization) {
      return rowElements;
    }

    return (
      <>
        {paddingTop > 0 ? (
          <tr aria-hidden>
            <td colSpan={resolvedColumns.length} style={{ height: paddingTop }} />
          </tr>
        ) : null}
        {rowElements}
        {paddingBottom > 0 ? (
          <tr aria-hidden>
            <td colSpan={resolvedColumns.length} style={{ height: paddingBottom }} />
          </tr>
        ) : null}
      </>
    );
  };

  const tableContent = (
    <Table noContainer aria-label={ariaLabel} aria-busy={loading}>
      {loading ? (
        <caption className="sr-only" aria-live="polite">
          {a11yLabels.tableLoading}
        </caption>
      ) : null}
      <TableHeader className={stickyHeader ? "sticky top-0 z-10 bg-background" : undefined}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} aria-sort={getAriaSortValue(header.column)}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>{renderRows()}</TableBody>
    </Table>
  );

  return (
    <div className={cn(dataTableVariants({ layout, className }))}>
      {tableAnnouncement ? (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {tableAnnouncement}
        </div>
      ) : null}
      {!hideToolbar && (enableFiltering || enableColumnFilters || enableColumnVisibility) ? (
        <DataTableToolbar
          table={table}
          filterPlaceholder={filterPlaceholder}
          showGlobalFilter={enableFiltering}
          showColumnVisibility={enableColumnVisibility}
          enableColumnFilters={enableColumnFilters}
          enableColumnReordering={enableColumnReordering}
        />
      ) : null}
      <div
        ref={scrollRef}
        className="overflow-auto rounded-md border border-border"
        style={scrollStyle}
      >
        {tableContent}
      </div>
      {showFooter ? (
        <PaginationToolbar>
          <PaginationToolbarStart>
            {enableRowSelection ? (
              <p className="text-sm text-muted-foreground">
                {selectedCount} of {filteredCount} row(s) selected.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {(rowCount ?? filteredCount).toLocaleString()} total row(s).
              </p>
            )}
          </PaginationToolbarStart>
          <PaginationToolbarCenter>
            {hasPagination ? <DataTablePagination table={table} className="mx-0 w-auto" /> : null}
          </PaginationToolbarCenter>
          <PaginationToolbarEnd>
            {enablePagination && pageSizeOptions && pageSizeOptions.length > 0 ? (
              <PaginationRowsPerPage
                value={table.getState().pagination.pageSize}
                options={pageSizeOptions}
                onValueChange={(size) => table.setPageSize(size)}
              />
            ) : null}
          </PaginationToolbarEnd>
        </PaginationToolbar>
      ) : null}
    </div>
  );
}

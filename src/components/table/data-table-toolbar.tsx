import type { Table } from "@tanstack/react-table";
import { type DragEvent, useMemo, useRef, useState } from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import { GripVerticalIcon, Settings2Icon } from "../../lib/icons";
import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu/dropdown-menu";
import { Input } from "../input/input";

export type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  /** Placeholder for the global filter input. @default "Filter rows…" */
  filterPlaceholder?: string;
  /** Show global filter input. @default true */
  showGlobalFilter?: boolean;
  /** Show column visibility menu. @default true */
  showColumnVisibility?: boolean;
  /** Enable drag-reorder in the column visibility menu. @default false */
  enableColumnReordering?: boolean;
  /** Show per-column filter inputs. @default false */
  enableColumnFilters?: boolean;
};

/**
 * Toolbar with global filter and optional column visibility for {@link DataTable}.
 */
export function DataTableToolbar<TData>({
  table,
  filterPlaceholder = "Filter rows…",
  showGlobalFilter = true,
  showColumnVisibility = true,
  enableColumnReordering = false,
  enableColumnFilters = false,
}: DataTableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter ?? "";
  const filterableColumns = table.getAllColumns().filter((column) => column.getCanFilter());

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        {showGlobalFilter ? (
          <Input
            placeholder={filterPlaceholder}
            value={globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
            aria-label={filterPlaceholder}
          />
        ) : (
          <span className="flex-1" />
        )}
        {showColumnVisibility ? (
          <DataTableViewOptions table={table} enableColumnReordering={enableColumnReordering} />
        ) : null}
      </div>
      {enableColumnFilters && filterableColumns.length > 0 ? (
        <DataTableColumnFilters table={table} columns={filterableColumns} />
      ) : null}
    </div>
  );
}

export type DataTableColumnFiltersProps<TData> = {
  table: Table<TData>;
  columns: ReturnType<Table<TData>["getAllColumns"]>;
};

/**
 * Per-column text filters for filterable columns.
 */
export function DataTableColumnFilters<TData>({ columns }: DataTableColumnFiltersProps<TData>) {
  return (
    <fieldset className="flex min-w-0 flex-wrap gap-2 border-0 p-0">
      <legend className="sr-only">Column filters</legend>
      {columns.map((column) => {
        const label =
          typeof column.columnDef.meta === "object" &&
          column.columnDef.meta &&
          "filterPlaceholder" in column.columnDef.meta &&
          typeof column.columnDef.meta.filterPlaceholder === "string"
            ? column.columnDef.meta.filterPlaceholder
            : `Filter ${column.id}…`;

        return (
          <Input
            key={column.id}
            placeholder={label}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 max-w-xs"
            aria-label={label}
          />
        );
      })}
    </fieldset>
  );
}

export type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
  enableColumnReordering?: boolean;
};

function reorderColumnIds(order: string[], sourceId: string, targetId: string) {
  const next = order.filter((id) => id !== sourceId);
  const targetIndex = next.indexOf(targetId);
  if (targetIndex === -1) {
    return [...next, sourceId];
  }
  next.splice(targetIndex, 0, sourceId);
  return next;
}

function getOrderedHideableColumns<TData>(table: Table<TData>) {
  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide());
  const currentOrder = table.getState().columnOrder;
  const fallbackOrder = table.getAllLeafColumns().map((column) => column.id);
  const order = currentOrder.length > 0 ? currentOrder : fallbackOrder;
  const columnById = new Map(hideableColumns.map((column) => [column.id, column]));

  const ordered = order
    .map((id) => columnById.get(id))
    .filter((column): column is (typeof hideableColumns)[number] => column !== undefined);

  for (const column of hideableColumns) {
    if (!order.includes(column.id)) {
      ordered.push(column);
    }
  }

  return ordered;
}

/**
 * Dropdown to toggle column visibility.
 */
export function DataTableViewOptions<TData>({
  table,
  enableColumnReordering = false,
}: DataTableViewOptionsProps<TData>) {
  const columnOrder = table.getState().columnOrder;
  // biome-ignore lint/correctness/useExhaustiveDependencies: columnOrder must refresh ordered hideable columns
  const hideableColumns = useMemo(() => getOrderedHideableColumns(table), [table, columnOrder]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const draggingIdRef = useRef<string | null>(null);

  const handleDrop = (targetId: string, event?: DragEvent<HTMLDivElement>) => {
    const sourceId = draggingIdRef.current ?? event?.dataTransfer?.getData("text/plain");
    if (!sourceId || sourceId === targetId) {
      draggingIdRef.current = null;
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const currentOrder = table.getState().columnOrder;
    const fallbackOrder = table.getAllLeafColumns().map((column) => column.id);
    const order = currentOrder.length > 0 ? currentOrder : fallbackOrder;
    table.setColumnOrder(reorderColumnIds(order, sourceId, targetId));
    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  const handleDragStart = (event: DragEvent<HTMLSpanElement>, columnId: string) => {
    event.stopPropagation();
    draggingIdRef.current = columnId;
    setDraggingId(columnId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", columnId);
    }
  };

  const handleDragEnd = () => {
    draggingIdRef.current = null;
    setDraggingId(null);
    setDragOverId(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto h-8 shrink-0"
          aria-label={a11yLabels.toggleColumns}
        >
          <Settings2Icon />
          <span className="hidden sm:inline">View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{a11yLabels.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className={cn(
              "capitalize",
              enableColumnReordering &&
                draggingId === column.id &&
                "z-10 bg-accent shadow-sm ring-1 ring-ring",
              enableColumnReordering &&
                dragOverId === column.id &&
                draggingId !== column.id &&
                "bg-muted",
            )}
            data-dragging={draggingId === column.id ? "" : undefined}
            data-drag-over={dragOverId === column.id && draggingId !== column.id ? "" : undefined}
            checked={column.getIsVisible()}
            leadingSlot={
              enableColumnReordering ? (
                <button
                  type="button"
                  data-slot="column-reorder-handle"
                  data-column-id={column.id}
                  draggable
                  aria-grabbed={draggingId === column.id}
                  className={cn(
                    "flex size-3.5 cursor-grab items-center justify-center active:cursor-grabbing",
                    draggingId === column.id && "text-primary",
                  )}
                  aria-label={`Reorder ${column.id} column`}
                  onDragStart={(event) => handleDragStart(event, column.id)}
                  onDragEnd={handleDragEnd}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.stopPropagation();
                    }
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  <GripVerticalIcon className="size-3.5" />
                </button>
              ) : undefined
            }
            onDragOver={(event) => {
              if (!enableColumnReordering || !draggingIdRef.current) {
                return;
              }
              event.preventDefault();
              if (event.dataTransfer) {
                event.dataTransfer.dropEffect = "move";
              }
              setDragOverId(column.id);
            }}
            onDragLeave={() => {
              if (dragOverId === column.id) {
                setDragOverId(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (enableColumnReordering) {
                handleDrop(column.id, event);
              }
            }}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Checkbox used for row selection header/cells. */
export function DataTableSelectAllCheckbox<TData>({ table }: { table: Table<TData> }) {
  const checked =
    table.getIsAllPageRowsSelected() ||
    (table.getIsSomePageRowsSelected() ? "indeterminate" : false);

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all rows"
    />
  );
}

/** Checkbox for an individual row selection cell. */
export function DataTableSelectRowCheckbox<TData>({
  table,
  rowId,
}: {
  table: Table<TData>;
  rowId: string;
}) {
  const row = table.getRow(rowId);

  return (
    <Checkbox
      checked={row?.getIsSelected() ?? false}
      onCheckedChange={(value) => row?.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}

import type { Column } from "@tanstack/react-table";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "../../lib/icons";
import { Button } from "../button/button";

export type DataTableColumnHeaderProps<TData, TValue> = HTMLAttributes<HTMLDivElement> & {
  column: Column<TData, TValue>;
  title: string;
};

/**
 * Sortable column header button for {@link DataTable}.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        <span>{title}</span>
        {sorted === "desc" ? (
          <ArrowDownIcon />
        ) : sorted === "asc" ? (
          <ArrowUpIcon />
        ) : (
          <ChevronsUpDownIcon />
        )}
      </Button>
    </div>
  );
}

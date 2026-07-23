import {
  forwardRef,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { type TableVariantProps, tableVariants } from "./table.variants";

export type TableProps = HTMLAttributes<HTMLTableElement> &
  TableVariantProps & {
    /** Render only the `table` element without the scroll container. */
    noContainer?: boolean;
  };

/**
 * Root table element with optional density preset.
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>...</TableBody>
 * </Table>
 * ```
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, density, striped, inset, noContainer, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn(tableVariants({ density, striped, inset, className }))}
        {...props}
      />
    );

    if (noContainer) {
      return table;
    }

    return <div className="relative w-full overflow-auto">{table}</div>;
  },
);
Table.displayName = "Table";

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

/** Table header section (`thead`). */
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b [&_tr]:border-border-subtle", className)}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/** Table body section (`tbody`). */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

/** Table footer section (`tfoot`). */
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  ),
);
TableFooter.displayName = "TableFooter";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

/** Table row (`tr`). */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "group border-b border-border-subtle transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[state=selected]:bg-accent data-[state=selected]:text-accent-foreground",
        "hover:[&_td]:text-accent-foreground",
        "data-[state=selected]:[&_td]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
  /** Pin column while horizontally scrolling. */
  sticky?: "left" | "right";
};

/** Header cell (`th`). */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sticky, ...props }, ref) => (
    <th
      ref={ref}
      data-sticky={sticky}
      className={cn(
        "text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        sticky === "left" && "sticky left-0 z-10 bg-background",
        sticky === "right" && "sticky right-0 z-10 bg-background",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  /** Pin column while horizontally scrolling — pair with {@link TableHead} `sticky`. */
  sticky?: "left" | "right";
};

/** Body cell (`td`). */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, sticky, ...props }, ref) => (
    <td
      ref={ref}
      data-sticky={sticky}
      className={cn(
        "align-middle [&:has([role=checkbox])]:pr-0",
        sticky === "left" && "sticky left-0 z-10 bg-background",
        sticky === "right" && "sticky right-0 z-10 bg-background",
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

/** Accessible table caption. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

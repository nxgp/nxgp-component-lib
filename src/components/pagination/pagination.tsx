import { Slot } from "radix-ui";
import { type ComponentPropsWithoutRef, forwardRef, type HTMLAttributes, useMemo } from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "../../lib/icons";
import { type ButtonVariantProps, buttonVariants } from "../button/button.variants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select/select";
import {
  paginationContentVariants,
  paginationEllipsisVariants,
  paginationNavTextVariants,
  paginationNextVariants,
  paginationPreviousVariants,
  paginationSelectorContentVariants,
  paginationSelectorGroupVariants,
  paginationSelectorItemVariants,
  paginationSelectorLabelVariants,
  paginationSelectorsVariants,
  paginationSelectorTriggerVariants,
  paginationToolbarCenterVariants,
  paginationToolbarEndVariants,
  paginationToolbarStartVariants,
  paginationToolbarVariants,
  paginationVariants,
} from "./pagination.variants";

export type PaginationProps = ComponentPropsWithoutRef<"nav"> & {
  /** Accessible label for the pagination landmark. @default "pagination" */
  label?: string;
};

/**
 * Navigation landmark for paginated content.
 *
 * @example
 * ```tsx
 * <Pagination>
 *   <PaginationContent>...</PaginationContent>
 * </Pagination>
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ label = "pagination", className, ...props }, ref) => (
    <nav ref={ref} aria-label={label} className={cn(paginationVariants(), className)} {...props} />
  ),
);
Pagination.displayName = "Pagination";

export type PaginationContentProps = HTMLAttributes<HTMLUListElement>;

/** List container for pagination items. */
export const PaginationContent = forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn(paginationContentVariants(), className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

export type PaginationItemProps = HTMLAttributes<HTMLLIElement>;

/** Wrapper for a single pagination control. */
export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn(className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = {
  /** Whether this link represents the current page. */
  isActive?: boolean;
} & Pick<ButtonVariantProps, "size"> &
  ComponentPropsWithoutRef<"a"> & {
    /** Render as child element via Radix Slot. */
    asChild?: boolean;
  };

/**
 * Page number or navigation link styled with {@link buttonVariants}.
 */
export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "a";

    return (
      <Comp
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
PaginationLink.displayName = "PaginationLink";

export type PaginationPreviousProps = ComponentPropsWithoutRef<typeof PaginationLink>;

/** Link to the previous page. */
export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label={a11yLabels.paginationPrevious}
      size="default"
      className={cn(paginationPreviousVariants(), className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className={paginationNavTextVariants()}>Previous</span>
    </PaginationLink>
  ),
);
PaginationPrevious.displayName = "PaginationPrevious";

export type PaginationNextProps = ComponentPropsWithoutRef<typeof PaginationLink>;

/** Link to the next page. */
export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ className, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label={a11yLabels.paginationNext}
      size="default"
      className={cn(paginationNextVariants(), className)}
      {...props}
    >
      <span className={paginationNavTextVariants()}>Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  ),
);
PaginationNext.displayName = "PaginationNext";

export type PaginationEllipsisProps = ComponentPropsWithoutRef<"span">;

/** Collapsed pages indicator between page numbers. */
export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(paginationEllipsisVariants(), className)}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  ),
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export type PaginationToolbarProps = HTMLAttributes<HTMLDivElement>;

/**
 * Layout wrapper for paginated footers — use with {@link PaginationToolbarStart},
 * {@link PaginationToolbarCenter}, and {@link PaginationToolbarEnd}.
 *
 * @example
 * ```tsx
 * <PaginationToolbar>
 *   <PaginationToolbarStart>
 *     <PaginationRowsPerPage value={10} onValueChange={setPageSize} />
 *   </PaginationToolbarStart>
 *   <PaginationToolbarCenter>
 *     <Pagination>...</Pagination>
 *   </PaginationToolbarCenter>
 *   <PaginationToolbarEnd>
 *     <PaginationPageSelect page={page} pageCount={12} onPageChange={setPage} />
 *   </PaginationToolbarEnd>
 * </PaginationToolbar>
 * ```
 */
export const PaginationToolbar = forwardRef<HTMLDivElement, PaginationToolbarProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(paginationToolbarVariants(), className)} {...props} />
  ),
);
PaginationToolbar.displayName = "PaginationToolbar";

export type PaginationToolbarStartProps = HTMLAttributes<HTMLDivElement>;

/** Left-aligned toolbar slot — typically {@link PaginationRowsPerPage}. */
export const PaginationToolbarStart = forwardRef<HTMLDivElement, PaginationToolbarStartProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(paginationToolbarStartVariants(), className)} {...props} />
  ),
);
PaginationToolbarStart.displayName = "PaginationToolbarStart";

export type PaginationToolbarCenterProps = HTMLAttributes<HTMLDivElement>;

/** Centered toolbar slot — typically {@link Pagination} page links. */
export const PaginationToolbarCenter = forwardRef<HTMLDivElement, PaginationToolbarCenterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(paginationToolbarCenterVariants(), className)} {...props} />
  ),
);
PaginationToolbarCenter.displayName = "PaginationToolbarCenter";

export type PaginationToolbarEndProps = HTMLAttributes<HTMLDivElement>;

/** Right-aligned toolbar slot — typically {@link PaginationPageSelect}. */
export const PaginationToolbarEnd = forwardRef<HTMLDivElement, PaginationToolbarEndProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(paginationToolbarEndVariants(), className)} {...props} />
  ),
);
PaginationToolbarEnd.displayName = "PaginationToolbarEnd";

export type PaginationSelectorsProps = HTMLAttributes<HTMLDivElement>;

/** Groups {@link PaginationRowsPerPage} and {@link PaginationPageSelect}. */
export const PaginationSelectors = forwardRef<HTMLDivElement, PaginationSelectorsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(paginationSelectorsVariants(), className)} {...props} />
  ),
);
PaginationSelectors.displayName = "PaginationSelectors";

export type PaginationRowsPerPageProps = {
  /** Current rows-per-page value. */
  value: number;
  /** Selectable page sizes. @default [10, 20, 30, 50] */
  options?: number[];
  /** Called when the user picks a new page size. */
  onValueChange?: (pageSize: number) => void;
  /** Visible label before the select. @default "Rows per page" */
  label?: string;
  /** Accessible name for the select trigger. @default "Rows per page" */
  triggerLabel?: string;
  disabled?: boolean;
  className?: string;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

/**
 * Rows-per-page selector for paginated lists and tables.
 *
 * @example
 * ```tsx
 * <PaginationRowsPerPage value={10} onValueChange={setPageSize} />
 * ```
 */
export function PaginationRowsPerPage({
  value,
  options = [...DEFAULT_PAGE_SIZE_OPTIONS],
  onValueChange,
  label = "Rows per page",
  triggerLabel = "Rows per page",
  disabled = false,
  className,
}: PaginationRowsPerPageProps) {
  return (
    <div className={cn(paginationSelectorGroupVariants(), className)}>
      <span className={paginationSelectorLabelVariants()}>{label}</span>
      <Select
        value={String(value)}
        onValueChange={(next) => onValueChange?.(Number(next))}
        disabled={disabled}
      >
        <SelectTrigger
          size="sm"
          className={paginationSelectorTriggerVariants()}
          aria-label={triggerLabel}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned" className={paginationSelectorContentVariants()}>
          {options.map((option) => (
            <SelectItem
              key={option}
              value={String(option)}
              className={paginationSelectorItemVariants()}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type PaginationPageSelectProps = {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called when the user picks a new page. */
  onPageChange?: (page: number) => void;
  /** Visible label before the select. @default "Page" */
  label?: string;
  /** Accessible name for the select trigger. @default "Select page" */
  triggerLabel?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Page selector dropdown for paginated lists and tables.
 *
 * @example
 * ```tsx
 * <PaginationPageSelect page={2} pageCount={12} onPageChange={setPage} />
 * ```
 */
export function PaginationPageSelect({
  page,
  pageCount,
  onPageChange,
  label = "Page",
  triggerLabel = "Select page",
  disabled = false,
  className,
}: PaginationPageSelectProps) {
  const pages = useMemo(
    () => Array.from({ length: Math.max(pageCount, 0) }, (_, index) => index + 1),
    [pageCount],
  );
  const resolvedPage = pageCount > 0 ? Math.min(Math.max(page, 1), pageCount) : 1;

  return (
    <div className={cn(paginationSelectorGroupVariants(), className)}>
      <span className={paginationSelectorLabelVariants()}>{label}</span>
      <Select
        value={String(resolvedPage)}
        onValueChange={(next) => onPageChange?.(Number(next))}
        disabled={disabled || pageCount <= 0}
      >
        <SelectTrigger
          size="sm"
          className={paginationSelectorTriggerVariants()}
          aria-label={triggerLabel}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned" className={paginationSelectorContentVariants()}>
          {pages.map((pageNumber) => (
            <SelectItem
              key={pageNumber}
              value={String(pageNumber)}
              className={paginationSelectorItemVariants()}
            >
              {pageNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

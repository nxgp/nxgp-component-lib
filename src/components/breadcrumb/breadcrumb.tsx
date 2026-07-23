import { Slot } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { ChevronRightIcon, MoreHorizontalIcon } from "../../lib/icons";
import {
  breadcrumbEllipsisVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbListVariants,
  breadcrumbPageVariants,
  breadcrumbSeparatorVariants,
} from "./breadcrumb.variants";

export type BreadcrumbProps = ComponentPropsWithoutRef<"nav"> & {
  /** Accessible label for the breadcrumb landmark. @default "breadcrumb" */
  label?: string;
};

/**
 * Navigation landmark for hierarchical page location.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>...</BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ label = "breadcrumb", className, ...props }, ref) => (
    <nav ref={ref} aria-label={label} className={cn(className)} {...props} />
  ),
);
Breadcrumb.displayName = "Breadcrumb";

export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement>;

/** Ordered list of breadcrumb items. */
export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={cn(breadcrumbListVariants(), className)} {...props} />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

export type BreadcrumbItemProps = HTMLAttributes<HTMLLIElement>;

/** Single breadcrumb segment wrapper. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(breadcrumbItemVariants(), className)} {...props} />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export type BreadcrumbLinkProps = ComponentPropsWithoutRef<"a"> & {
  /** Render as child element (e.g. Next.js Link) via Radix Slot. */
  asChild?: boolean;
};

/** Link to an ancestor page in the breadcrumb trail. */
export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "a";

    return <Comp ref={ref} className={cn(breadcrumbLinkVariants(), className)} {...props} />;
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export type BreadcrumbPageProps = ComponentPropsWithoutRef<"span">;

/** Current page — non-interactive final breadcrumb segment. */
export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      className={cn(breadcrumbPageVariants(), className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

export type BreadcrumbSeparatorProps = ComponentPropsWithoutRef<"li"> & {
  children?: ReactNode;
};

/** Visual separator between breadcrumb items. */
export const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ children, className, ...props }, ref) => (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbSeparatorVariants(), className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  ),
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export type BreadcrumbEllipsisProps = ComponentPropsWithoutRef<"span">;

/** Collapsed breadcrumb indicator for truncated trails. */
export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cn(breadcrumbEllipsisVariants(), className)}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  ),
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

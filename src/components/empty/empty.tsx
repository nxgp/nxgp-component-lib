import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import {
  type EmptyMediaVariantProps,
  type EmptyVariantProps,
  emptyMediaVariants,
  emptyVariants,
} from "./empty.variants";

export type EmptyProps = HTMLAttributes<HTMLDivElement> & EmptyVariantProps;

/**
 * Centered empty-state container for lists, tables, and panels.
 *
 * @example
 * ```tsx
 * <Empty>
 *   <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
 *   <EmptyTitle>No messages</EmptyTitle>
 *   <EmptyDescription>Inbox is clear.</EmptyDescription>
 * </Empty>
 * ```
 */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="empty" className={cn(emptyVariants({ className }))} {...props} />
));
Empty.displayName = "Empty";

export type EmptyHeaderProps = HTMLAttributes<HTMLDivElement>;

export const EmptyHeader = forwardRef<HTMLDivElement, EmptyHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2 text-center", className)}
      {...props}
    />
  ),
);
EmptyHeader.displayName = "EmptyHeader";

export type EmptyMediaProps = HTMLAttributes<HTMLDivElement> & EmptyMediaVariantProps;

export const EmptyMedia = forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-media"
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  ),
);
EmptyMedia.displayName = "EmptyMedia";

export type EmptyTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const EmptyTitle = forwardRef<HTMLHeadingElement, EmptyTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight text-foreground", className)}
      {...props}
    />
  ),
);
EmptyTitle.displayName = "EmptyTitle";

export type EmptyDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const EmptyDescription = forwardRef<HTMLParagraphElement, EmptyDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="empty-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
EmptyDescription.displayName = "EmptyDescription";

export type EmptyContentProps = HTMLAttributes<HTMLDivElement>;

export const EmptyContent = forwardRef<HTMLDivElement, EmptyContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-content"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      {...props}
    />
  ),
);
EmptyContent.displayName = "EmptyContent";

import { cva, type VariantProps } from "class-variance-authority";

export const paginationVariants = cva("mx-auto flex w-full justify-center");

export const paginationToolbarVariants = cva(
  "grid w-full grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-2",
);

export const paginationToolbarStartVariants = cva("flex items-center justify-start");

export const paginationToolbarCenterVariants = cva("flex items-center justify-center");

export const paginationToolbarEndVariants = cva("flex items-center justify-end");

export const paginationSelectorsVariants = cva("flex flex-wrap items-center gap-4");

export const paginationSelectorGroupVariants = cva("flex items-center gap-2");

export const paginationSelectorLabelVariants = cva("text-sm text-muted-foreground");

export const paginationSelectorTriggerVariants = cva(
  "h-control-sm w-12 shrink-0 gap-1 px-2 [&>span]:line-clamp-1",
);

export const paginationSelectorContentVariants = cva(
  "min-w-0 w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]",
);

export const paginationSelectorItemVariants = cva(
  "justify-center px-2 pl-2 pr-2 [&>span:first-child]:left-1.5",
);

export const paginationContentVariants = cva("flex flex-row items-center gap-1");

export const paginationPreviousVariants = cva("gap-1 px-2.5 sm:pl-2.5");

export const paginationNextVariants = cva("gap-1 px-2.5 sm:pr-2.5");

export const paginationEllipsisVariants = cva("flex size-9 items-center justify-center");

export const paginationNavTextVariants = cva("hidden sm:block");

export type PaginationVariantProps = VariantProps<typeof paginationVariants>;

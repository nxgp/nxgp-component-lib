import { cva } from "class-variance-authority";
import { type ClassNames, getDefaultClassNames } from "react-day-picker";
import { cn } from "../../lib/cn";
import { buttonVariants } from "../button/button.variants";

/** Day cell button styles — selection and hover live on the button, not the grid cell. */
export const calendarDayButtonVariants = cva(
  "flex aspect-square size-auto w-full min-w-8 flex-col gap-1 font-normal leading-none group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-ring/70 data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary data-[selected-single=true]:hover:text-primary-foreground data-[range-end=true]:hover:bg-primary data-[range-end=true]:hover:text-primary-foreground data-[range-start=true]:hover:bg-primary data-[range-start=true]:hover:text-primary-foreground",
);

const navButtonBase = cn(
  buttonVariants({ variant: "ghost" }),
  "size-8 shrink-0 p-0 select-none aria-disabled:opacity-50",
);

/**
 * Semantic Tailwind class map for {@link Calendar} (react-day-picker v9).
 */
export function getCalendarClassNames(): Partial<ClassNames> {
  const defaults = getDefaultClassNames();

  return {
    root: cn("w-fit bg-background", defaults.root),
    months: cn("relative flex flex-col gap-4 sm:flex-row", defaults.months),
    month: cn("flex w-full flex-col gap-4", defaults.month),
    nav: cn(
      "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
      defaults.nav,
    ),
    button_previous: cn(navButtonBase, defaults.button_previous),
    button_next: cn(navButtonBase, defaults.button_next),
    month_caption: cn("flex h-8 w-full items-center justify-center px-8", defaults.month_caption),
    caption_label: cn("text-sm font-medium select-none", defaults.caption_label),
    month_grid: cn("w-full border-collapse", defaults.month_grid),
    weekdays: cn("flex", defaults.weekdays),
    weekday: cn("flex-1 select-none text-meta font-normal text-muted-foreground", defaults.weekday),
    week: cn("mt-2 flex w-full", defaults.week),
    day: cn(
      "group/day relative aspect-square h-full w-full select-none p-0 text-center",
      "[&:first-child[data-selected=true]_button]:rounded-l-md",
      "[&:last-child[data-selected=true]_button]:rounded-r-md",
      defaults.day,
    ),
    day_button: cn("size-8 p-0 font-normal", defaults.day_button),
    range_start: cn("rounded-l-md bg-accent", defaults.range_start),
    range_middle: cn("rounded-none", defaults.range_middle),
    range_end: cn("rounded-r-md bg-accent", defaults.range_end),
    today: cn("rounded-md bg-accent text-accent-foreground", defaults.today),
    outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaults.outside),
    disabled: cn("text-muted-foreground opacity-50", defaults.disabled),
    hidden: cn("invisible", defaults.hidden),
  };
}

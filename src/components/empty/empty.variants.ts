import { cva, type VariantProps } from "class-variance-authority";

export const emptyVariants = cva(
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-border p-6 text-center md:p-10",
);

export const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-10 rounded-lg bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type EmptyVariantProps = VariantProps<typeof emptyVariants>;
export type EmptyMediaVariantProps = VariantProps<typeof emptyMediaVariants>;

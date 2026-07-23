import { cva, type VariantProps } from "class-variance-authority";

export const treeItemVariants = cva(
  "group/tree-item flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      selected: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export type TreeItemVariantProps = VariantProps<typeof treeItemVariants>;

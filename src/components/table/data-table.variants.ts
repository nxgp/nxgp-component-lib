import { cva, type VariantProps } from "class-variance-authority";

/**
 * Layout variants for {@link DataTable} chrome (toolbar, pagination).
 */
export const dataTableVariants = cva("space-y-4", {
  variants: {
    layout: {
      default: "",
      flush: "space-y-0",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export type DataTableVariantProps = VariantProps<typeof dataTableVariants>;

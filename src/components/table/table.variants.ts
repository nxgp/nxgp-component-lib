import { cva, type VariantProps } from "class-variance-authority";

/**
 * Density presets for {@link Table}.
 * Default is compact (product UI); use `comfortable` for marketing or sparse layouts.
 */
export const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    density: {
      default:
        "[&_td]:px-cell-x-compact [&_td]:py-cell-y-compact [&_th]:h-table-head-compact [&_th]:px-cell-x-compact [&_th]:py-cell-y-compact",
      compact:
        "[&_td]:px-cell-x-compact [&_td]:py-cell-y-compact [&_th]:h-table-head-compact [&_th]:px-cell-x-compact [&_th]:py-cell-y-compact",
      comfortable:
        "[&_td]:px-cell-x-comfortable [&_td]:py-cell-y-comfortable [&_th]:h-table-head-comfortable [&_th]:px-cell-x-comfortable [&_th]:py-cell-y-comfortable",
    },
    striped: {
      true: "[&_tbody_tr:nth-child(even)]:bg-muted/40",
      false: "",
    },
    inset: {
      true: "rounded-inset",
      false: "",
    },
  },
  defaultVariants: {
    density: "default",
    striped: false,
    inset: true,
  },
});

export type TableVariantProps = VariantProps<typeof tableVariants>;

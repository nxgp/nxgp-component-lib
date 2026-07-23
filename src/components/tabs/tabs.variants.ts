import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, pressableMotion } from "../../lib/interactive.variants";

export const tabsListVariants = cva(
  "relative inline-flex items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        default: "rounded-md bg-muted p-0.5",
        line: "gap-1 border-b border-border-subtle bg-transparent p-0",
        compact: "h-auto rounded-md bg-muted/60 p-0.5",
      },
      size: {
        default: "h-control-md",
        comfortable: "h-control-comfortable",
        sm: "h-control-sm text-xs",
        lg: "h-control-lg text-base",
      },
    },
    defaultVariants: {
      variant: "compact",
      size: "default",
    },
  },
);

export const tabsIndicatorVariants = cva(
  "pointer-events-none absolute left-0 z-0 transition-[transform,width,height,opacity] duration-200 ease-product motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "top-0 rounded-sm bg-background shadow-sm",
        line: "bottom-0 h-0.5 rounded-none bg-primary",
        compact: "top-0 rounded-sm bg-surface-2 shadow-none",
      },
    },
    defaultVariants: {
      variant: "compact",
    },
  },
);

export const tabsTriggerVariants = cva(
  `relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-control-px-sm py-1 text-meta font-medium transition-[color] duration-200 ease-product disabled:pointer-events-none disabled:opacity-50 ${focusRing} ${pressableMotion} active:scale-press-subtle`,
  {
    variants: {
      variant: {
        default: "data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground",
        line: "rounded-none border-b-2 border-transparent data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground",
        compact: "data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground",
      },
      size: {
        default: "",
        comfortable: "px-control-px-md py-1.5 text-sm",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-control-px-lg py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "compact",
      size: "default",
    },
  },
);

export type TabsVariantProps = VariantProps<typeof tabsListVariants>;
export type TabsIndicatorVariantProps = VariantProps<typeof tabsIndicatorVariants>;

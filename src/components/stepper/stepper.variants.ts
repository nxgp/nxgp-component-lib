import { cva, type VariantProps } from "class-variance-authority";

export const stepperVariants = cva("flex w-full", {
  variants: {
    orientation: {
      horizontal: "flex-row flex-wrap items-center",
      vertical: "flex-col items-stretch",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const stepperSeparatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "mx-2 h-px flex-1",
      vertical: "ms-4 h-10 w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export const stepperItemVariants = cva("flex items-center gap-2", {
  variants: {
    state: {
      active: "text-foreground",
      complete: "text-muted-foreground",
      inactive: "text-muted-foreground",
    },
  },
  defaultVariants: {
    state: "inactive",
  },
});

export const stepperIndicatorVariants = cva(
  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
  {
    variants: {
      state: {
        active: "border-primary bg-primary text-primary-foreground",
        complete: "border-primary bg-primary text-primary-foreground",
        inactive: "border-border bg-background text-muted-foreground",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  },
);

export type StepperVariantProps = VariantProps<typeof stepperVariants>;
export type StepperItemVariantProps = VariantProps<typeof stepperItemVariants>;

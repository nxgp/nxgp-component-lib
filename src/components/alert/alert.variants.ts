import { cva, type VariantProps } from "class-variance-authority";

const alertChrome =
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7 [&_[data-slot=alert-action]]:absolute [&_[data-slot=alert-action]]:top-2 [&_[data-slot=alert-action]]:right-2 [&:has([data-slot=alert-close])_[data-slot=alert-action]]:right-10 [&_[data-slot=alert-close]]:absolute [&_[data-slot=alert-close]]:top-2 [&_[data-slot=alert-close]]:right-2";

export const alertVariants = cva(alertChrome, {
  variants: {
    variant: {
      default: "border-border bg-muted/50 text-foreground [&>svg]:text-foreground",
      destructive:
        "border-destructive/50 bg-destructive/10 text-foreground [&>svg]:text-destructive [&_h5]:text-destructive dark:border-destructive/50",
      success:
        "border-chart-2/50 bg-chart-2/10 text-foreground [&>svg]:text-chart-2 [&_h5]:text-chart-2 dark:border-chart-2/50",
      warning:
        "border-chart-3/50 bg-chart-3/10 text-foreground [&>svg]:text-chart-3 [&_h5]:text-chart-3 dark:border-chart-3/50",
      info: "border-primary/50 bg-primary/10 text-foreground [&>svg]:text-primary [&_h5]:text-primary dark:border-primary/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Extra padding when close or action slots are present. */
export const alertSlotPaddingVariants = cva(
  "[&:has([data-slot=alert-close])]:pr-10 [&:has([data-slot=alert-action])]:pr-24 [&:has([data-slot=alert-close]):has([data-slot=alert-action])]:pr-[7.5rem]",
);

export const alertTitleVariants = cva("mb-1 font-medium leading-none tracking-tight");

export const alertDescriptionVariants = cva("text-sm text-muted-foreground [&_p]:leading-relaxed");

export const alertActionVariants = cva("flex items-center gap-2");

export const alertCloseVariants = cva(
  "rounded-sm p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
);

export type AlertVariantProps = VariantProps<typeof alertVariants>;

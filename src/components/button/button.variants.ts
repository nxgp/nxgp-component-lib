import { cva, type VariantProps } from "class-variance-authority";
import { interactiveControl } from "../../lib/interactive.variants";

/**
 * Shared CVA variants for Button and IconButton.
 */
export const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg:not([data-icon])]:pointer-events-none [&_svg:not([data-icon])]:shrink-0 [&_[data-icon=inline-start]]:-ms-0.5 [&_[data-icon=inline-end]]:-me-0.5 ${interactiveControl}`,
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-control-md px-control-px-md text-sm [&_svg:not([data-icon])]:size-icon-md",
        comfortable:
          "h-control-comfortable px-control-px-lg py-2 [&_svg:not([data-icon])]:size-icon-md",
        xs: "h-control-xs rounded-md px-control-px-sm text-xs [&_svg:not([data-icon])]:size-icon-sm",
        sm: "h-control-sm rounded-md px-control-px-sm text-xs [&_svg:not([data-icon])]:size-icon-sm",
        lg: "h-control-lg px-control-px-xl [&_svg:not([data-icon])]:size-icon-lg",
        icon: "size-control-md [&_svg:not([data-icon])]:size-icon-md",
        "icon-xs": "size-control-xs [&_svg:not([data-icon])]:size-icon-xs",
        "icon-sm": "size-control-sm [&_svg:not([data-icon])]:size-icon-sm",
        "icon-lg": "size-control-lg [&_svg:not([data-icon])]:size-icon-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

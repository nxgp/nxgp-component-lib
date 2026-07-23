import { cva, type VariantProps } from "class-variance-authority";

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button relative flex w-full items-center gap-2.5 overflow-hidden rounded-md text-left outline-none transition-colors duration-fast ease-product focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-50 group-data-[state=collapsed]/sidebar-wrapper:size-control-md group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:px-0 group-data-[state=collapsed]/sidebar-wrapper:[&>span]:hidden [&>span:last-child]:truncate [&>svg]:size-icon-sm [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-accent/60 hover:text-foreground",
        outline:
          "border border-border-subtle bg-background/50 hover:border-border hover:bg-accent/50 hover:text-foreground",
      },
      size: {
        default: "h-control-sm px-2.5 text-meta",
        comfortable: "h-control-md px-2.5 text-sm",
        sm: "h-control-xs px-2 text-xs",
        lg: "h-control-comfortable px-2.5 text-sm",
      },
      isActive: {
        true: "bg-accent/70 font-medium text-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary group-data-[state=collapsed]/sidebar-wrapper:before:hidden group-data-[state=collapsed]/sidebar-wrapper:bg-accent/70",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isActive: false,
    },
  },
);

export type SidebarMenuButtonVariantProps = VariantProps<typeof sidebarMenuButtonVariants>;

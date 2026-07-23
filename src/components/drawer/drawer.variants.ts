import { cva, type VariantProps } from "class-variance-authority";
import { overlayFadeMotion, overlayZIndex } from "../../lib/overlay.variants";

export const drawerOverlayVariants = cva(
  `fixed inset-0 ${overlayZIndex} bg-background/80 backdrop-blur-sm ${overlayFadeMotion}`,
);

export const drawerContentVariants = cva(
  [
    "group/drawer-content relative fixed z-50 flex h-auto flex-col border-border bg-background",
    "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
    "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
    "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:border-r",
    "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:border-l",
  ].join(" "),
  {
    variants: {
      size: {
        default: "",
        sm: "",
        lg: "",
        xl: "",
        full: "",
      },
      resizable: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "sm",
        class: [
          "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-xs",
          "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-xs",
          "data-[vaul-drawer-direction=bottom]:max-h-sheet-sm",
          "data-[vaul-drawer-direction=top]:max-h-sheet-sm",
        ].join(" "),
      },
      {
        size: "default",
        class: [
          "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-sm",
          "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=bottom]:max-h-drawer",
          "data-[vaul-drawer-direction=top]:max-h-drawer",
        ].join(" "),
      },
      {
        size: "lg",
        class: [
          "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:sm:max-w-md",
          "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:sm:max-w-md",
          "data-[vaul-drawer-direction=bottom]:max-h-sheet-lg",
          "data-[vaul-drawer-direction=top]:max-h-sheet-lg",
        ].join(" "),
      },
      {
        size: "xl",
        class: [
          "data-[vaul-drawer-direction=left]:w-11/12 data-[vaul-drawer-direction=left]:sm:max-w-lg",
          "data-[vaul-drawer-direction=right]:w-11/12 data-[vaul-drawer-direction=right]:sm:max-w-lg",
          "data-[vaul-drawer-direction=bottom]:max-h-sheet-xl",
          "data-[vaul-drawer-direction=top]:max-h-sheet-xl",
        ].join(" "),
      },
      {
        size: "full",
        class: [
          "data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:sm:max-w-none",
          "data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-none",
          "data-[vaul-drawer-direction=bottom]:h-full data-[vaul-drawer-direction=bottom]:max-h-none",
          "data-[vaul-drawer-direction=top]:h-full data-[vaul-drawer-direction=top]:max-h-none",
        ].join(" "),
      },
      {
        resizable: true,
        class: [
          "data-[vaul-drawer-direction=bottom]:max-h-none data-[vaul-drawer-direction=top]:max-h-none",
          "data-[vaul-drawer-direction=left]:max-w-none data-[vaul-drawer-direction=right]:max-w-none",
        ].join(" "),
      },
    ],
    defaultVariants: {
      size: "default",
      resizable: false,
    },
  },
);

export const drawerHandleVariants = cva(
  "mx-auto mt-4 hidden h-1.5 w-12 shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block",
);

export const drawerCloseButtonVariants = cva(
  "absolute right-4 top-4 z-10 inline-flex size-8 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
);

export const drawerResizeHandleVariants = cva(
  "absolute z-20 flex touch-none select-none items-center justify-center border-0 bg-transparent p-0",
  {
    variants: {
      direction: {
        bottom: "inset-x-0 top-0 h-4 -translate-y-1/2 cursor-ns-resize",
        top: "inset-x-0 bottom-0 h-4 translate-y-1/2 cursor-ns-resize",
        left: "inset-y-0 right-0 w-4 translate-x-1/2 cursor-ew-resize",
        right: "inset-y-0 left-0 w-4 -translate-x-1/2 cursor-ew-resize",
      },
    },
    defaultVariants: {
      direction: "bottom",
    },
  },
);

export const drawerResizeHandleDomeVariants = cva(
  "rounded-full border border-border bg-muted shadow-sm transition-colors",
  {
    variants: {
      direction: {
        bottom: "h-2 w-12",
        top: "h-2 w-12",
        left: "h-12 w-2",
        right: "h-12 w-2",
      },
    },
    defaultVariants: {
      direction: "bottom",
    },
  },
);

export type DrawerResizeHandleVariantProps = VariantProps<typeof drawerResizeHandleVariants>;

export const drawerHeaderVariants = cva("flex flex-col gap-1.5 p-4 text-center sm:text-left");

export const drawerFooterVariants = cva("mt-auto flex flex-col gap-2 p-4");

export const drawerTitleVariants = cva("text-lg font-semibold leading-none tracking-tight");

export const drawerDescriptionVariants = cva("text-sm text-muted-foreground");

export type DrawerContentVariantProps = VariantProps<typeof drawerContentVariants>;

/** @deprecated Use {@link DrawerContentVariantProps} */
export type DrawerVariantProps = DrawerContentVariantProps;

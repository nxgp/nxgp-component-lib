/**
 * Shared overlay surface, motion, and z-index styles for popovers, menus, and dialogs.
 */
export const overlayZIndex = "z-50";

/** Enter/exit motion for popovers and dropdown menus. */
export const overlayPopoverMotion =
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 motion-reduce:animate-none";

/** Fade-only motion for modal backdrops and simpler overlays. */
export const overlayFadeMotion =
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none";

/** Modal backdrop surface — compose on Dialog, Sheet, AlertDialog overlays. */
export const overlayBackdropClasses = `fixed inset-0 ${overlayZIndex} bg-background/80 backdrop-blur-sm ${overlayFadeMotion}`;

/** Base popover/menu surface styles. */
export const overlayPopoverSurface =
  "overflow-hidden rounded-md border border-border bg-popover text-popover-foreground";

/** Composed popover content classes — pass shadow variant. */
export function overlayPopoverClasses(
  shadow: "md" | "lg" = "lg",
  minWidth: "popover" | "menu" = "popover",
) {
  const minW = minWidth === "menu" ? "min-w-menu" : "min-w-popover";
  const shadowClass = shadow === "md" ? "shadow-md" : "shadow-lg";
  return `${overlayZIndex} ${minW} ${overlayPopoverSurface} ${shadowClass} ${overlayPopoverMotion}`;
}

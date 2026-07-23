import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ForwardRefExoticComponent,
  forwardRef,
  type HTMLAttributes,
  type RefAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../../lib/cn";
import { XIcon } from "../../lib/icons";
import {
  type DrawerContentVariantProps,
  drawerCloseButtonVariants,
  drawerContentVariants,
  drawerDescriptionVariants,
  drawerFooterVariants,
  drawerHandleVariants,
  drawerHeaderVariants,
  drawerOverlayVariants,
  drawerTitleVariants,
} from "./drawer.variants";
import { DrawerDirectionProvider, useDrawerDirection } from "./drawer-context";
import { DrawerResizeHandle } from "./drawer-resize-handle";

export type DrawerProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>;

export const Drawer = ({
  direction = "bottom",
  shouldScaleBackground = true,
  ...props
}: DrawerProps) => (
  <DrawerDirectionProvider direction={direction}>
    <DrawerPrimitive.Root
      direction={direction}
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  </DrawerDirectionProvider>
);
Drawer.displayName = "Drawer";

export type DrawerTriggerProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>;
export type DrawerPortalProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Portal>;
export type DrawerCloseProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>;

export const DrawerTrigger = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Trigger>,
  DrawerTriggerProps
>((props, ref) => <DrawerPrimitive.Trigger ref={ref} {...props} />) as ForwardRefExoticComponent<
  DrawerTriggerProps & RefAttributes<ComponentRef<typeof DrawerPrimitive.Trigger>>
>;
DrawerTrigger.displayName = "DrawerTrigger";

export const DrawerPortal = DrawerPrimitive.Portal;

export const DrawerClose = forwardRef<ComponentRef<typeof DrawerPrimitive.Close>, DrawerCloseProps>(
  (props, ref) => <DrawerPrimitive.Close ref={ref} {...props} />,
) as ForwardRefExoticComponent<
  DrawerCloseProps & RefAttributes<ComponentRef<typeof DrawerPrimitive.Close>>
>;
DrawerClose.displayName = "DrawerClose";

export type DrawerOverlayProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>;

export const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
      ref={ref}
      data-slot="drawer-overlay"
      className={cn(drawerOverlayVariants(), className)}
      {...props}
    />
  ),
) as ForwardRefExoticComponent<DrawerOverlayProps & RefAttributes<HTMLDivElement>>;
DrawerOverlay.displayName = "DrawerOverlay";

export type DrawerContentProps = Omit<
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>,
  "onResize"
> &
  DrawerContentVariantProps & {
    /** When true, shows a border dome handle for drag-resizing along the open axis. @default false */
    resizable?: boolean;
    /** When false, the built-in close button is not rendered. @default false */
    showCloseButton?: boolean;
    /** Called when the built-in close button is clicked. */
    onClose?: () => void;
    /** Class names for the overlay element. */
    overlayClassName?: string;
  };

/**
 * Drawer panel — bottom sheet by default; set `direction` on root for other sides.
 * Use `size` for width (left/right) or max-height (top/bottom) presets.
 */
export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (
    {
      className,
      size = "default",
      resizable = false,
      showCloseButton = false,
      onClose,
      overlayClassName,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const direction = useDrawerDirection();
    const isVertical = direction === "top" || direction === "bottom";
    const contentRef = useRef<HTMLDivElement>(null);
    const [dimension, setDimension] = useState<number>();

    useLayoutEffect(() => {
      if (!resizable || !contentRef.current) {
        return;
      }
      const rect = contentRef.current.getBoundingClientRect();
      setDimension(isVertical ? rect.height : rect.width);
    }, [isVertical, resizable]);

    const setContentRef = useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const resizeStyle =
      resizable && dimension !== undefined
        ? isVertical
          ? { height: dimension, maxHeight: dimension }
          : { width: dimension, maxWidth: dimension }
        : undefined;

    return (
      <DrawerPortal>
        <DrawerOverlay className={overlayClassName} />
        <DrawerPrimitive.Content
          ref={setContentRef}
          data-slot="drawer-content"
          data-resizable={resizable ? "" : undefined}
          className={cn(drawerContentVariants({ size, resizable }), className)}
          style={{ ...resizeStyle, ...style }}
          {...props}
        >
          {resizable ? <DrawerResizeHandle direction={direction} onResize={setDimension} /> : null}
          <div className={drawerHandleVariants()} />
          {showCloseButton ? (
            <DrawerPrimitive.Close
              data-slot="drawer-close"
              className={drawerCloseButtonVariants()}
              aria-label="Close"
              onClick={() => onClose?.()}
            >
              <XIcon />
            </DrawerPrimitive.Close>
          ) : null}
          {children}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  },
) as ForwardRefExoticComponent<DrawerContentProps & RefAttributes<HTMLDivElement>>;
DrawerContent.displayName = "DrawerContent";

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => (
  <div data-slot="drawer-header" className={cn(drawerHeaderVariants(), className)} {...props} />
);

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

export const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <div data-slot="drawer-footer" className={cn(drawerFooterVariants(), className)} {...props} />
);

export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>;

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
      ref={ref}
      data-slot="drawer-title"
      className={cn(drawerTitleVariants(), className)}
      {...props}
    />
  ),
) as ForwardRefExoticComponent<DrawerTitleProps & RefAttributes<HTMLHeadingElement>>;
DrawerTitle.displayName = "DrawerTitle";

export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>;

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
      ref={ref}
      data-slot="drawer-description"
      className={cn(drawerDescriptionVariants(), className)}
      {...props}
    />
  ),
) as ForwardRefExoticComponent<DrawerDescriptionProps & RefAttributes<HTMLParagraphElement>>;
DrawerDescription.displayName = "DrawerDescription";

export { useDrawerDirection } from "./drawer-context";
export { DrawerResizeHandle, type DrawerResizeHandleProps } from "./drawer-resize-handle";

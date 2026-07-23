import { HoverCard as HoverCardPrimitive, Popover as PopoverPrimitive } from "radix-ui";
import { type ComponentPropsWithoutRef, type ComponentRef, forwardRef, type Ref } from "react";
import { cn } from "../../lib/cn";
import { type PopoverContentVariantProps, popoverContentVariants } from "./popover.variants";
import {
  type PopoverTriggerMode,
  PopoverTriggerModeProvider,
  usePopoverTriggerMode,
} from "./popover-context";

export type { PopoverTriggerMode };

export type PopoverProps = {
  /** How the popover opens. @default "click" */
  trigger?: PopoverTriggerMode;
  /** Hover mode only — delay in ms before opening. @default 200 */
  openDelay?: number;
  /** Hover mode only — delay in ms before closing. @default 100 */
  closeDelay?: number;
} & ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;

/**
 * Floating panel anchored to a trigger — click (default) or hover.
 *
 * @example Click popover
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *   <PopoverContent>Panel body</PopoverContent>
 * </Popover>
 * ```
 *
 * @example Hover preview
 * ```tsx
 * <Popover trigger="hover">
 *   <PopoverTrigger asChild><Button variant="link">@nextjs</Button></PopoverTrigger>
 *   <PopoverContent>Preview card body</PopoverContent>
 * </Popover>
 * ```
 */
export function Popover({
  trigger = "click",
  openDelay = 200,
  closeDelay = 100,
  ...props
}: PopoverProps) {
  return (
    <PopoverTriggerModeProvider mode={trigger}>
      {trigger === "hover" ? (
        <HoverCardPrimitive.Root openDelay={openDelay} closeDelay={closeDelay} {...props} />
      ) : (
        <PopoverPrimitive.Root {...props} />
      )}
    </PopoverTriggerModeProvider>
  );
}

function useClickPopoverOnly(component: string): void {
  if (usePopoverTriggerMode() === "hover") {
    throw new Error(`${component} is only supported when Popover trigger="click".`);
  }
}

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

export const PopoverTrigger = forwardRef<
  ComponentRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>((props, ref) => {
  const mode = usePopoverTriggerMode();

  if (mode === "hover") {
    const hoverProps = props as ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger>;
    return (
      <HoverCardPrimitive.Trigger
        ref={ref as Ref<ComponentRef<typeof HoverCardPrimitive.Trigger>>}
        {...hoverProps}
      />
    );
  }

  return <PopoverPrimitive.Trigger ref={ref} {...props} />;
});
PopoverTrigger.displayName = "PopoverTrigger";

export type PopoverAnchorProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;

export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>((props, ref) => {
  useClickPopoverOnly("PopoverAnchor");
  return <PopoverPrimitive.Anchor ref={ref} {...props} />;
});
PopoverAnchor.displayName = "PopoverAnchor";

export const PopoverClose = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>((props, ref) => {
  useClickPopoverOnly("PopoverClose");
  return <PopoverPrimitive.Close ref={ref} {...props} />;
});
PopoverClose.displayName = "PopoverClose";

export type PopoverContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  PopoverContentVariantProps;

/** Floating content anchored to a trigger with width presets. */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, size, ...props }, ref) => {
    const mode = usePopoverTriggerMode();
    const contentClassName = cn(popoverContentVariants({ size, className }));

    if (mode === "hover") {
      return (
        <HoverCardPrimitive.Portal>
          <HoverCardPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={contentClassName}
            {...props}
          />
        </HoverCardPrimitive.Portal>
      );
    }

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={contentClassName}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

export type PopoverArrowProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>;

/** Optional pointer arrow for click-mode {@link PopoverContent}. */
export const PopoverArrow = forwardRef<SVGSVGElement, PopoverArrowProps>((props, ref) => {
  useClickPopoverOnly("PopoverArrow");

  return (
    <PopoverPrimitive.Arrow ref={ref} className={cn("fill-popover", props.className)} {...props} />
  );
});
PopoverArrow.displayName = "PopoverArrow";

export { usePopoverTriggerMode } from "./popover-context";

/** @deprecated Use {@link Popover} with `trigger="hover"`. */
export const HoverCard = Popover;

/** @deprecated Use {@link PopoverTrigger}. */
export const HoverCardTrigger = PopoverTrigger;

/** @deprecated Use {@link PopoverContent}. */
export const HoverCardContent = PopoverContent;

/** @deprecated Use {@link PopoverProps}. */
export type HoverCardProps = PopoverProps;

/** @deprecated Use {@link PopoverContentProps}. */
export type HoverCardContentProps = PopoverContentProps;

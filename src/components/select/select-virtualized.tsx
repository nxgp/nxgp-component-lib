import { useVirtualizer } from "@tanstack/react-virtual";
import { Select as SelectPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { cn } from "../../lib/cn";
import { ChevronDownIcon, ChevronUpIcon } from "../../lib/icons";
import { SelectItem } from "./select";
import { selectContentVariants, selectViewportVariants } from "./select.variants";

export type VirtualizedSelectItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type VirtualizedSelectItemsProps = {
  /** Options to render — only visible rows mount for performance. */
  items: VirtualizedSelectItem[];
  /** Estimated row height in px. @default 32 */
  estimateSize?: number;
  /** Max viewport height before scrolling. @default 320 */
  maxHeight?: number;
  className?: string;
};

const scrollButtonClass =
  "flex cursor-default items-center justify-center py-1 text-muted-foreground";

export type VirtualizedSelectContentProps = ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> & {
  items: VirtualizedSelectItem[];
  estimateSize?: number;
  maxHeight?: number;
};

function getVisibleVirtualRows(
  virtualizer: { getVirtualItems: () => ReadonlyArray<{ index: number; start: number }> },
  itemCount: number,
  estimateSize: number,
  maxHeight: number,
) {
  const virtualItems = virtualizer.getVirtualItems();
  if (virtualItems.length > 0 || itemCount === 0) {
    return virtualItems;
  }

  const visibleCount = Math.min(itemCount, Math.ceil(maxHeight / estimateSize) + 8);
  return Array.from({ length: visibleCount }, (_, index) => ({
    index,
    start: index * estimateSize,
    end: (index + 1) * estimateSize,
    size: estimateSize,
    key: index,
  }));
}

function useVirtualizedSelectItems(
  items: VirtualizedSelectItem[],
  estimateSize: number,
  scrollElement: HTMLDivElement | null,
) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => estimateSize,
    overscan: 8,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: items.length triggers virtualizer remeasure when options change
  useLayoutEffect(() => {
    if (scrollElement) {
      virtualizer.measure();
    }
  }, [scrollElement, virtualizer, items.length]);

  return virtualizer;
}

function useVirtualizedViewportRef() {
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);
  const viewportRef = useCallback((node: HTMLDivElement | null) => {
    setScrollElement(node);
  }, []);

  return { scrollElement, viewportRef };
}

/**
 * Select content with a virtualized item list for 500+ options.
 *
 * @example
 * ```tsx
 * <Select>
 *   <SelectTrigger aria-label="Country"><SelectValue placeholder="Country" /></SelectTrigger>
 *   <VirtualizedSelectContent items={countries} />
 * </Select>
 * ```
 */
export const VirtualizedSelectContent = forwardRef<HTMLDivElement, VirtualizedSelectContentProps>(
  (
    {
      className,
      children,
      items,
      estimateSize = 32,
      maxHeight = 320,
      position = "popper",
      ...props
    },
    ref,
  ) => {
    const { scrollElement, viewportRef } = useVirtualizedViewportRef();
    const virtualizer = useVirtualizedSelectItems(items, estimateSize, scrollElement);
    const virtualItems = getVisibleVirtualRows(virtualizer, items.length, estimateSize, maxHeight);

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          className={cn(selectContentVariants({ position }), className)}
          {...props}
        >
          <SelectPrimitive.ScrollUpButton className={scrollButtonClass}>
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport
            ref={viewportRef}
            className={cn(selectViewportVariants({ position }), "overflow-auto p-0")}
            style={{ height: maxHeight, maxHeight }}
          >
            <div
              className="relative w-full p-1"
              style={{ height: Math.max(virtualizer.getTotalSize(), items.length * estimateSize) }}
            >
              {virtualItems.map((virtualRow) => {
                const item = items[virtualRow.index];
                if (!item) {
                  return null;
                }

                return (
                  <div
                    key={item.value}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className="absolute left-0 top-0 w-full"
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    <SelectItem value={item.value} disabled={item.disabled}>
                      {item.label}
                    </SelectItem>
                  </div>
                );
              })}
            </div>
            {children}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className={scrollButtonClass}>
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
VirtualizedSelectContent.displayName = "VirtualizedSelectContent";

/** Virtualized list body for use inside standard {@link SelectContent}. */
export function VirtualizedSelectItems({
  items,
  estimateSize = 32,
  maxHeight = 320,
  className,
}: VirtualizedSelectItemsProps) {
  const { scrollElement, viewportRef } = useVirtualizedViewportRef();
  const virtualizer = useVirtualizedSelectItems(items, estimateSize, scrollElement);
  const virtualItems = getVisibleVirtualRows(virtualizer, items.length, estimateSize, maxHeight);

  return (
    <div
      ref={viewportRef}
      data-slot="select-virtualized-items"
      className={cn("overflow-auto", className)}
      style={{ height: maxHeight, maxHeight }}
    >
      <div
        className="relative w-full"
        style={{ height: Math.max(virtualizer.getTotalSize(), items.length * estimateSize) }}
      >
        {virtualItems.map((virtualRow) => {
          const item = items[virtualRow.index];
          if (!item) {
            return null;
          }

          return (
            <div
              key={item.value}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              <SelectItem value={item.value} disabled={item.disabled}>
                {item.label}
              </SelectItem>
            </div>
          );
        })}
      </div>
    </div>
  );
}

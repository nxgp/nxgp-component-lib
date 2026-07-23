import { Tabs as TabsPrimitive } from "radix-ui";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/cn";
import { useControllableState } from "../../lib/use-controllable-state";
import {
  type TabsVariantProps,
  tabsIndicatorVariants,
  tabsListVariants,
  tabsTriggerVariants,
} from "./tabs.variants";

type TabsIndicatorRect = {
  height: number;
  left: number;
  opacity: number;
  top: number;
  width: number;
};

const hiddenIndicatorRect: TabsIndicatorRect = {
  height: 0,
  left: 0,
  opacity: 0,
  top: 0,
  width: 0,
};

function useTabsListIndicator(
  listRef: RefObject<HTMLDivElement | null>,
  children: TabsListProps["children"],
) {
  const [indicator, setIndicator] = useState<TabsIndicatorRect>(hiddenIndicatorRect);

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const active = list.querySelector<HTMLElement>(
      '[data-slot="tabs-trigger"][data-state="active"]',
    );
    if (!active) {
      setIndicator((current) => (current.opacity === 0 ? current : hiddenIndicatorRect));
      return;
    }

    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    setIndicator({
      left: activeRect.left - listRect.left,
      top: activeRect.top - listRect.top,
      width: activeRect.width,
      height: activeRect.height,
      opacity: 1,
    });
  }, [listRef]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: children re-runs indicator when tab triggers change
  useLayoutEffect(() => {
    updateIndicator();

    const list = listRef.current;
    if (!list) {
      return;
    }

    const mutationObserver = new MutationObserver(updateIndicator);
    mutationObserver.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(list);
    for (const trigger of list.querySelectorAll('[data-slot="tabs-trigger"]')) {
      resizeObserver.observe(trigger);
    }

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [children, listRef, updateIndicator]);

  return indicator;
}

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

/** Tab panels root with consistent controlled/uncontrolled state. */
export function Tabs(props: TabsProps) {
  const { value, defaultValue, onValueChange, ...rest } = props;
  const [tabValue, setTabValue] = useControllableState({
    value,
    defaultValue,
    onValueChange,
    isControlled: "value" in props,
  });

  return <TabsPrimitive.Root value={tabValue} onValueChange={setTabValue} {...rest} />;
}

type TabsContextValue = Pick<TabsVariantProps, "variant" | "size">;

const TabsContext = createContext<TabsContextValue>({
  variant: "compact",
  size: "default",
});

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & TabsVariantProps;

/**
 * Horizontal list of tab triggers — `variant` and `size` propagate to {@link TabsTrigger} items.
 */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "compact", size = "default", children, ...props }, ref) => {
    const listRef = useRef<HTMLDivElement>(null);
    const indicator = useTabsListIndicator(listRef, children);

    const setListRef = (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <TabsContext.Provider value={{ variant, size }}>
        <TabsPrimitive.List
          ref={setListRef}
          className={cn(tabsListVariants({ variant, size }), className)}
          {...props}
        >
          <span
            aria-hidden
            data-slot="tabs-indicator"
            className={cn(tabsIndicatorVariants({ variant }))}
            style={
              variant === "line"
                ? {
                    transform: `translateX(${indicator.left}px)`,
                    width: indicator.width,
                    opacity: indicator.opacity,
                  }
                : {
                    transform: `translate(${indicator.left}px, ${indicator.top}px)`,
                    width: indicator.width,
                    height: indicator.height,
                    opacity: indicator.opacity,
                  }
            }
          />
          {children}
        </TabsPrimitive.List>
      </TabsContext.Provider>
    );
  },
);
TabsList.displayName = "TabsList";

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
  Partial<TabsVariantProps>;

/**
 * Button that activates an associated {@link TabsContent} panel.
 */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant: variantProp, size: sizeProp, ...props }, ref) => {
    const { variant: groupVariant, size: groupSize } = useContext(TabsContext);

    return (
      <TabsPrimitive.Trigger
        ref={ref}
        data-slot="tabs-trigger"
        className={cn(
          tabsTriggerVariants({
            variant: variantProp ?? groupVariant,
            size: sizeProp ?? groupSize,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

/**
 * Panel shown when its matching trigger is active.
 */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200 motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  ),
);
TabsContent.displayName = "TabsContent";

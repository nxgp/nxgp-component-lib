import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "../../lib/cn";
import { ChevronRightIcon } from "../../lib/icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../collapsible/collapsible";
import { type TreeItemVariantProps, treeItemVariants } from "./tree.variants";

type TreeContextValue = {
  selectedId?: string;
  onSelect?: (itemId: string) => void;
  expandedIds: Set<string>;
  toggleExpanded: (itemId: string) => void;
};

const TreeContext = createContext<TreeContextValue | null>(null);

function useTree(component: string): TreeContextValue {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error(`${component} must be used within Tree`);
  }
  return context;
}

export type TreeProps = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  /** Controlled selected item id. */
  selectedId?: string;
  /** Called when an item is selected. */
  onSelect?: (itemId: string) => void;
  /** Initially expanded branch ids (uncontrolled). */
  defaultExpandedIds?: string[];
};

/**
 * Accessible hierarchical tree — file explorers, org charts, nested nav.
 *
 * @example
 * ```tsx
 * <Tree defaultExpandedIds={["root"]}>
 *   <TreeItem itemId="root" label="src">
 *     <TreeItem itemId="components" label="components" />
 *   </TreeItem>
 * </Tree>
 * ```
 */
export const Tree = forwardRef<HTMLDivElement, TreeProps>(
  ({ className, selectedId, onSelect, defaultExpandedIds = [], children, ...props }, ref) => {
    const [expandedIds, setExpandedIds] = useState(() => new Set(defaultExpandedIds));

    const toggleExpanded = useCallback((itemId: string) => {
      setExpandedIds((current) => {
        const next = new Set(current);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    }, []);

    const value = useMemo(
      () => ({ selectedId, onSelect, expandedIds, toggleExpanded }),
      [selectedId, onSelect, expandedIds, toggleExpanded],
    );

    return (
      <TreeContext.Provider value={value}>
        <div
          ref={ref}
          role="tree"
          data-slot="tree"
          className={cn("flex flex-col", className)}
          {...props}
        >
          {children}
        </div>
      </TreeContext.Provider>
    );
  },
);
Tree.displayName = "Tree";

export type TreeItemProps = HTMLAttributes<HTMLDivElement> &
  TreeItemVariantProps & {
    /** Unique id for selection and expansion state. */
    itemId: string;
    /** Primary label — string or custom node. */
    label: ReactNode;
    /** Nested child items. */
    children?: ReactNode;
  };

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  ({ className, itemId, label, children, selected: selectedProp, ...props }, ref) => {
    const { selectedId, onSelect, expandedIds, toggleExpanded } = useTree("TreeItem");
    const hasChildren = Boolean(children);
    const isSelected = selectedProp ?? selectedId === itemId;
    const isExpanded = expandedIds.has(itemId);

    if (hasChildren) {
      return (
        <div ref={ref} data-slot="tree-item" className={cn(className)} {...props}>
          <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(itemId)}>
            <div
              role="treeitem"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-selected={isSelected}
              className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CollapsibleTrigger
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <ChevronRightIcon
                  className={cn("size-4 transition-transform", isExpanded && "rotate-90")}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <button
                type="button"
                className={cn(treeItemVariants({ selected: isSelected }), "flex-1 text-left")}
                onClick={() => onSelect?.(itemId)}
              >
                {label}
              </button>
            </div>
            <CollapsibleContent>
              {/* biome-ignore lint/a11y/useSemanticElements: treeitem group per WAI-ARIA tree pattern */}
              <div role="group" className="ml-4 border-l border-border pl-2">
                {children}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    return (
      <div ref={ref} data-slot="tree-item" className={cn("pl-7", className)} {...props}>
        <button
          type="button"
          role="treeitem"
          aria-selected={isSelected}
          className={cn(treeItemVariants({ selected: isSelected }), "w-full text-left")}
          onClick={() => onSelect?.(itemId)}
        >
          {label}
        </button>
      </div>
    );
  },
);
TreeItem.displayName = "TreeItem";

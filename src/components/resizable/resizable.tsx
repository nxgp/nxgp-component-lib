import { type ComponentPropsWithoutRef, forwardRef } from "react";
import {
  Group,
  type GroupProps,
  Panel,
  type PanelProps,
  Separator,
  useDefaultLayout,
} from "react-resizable-panels";
import { cn } from "../../lib/cn";
import { GripVerticalIcon } from "../../lib/icons";
import {
  resizableHandleGripIconVariants,
  resizableHandleGripVariants,
  resizableHandleVariants,
  resizablePanelGroupVariants,
  resizablePanelVariants,
} from "./resizable.variants";

export type ResizablePanelGroupProps = GroupProps;

/**
 * Horizontal or vertical group of resizable panels.
 *
 * @example
 * ```tsx
 * <ResizablePanelGroup orientation="horizontal">
 *   <ResizablePanel defaultSize={50}>Left</ResizablePanel>
 *   <ResizableHandle />
 *   <ResizablePanel defaultSize={50}>Right</ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 */
export const ResizablePanelGroup = ({ className, ...props }: ResizablePanelGroupProps) => (
  <Group className={cn(resizablePanelGroupVariants(), className)} {...props} />
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

export type PersistedResizablePanelGroupProps = ResizablePanelGroupProps & {
  /** Unique id used to persist layout in `localStorage`. */
  autoSaveId: string;
  /** Panel ids for conditional layouts — must match mounted panels. */
  panelIds?: string[];
};

/**
 * Resizable panel group that remembers layout between sessions via `localStorage`.
 */
export function PersistedResizablePanelGroup({
  autoSaveId,
  panelIds,
  defaultLayout,
  onLayoutChanged,
  id,
  ...props
}: PersistedResizablePanelGroupProps) {
  const { defaultLayout: storedLayout, onLayoutChanged: persistLayout } = useDefaultLayout({
    id: autoSaveId,
    panelIds,
  });

  return (
    <ResizablePanelGroup
      id={id ?? autoSaveId}
      defaultLayout={defaultLayout ?? storedLayout}
      onLayoutChanged={(layout) => {
        persistLayout(layout);
        onLayoutChanged?.(layout);
      }}
      {...props}
    />
  );
}

export type UsePersistedPanelLayoutOptions = {
  /** Unique storage id for the layout group. */
  autoSaveId: string;
  panelIds?: string[];
};

/** Hook to wire {@link ResizablePanelGroup} to persisted layout storage. */
export function usePersistedPanelLayout({ autoSaveId, panelIds }: UsePersistedPanelLayoutOptions) {
  return useDefaultLayout({ id: autoSaveId, panelIds });
}

export type ResizablePanelProps = PanelProps;

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, ...props }, ref) => (
    <Panel elementRef={ref} className={cn(resizablePanelVariants(), className)} {...props} />
  ),
);
ResizablePanel.displayName = "ResizablePanel";

export type ResizableHandleProps = ComponentPropsWithoutRef<typeof Separator> & {
  withHandle?: boolean;
};

export const ResizableHandle = ({
  className,
  withHandle = false,
  ...props
}: ResizableHandleProps) => (
  <Separator className={cn(resizableHandleVariants(), className)} {...props}>
    {withHandle ? (
      <div className={resizableHandleGripVariants()}>
        <GripVerticalIcon className={resizableHandleGripIconVariants()} />
      </div>
    ) : null}
  </Separator>
);
ResizableHandle.displayName = "ResizableHandle";

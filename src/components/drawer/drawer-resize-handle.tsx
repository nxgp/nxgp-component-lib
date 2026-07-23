import { type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { drawerResizeHandleDomeVariants, drawerResizeHandleVariants } from "./drawer.variants";
import type { DrawerDirection } from "./drawer-context";

const MIN_SIZE_RATIO = 0.2;
const MAX_SIZE_RATIO = 0.95;

function clampSize(value: number, direction: DrawerDirection): number {
  const viewport =
    direction === "left" || direction === "right" ? window.innerWidth : window.innerHeight;
  return Math.min(Math.max(value, viewport * MIN_SIZE_RATIO), viewport * MAX_SIZE_RATIO);
}

function getPointerSize(clientX: number, clientY: number, direction: DrawerDirection): number {
  switch (direction) {
    case "bottom":
      return window.innerHeight - clientY;
    case "top":
      return clientY;
    case "right":
      return window.innerWidth - clientX;
    case "left":
      return clientX;
  }
}

export type DrawerResizeHandleProps = {
  direction: DrawerDirection;
  onResize: (size: number) => void;
  className?: string;
};

/**
 * Border-mounted dome handle for resizing a drawer along its open axis.
 */
export function DrawerResizeHandle({ direction, onResize, className }: DrawerResizeHandleProps) {
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      draggingRef.current = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      onResize(clampSize(getPointerSize(event.clientX, event.clientY, direction), direction));
    },
    [direction, onResize],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!draggingRef.current) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      onResize(clampSize(getPointerSize(event.clientX, event.clientY, direction), direction));
    },
    [direction, onResize],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) {
      return;
    }
    draggingRef.current = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <button
      type="button"
      aria-label="Resize drawer"
      data-slot="drawer-resize-handle"
      data-dragging={isDragging ? "" : undefined}
      className={cn(drawerResizeHandleVariants({ direction }), className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <span
        aria-hidden="true"
        data-slot="drawer-resize-handle-dome"
        className={cn(drawerResizeHandleDomeVariants({ direction }), isDragging && "bg-accent")}
      />
    </button>
  );
}
